"""Unified `chainopt` entry point — analyze (Track B) + SDK run (Track A).

Lives outside /sdk so Track A code stays untouched. Delegates `run` and other
SDK commands to chainopt.cli.main.
"""

from __future__ import annotations

import sys
from typing import Optional, Sequence


def main(argv: Optional[Sequence[str]] = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)

    if argv and argv[0] == "analyze":
        from chainopt_analyze.analyze import run_analyze_argv

        return run_analyze_argv(argv[1:])

    # Preserve Track A behavior for `chainopt run -- ...` and help.
    from chainopt.cli import main as sdk_main

    return sdk_main(argv)


if __name__ == "__main__":
    raise SystemExit(main())
