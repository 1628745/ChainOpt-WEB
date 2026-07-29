"""Orchestrate discovery → Claude → pipeline_map.json."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Optional, Sequence

from chainopt_analyze.discover import discover_pipeline_files
from chainopt_analyze.llm import Completer, request_pipeline_map


def _rel_or_str(path: Path, base: Path) -> str:
    try:
        return str(path.resolve().relative_to(base.resolve()))
    except ValueError:
        return str(path.resolve())


def analyze_directory(
    target: str | Path,
    *,
    output: str | Path = "pipeline_map.json",
    completer: Optional[Completer] = None,
) -> dict[str, Any]:
    """Discover pipeline files under *target*, map them, write *output*.

    Returns the parsed pipeline map dict.
    """
    target_path = Path(target)
    output_path = Path(output)

    paths = discover_pipeline_files(target_path)
    base = target_path if target_path.is_dir() else target_path.parent
    files: list[tuple[str, str]] = []
    for path in paths:
        label = _rel_or_str(path, base)
        files.append((label, path.read_text(encoding="utf-8")))

    pipeline_map = request_pipeline_map(files, completer=completer)
    output_path.write_text(
        json.dumps(pipeline_map, indent=2, sort_keys=False) + "\n",
        encoding="utf-8",
    )
    return pipeline_map


def run_analyze_argv(argv: Sequence[str]) -> int:
    """CLI handler for `chainopt analyze <path> [--output PATH]`."""
    import argparse

    parser = argparse.ArgumentParser(
        prog="chainopt analyze",
        description="Statically map LangChain/LangGraph pipelines to pipeline_map.json",
    )
    parser.add_argument(
        "target",
        help="File or directory to analyze (e.g. ./src)",
    )
    parser.add_argument(
        "-o",
        "--output",
        default="pipeline_map.json",
        help="Output path for the pipeline map (default: pipeline_map.json)",
    )
    args = parser.parse_args(list(argv))

    try:
        result = analyze_directory(args.target, output=args.output)
    except FileNotFoundError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    except RuntimeError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    except ValueError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    n_nodes = len(result.get("nodes", []))
    n_edges = len(result.get("edges", []))
    print(
        f"Wrote {args.output} ({n_nodes} nodes, {n_edges} edges)",
        file=sys.stderr,
    )
    return 0
