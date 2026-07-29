"""Track B: `chainopt analyze` discovery + Claude JSON → pipeline_map.json."""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any, Sequence

import pytest

from chainopt_analyze.analyze import analyze_directory
from chainopt_analyze.discover import discover_pipeline_files, file_references_pipeline
from chainopt_analyze.llm import parse_pipeline_map, request_pipeline_map

ROOT = Path(__file__).resolve().parents[1]
CLI = ROOT / "cli"
SDK = ROOT / "sdk"
FIXTURES = Path(__file__).resolve().parent / "fixtures"

FIXTURE_CASES = (
    "simple_linear",
    "branching_router",
    "langchain_chains",
)


def _run_chainopt(*args: str, cwd: Path | None = None) -> subprocess.CompletedProcess:
    cmd_env = os.environ.copy()
    cmd_env["PYTHONPATH"] = (
        str(CLI) + os.pathsep + str(SDK) + os.pathsep + cmd_env.get("PYTHONPATH", "")
    )
    return subprocess.run(
        [sys.executable, "-m", "chainopt_analyze", *args],
        cwd=cwd or ROOT,
        env=cmd_env,
        capture_output=True,
        text=True,
    )


def _load_expected(stem: str) -> dict[str, Any]:
    return json.loads((FIXTURES / f"{stem}.expected.json").read_text(encoding="utf-8"))


def _assert_rough_structure(actual: dict[str, Any], expected: dict[str, Any]) -> None:
    """Confirm nodes/edges shape and that expected node ids / edge pairs appear."""
    assert "nodes" in actual and "edges" in actual
    assert isinstance(actual["nodes"], list)
    assert isinstance(actual["edges"], list)

    actual_ids = {n["id"] for n in actual["nodes"]}
    expected_ids = {n["id"] for n in expected["nodes"]}
    assert expected_ids <= actual_ids, f"missing nodes: {expected_ids - actual_ids}"

    for exp_node in expected["nodes"]:
        matches = [n for n in actual["nodes"] if n["id"] == exp_node["id"]]
        assert matches, f"node {exp_node['id']!r} missing"
        node = matches[0]
        for key in ("id", "file", "line", "inferred_purpose", "model_if_hardcoded"):
            assert key in node
        assert isinstance(node["line"], int)
        assert isinstance(node["inferred_purpose"], str) and node["inferred_purpose"]
        # File basename should match even if path is prefixed.
        assert Path(node["file"]).name == Path(exp_node["file"]).name
        if exp_node["model_if_hardcoded"] is not None:
            assert node["model_if_hardcoded"] == exp_node["model_if_hardcoded"]

    actual_edges = {(e["from"], e["to"]) for e in actual["edges"]}
    expected_edges = {(e["from"], e["to"]) for e in expected["edges"]}
    assert expected_edges <= actual_edges, (
        f"missing edges: {expected_edges - actual_edges}"
    )


def _canned_completer(expected: dict[str, Any]):
    def complete(_system: str, _files: Sequence[tuple[str, str]]) -> str:
        return json.dumps(expected)

    return complete


@pytest.mark.parametrize("stem", FIXTURE_CASES)
def test_fixtures_are_detected_as_pipeline_files(stem: str):
    source = (FIXTURES / f"{stem}.py").read_text(encoding="utf-8")
    assert file_references_pipeline(source)
    found = discover_pipeline_files(FIXTURES / f"{stem}.py")
    assert found == [(FIXTURES / f"{stem}.py").resolve()]


def test_discover_skips_unrelated_python(tmp_path: Path):
    unrelated = tmp_path / "helpers.py"
    unrelated.write_text("def add(a, b):\n    return a + b\n", encoding="utf-8")
    assert discover_pipeline_files(tmp_path) == []


@pytest.mark.parametrize("stem", FIXTURE_CASES)
def test_analyze_writes_pipeline_map_matching_expected(stem: str, tmp_path: Path):
    expected = _load_expected(stem)
    fixture = FIXTURES / f"{stem}.py"
    out = tmp_path / "pipeline_map.json"

    result = analyze_directory(
        fixture,
        output=out,
        completer=_canned_completer(expected),
    )

    assert out.is_file()
    written = json.loads(out.read_text(encoding="utf-8"))
    assert written == result
    _assert_rough_structure(result, expected)


def test_analyze_cli_subcommand(tmp_path: Path):
    # CLI path smoke-test: unrelated sources → empty map, no Claude call needed.
    empty = tmp_path / "empty_src"
    empty.mkdir()
    (empty / "noop.py").write_text("x = 1\n", encoding="utf-8")
    out = tmp_path / "pipeline_map.json"

    result = _run_chainopt("analyze", str(empty), "--output", str(out), cwd=tmp_path)
    assert result.returncode == 0, result.stderr
    assert out.is_file()
    data = json.loads(out.read_text(encoding="utf-8"))
    assert data == {"nodes": [], "edges": []}

    help_result = _run_chainopt("analyze", "--help")
    assert help_result.returncode == 0
    assert "pipeline" in help_result.stdout.lower() or "analyze" in help_result.stdout.lower()


def test_request_pipeline_map_retries_once_on_invalid_json():
    calls = {"n": 0}
    expected = {
        "nodes": [
            {
                "id": "n1",
                "file": "a.py",
                "line": 1,
                "inferred_purpose": "generation",
                "model_if_hardcoded": None,
            }
        ],
        "edges": [],
    }

    def flaky(_system: str, _files: Sequence[tuple[str, str]]) -> str:
        calls["n"] += 1
        if calls["n"] == 1:
            return "NOT JSON {"
        return json.dumps(expected)

    result = request_pipeline_map([("a.py", "ChatOpenAI")], completer=flaky)
    assert calls["n"] == 2
    assert result["nodes"][0]["id"] == "n1"


def test_request_pipeline_map_fails_after_retry():
    def always_bad(_system: str, _files: Sequence[tuple[str, str]]) -> str:
        return "still not json"

    with pytest.raises(ValueError, match="after retry"):
        request_pipeline_map([("a.py", "StateGraph")], completer=always_bad)


def test_parse_pipeline_map_strips_markdown_fences():
    payload = {
        "nodes": [
            {
                "id": "x",
                "file": "f.py",
                "line": 3,
                "inferred_purpose": "routing",
                "model_if_hardcoded": None,
            }
        ],
        "edges": [],
    }
    fenced = "```json\n" + json.dumps(payload) + "\n```"
    assert parse_pipeline_map(fenced) == payload


def _anthropic_key_available() -> bool:
    try:
        from dotenv import load_dotenv

        load_dotenv(ROOT / ".env", override=False)
        load_dotenv(ROOT / ".env.local", override=False)
    except ImportError:
        pass
    return bool(os.environ.get("ANTHROPIC_API_KEY"))


@pytest.mark.skipif(
    not _anthropic_key_available(),
    reason="ANTHROPIC_API_KEY not set — skipping live Claude analyze",
)
def test_live_claude_analyze_simple_linear(tmp_path: Path):
    """End-to-end against the real Anthropic API (runs only when key is present)."""
    expected = _load_expected("simple_linear")
    out = tmp_path / "pipeline_map.json"
    result = analyze_directory(FIXTURES / "simple_linear.py", output=out)
    assert out.is_file()
    _assert_rough_structure(result, expected)
