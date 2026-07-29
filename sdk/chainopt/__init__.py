"""ChainOpt SDK — instrument LLM HTTP calls and log them to Supabase."""

from chainopt.db import CALLS_COLUMNS, delete_call, fetch_call, insert_call

__all__ = [
    "CALLS_COLUMNS",
    "delete_call",
    "fetch_call",
    "init",
    "insert_call",
]


def init() -> None:
    """Install the httpx transport patch (Track A Day 5)."""
    raise NotImplementedError("chainopt.init() lands in Track A Day 5")
