"""Day 5: `chainopt run --` wraps a script with the httpx patch installed."""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
SDK = ROOT / "sdk"


def _run_chainopt(*args: str, env: dict | None = None) -> subprocess.CompletedProcess:
    cmd_env = os.environ.copy()
    cmd_env["PYTHONPATH"] = str(SDK) + os.pathsep + cmd_env.get("PYTHONPATH", "")
    if env:
        cmd_env.update(env)
    return subprocess.run(
        [sys.executable, "-m", "chainopt", *args],
        cwd=ROOT,
        env=cmd_env,
        capture_output=True,
        text=True,
    )


def test_run_requires_double_dash_separator():
    result = _run_chainopt("run", "script.py")
    assert result.returncode != 0
    assert "run --" in result.stderr.lower() or "usage" in result.stderr.lower()


def test_run_executes_script_with_patch_installed(tmp_path: Path):
    script = tmp_path / "probe.py"
    script.write_text(
        "\n".join(
            [
                "from chainopt import patch as chainopt_patch",
                "import httpx",
                "print('installed=' + str(chainopt_patch.is_installed()))",
                "print('host_openai=' + str(chainopt_patch.is_llm_host('api.openai.com')))",
            ]
        )
        + "\n"
    )

    result = _run_chainopt("run", "--", str(script))
    assert result.returncode == 0, result.stderr
    assert "installed=True" in result.stdout
    assert "host_openai=True" in result.stdout


def test_run_forwards_script_args(tmp_path: Path):
    script = tmp_path / "echo_args.py"
    script.write_text("import sys\nprint('ARGS=' + ','.join(sys.argv[1:]))\n")

    result = _run_chainopt("run", "--", str(script), "--flag", "value")
    assert result.returncode == 0, result.stderr
    assert "ARGS=--flag,value" in result.stdout


def test_run_propagates_script_exit_code(tmp_path: Path):
    script = tmp_path / "fail.py"
    script.write_text("raise SystemExit(7)\n")

    result = _run_chainopt("run", "--", str(script))
    assert result.returncode == 7
