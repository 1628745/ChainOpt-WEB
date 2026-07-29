"""Session id and per-process call-order counters for logged LLM calls."""

from __future__ import annotations

import threading
import uuid

_lock = threading.Lock()
_session_id: str | None = None
_call_order: int = 0


def get_session_id() -> str:
    """Return the current session id, creating one on first use."""
    global _session_id
    with _lock:
        if _session_id is None:
            _session_id = str(uuid.uuid4())
        return _session_id


def next_call_order() -> int:
    """Increment and return the call order within the current session."""
    global _call_order
    with _lock:
        _call_order += 1
        return _call_order


def reset_session(session_id: str | None = None) -> str:
    """Start a new session (or set an explicit id) and reset call order to 0."""
    global _session_id, _call_order
    with _lock:
        _session_id = session_id or str(uuid.uuid4())
        _call_order = 0
        return _session_id
