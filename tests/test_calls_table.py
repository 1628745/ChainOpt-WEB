"""Day 1: Supabase `calls` table matches PLAN.md and accepts a full row."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

import pytest

from chainopt.db import CALLS_COLUMNS, delete_call, fetch_call, get_client, insert_call, reset_client


REQUIRED_COLUMNS = {
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
}


@pytest.fixture(autouse=True)
def _fresh_client():
    reset_client()
    yield
    reset_client()


def test_calls_columns_constant_matches_plan():
    assert set(CALLS_COLUMNS) == REQUIRED_COLUMNS


def test_calls_table_round_trip():
    """Insert, read, and delete a row covering every PLAN.md field."""
    import os

    if not (
        os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    ) or not (
        os.getenv("SUPABASE_KEY")
        or os.getenv("SUPABASE_ANON_KEY")
        or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    ):
        pytest.skip("Supabase credentials not configured in this environment")

    client = get_client()
    session_id = f"test-day1-{uuid.uuid4().hex[:8]}"
    ts = datetime.now(timezone.utc).isoformat()

    row = {
        "timestamp": ts,
        "model": "gpt-4o-mini",
        "prompt_tokens": 120,
        "completion_tokens": 45,
        "cost": 0.000210,
        "latency_ms": 843,
        "prompt": "Summarize the following text in one sentence.",
        "response": "The text discusses the importance of testing.",
        "session_id": session_id,
        "call_order": 1,
        "pipeline_id": "synthetic",
        "file_path": "cg-test-pipeline.py",
        "line_number": 14,
    }

    inserted = insert_call(row, client=client)
    assert inserted["id"]
    call_id = inserted["id"]

    try:
        fetched = fetch_call(call_id, client=client)
        assert fetched is not None
        assert fetched["model"] == "gpt-4o-mini"
        assert fetched["prompt_tokens"] == 120
        assert fetched["completion_tokens"] == 45
        assert float(fetched["cost"]) == pytest.approx(0.000210)
        assert fetched["latency_ms"] == 843
        assert "Summarize" in fetched["prompt"]
        assert "testing" in fetched["response"]
        assert fetched["session_id"] == session_id
        assert fetched["call_order"] == 1
        assert fetched["pipeline_id"] == "synthetic"
        assert fetched["file_path"] == "cg-test-pipeline.py"
        assert fetched["line_number"] == 14
        assert fetched["timestamp"] is not None
        # Every PLAN.md column is present on the returned row.
        for col in REQUIRED_COLUMNS:
            assert col in fetched
    finally:
        delete_call(call_id, client=client)
        assert fetch_call(call_id, client=client) is None
