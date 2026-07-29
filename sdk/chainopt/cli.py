"""ChainOpt CLI — `chainopt run -- script.py [args...]`."""

from __future__ import annotations

import argparse
import runpy
import sys
from typing import Optional, Sequence


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="chainopt",
        description="ChainOpt SDK — instrument LLM pipelines",
    )
    sub = parser.add_subparsers(dest="command")

    run_parser = sub.add_parser(
        "run",
        help="Install instrumentation, then run a Python script",
        usage="chainopt run -- script.py [args...]",
    )
    run_parser.add_argument(
        "script_and_args",
        nargs=argparse.REMAINDER,
        help="Use `--` then the script path and its arguments",
    )
    return parser


def run_script(argv: Sequence[str]) -> int:
    """Install the httpx patch and execute a user script. Returns exit code."""
    args = list(argv)
    if args and args[0] == "--":
        args = args[1:]
    if not args:
        print(
            "usage: chainopt run -- script.py [args...]\n"
            "error: missing script after `run --`",
            file=sys.stderr,
        )
        return 2

    script, script_args = args[0], args[1:]

    # Late import so `chainopt --help` stays light.
    from chainopt import init

    init()
    sys.argv = [script, *script_args]
    try:
        runpy.run_path(script, run_name="__main__")
    except SystemExit as exc:
        code = exc.code
        if code is None:
            return 0
        if isinstance(code, int):
            return code
        print(code, file=sys.stderr)
        return 1
    return 0


def main(argv: Optional[Sequence[str]] = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    parser = _build_parser()

    if not argv:
        parser.print_help(sys.stderr)
        return 2

    # `chainopt run -- script.py` — argparse REMAINDER keeps everything after run.
    if argv[0] == "run":
        rest = argv[1:]
        if not rest or rest[0] != "--":
            print(
                "usage: chainopt run -- script.py [args...]\n"
                "error: expected `run --` before the script path",
                file=sys.stderr,
            )
            return 2
        return run_script(rest)

    args = parser.parse_args(argv)
    if args.command is None:
        parser.print_help(sys.stderr)
        return 2
    parser.print_help(sys.stderr)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
