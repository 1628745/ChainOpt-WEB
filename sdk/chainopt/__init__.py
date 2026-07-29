"""ChainOpt SDK — instrument LLM HTTP calls and log them to Supabase."""

from chainopt.db import CALLS_COLUMNS, delete_call, fetch_call, insert_call
from chainopt.patch import install, is_installed, uninstall
from chainopt.session import get_session_id, next_call_order, reset_session

__all__ = [
    "CALLS_COLUMNS",
    "delete_call",
    "fetch_call",
    "get_session_id",
    "init",
    "insert_call",
    "install",
    "is_installed",
    "next_call_order",
    "reset_session",
    "uninstall",
]


def init() -> None:
    """One-liner install: patch httpx so subsequent LLM calls are logged."""
    install()
