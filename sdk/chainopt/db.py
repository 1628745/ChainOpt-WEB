"""Supabase client helpers for the ChainOpt calls table."""

from __future__ import annotations

import os
from typing import Any, Mapping, Optional

from dotenv import load_dotenv
from supabase import Client, create_client

# Columns required by PLAN.md Track A Day 1.
CALLS_COLUMNS = (
    "timestamp",
    "model",
    "prompt_tokens",
    "completion_tokens",
    "cost",
    "latency_ms",
    "prompt",
    "response",
    "session_id",
    "call_order",
    "pipeline_id",
    "file_path",
    "line_number",
)

_client: Optional[Client] = None


def _load_env() -> None:
    # Prefer project-root .env / .env.local without overriding real env.
    load_dotenv(".env", override=False)
    load_dotenv(".env.local", override=False)


def get_supabase_credentials() -> tuple[str, str]:
    """Return (url, key) from env. Accepts NEXT_PUBLIC_* aliases from .env.local."""
    _load_env()
    url = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    key = (
        os.getenv("SUPABASE_KEY")
        or os.getenv("SUPABASE_ANON_KEY")
        or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    )
    if not url or not key:
        raise RuntimeError(
            "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_KEY "
            "(or NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)."
        )
    return url, key


def get_client() -> Client:
    """Lazy singleton Supabase client."""
    global _client
    if _client is None:
        url, key = get_supabase_credentials()
        _client = create_client(url, key)
    return _client


def reset_client() -> None:
    """Clear the cached client (useful in tests)."""
    global _client
    _client = None


def insert_call(row: Mapping[str, Any], *, client: Optional[Client] = None) -> dict[str, Any]:
    """Insert one row into public.calls and return the inserted record."""
    payload = {k: row[k] for k in CALLS_COLUMNS if k in row}
    # timestamp is optional — DB default is now()
    if "timestamp" not in payload:
        payload.pop("timestamp", None)
    sb = client or get_client()
    result = sb.table("calls").insert(payload).execute()
    if not result.data:
        raise RuntimeError("Insert into calls returned no data")
    return result.data[0]


def fetch_call(call_id: str, *, client: Optional[Client] = None) -> Optional[dict[str, Any]]:
    sb = client or get_client()
    result = sb.table("calls").select("*").eq("id", call_id).limit(1).execute()
    if not result.data:
        return None
    return result.data[0]


def delete_call(call_id: str, *, client: Optional[Client] = None) -> None:
    sb = client or get_client()
    sb.table("calls").delete().eq("id", call_id).execute()
