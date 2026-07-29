"""Day 2-3: httpx patch intercepts OpenAI/Anthropic hosts and logs call fields."""

from __future__ import annotations

import json

import httpx
import pytest

from chainopt import patch as chainopt_patch
from chainopt.cost import estimate_cost
from chainopt.session import reset_session


OPENAI_REQUEST = {
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Say hello"}],
}
OPENAI_RESPONSE = {
    "id": "chatcmpl-test",
    "model": "gpt-4o-mini",
    "choices": [{"message": {"role": "assistant", "content": "hello"}, "index": 0}],
    "usage": {"prompt_tokens": 10, "completion_tokens": 2, "total_tokens": 12},
}

ANTHROPIC_REQUEST = {
    "model": "claude-3-5-haiku-20241022",
    "max_tokens": 64,
    "messages": [{"role": "user", "content": "Say hi"}],
}
ANTHROPIC_RESPONSE = {
    "id": "msg_test",
    "model": "claude-3-5-haiku-20241022",
    "role": "assistant",
    "content": [{"type": "text", "text": "hi"}],
    "usage": {"input_tokens": 8, "output_tokens": 1},
}


@pytest.fixture
def logged_rows():
    rows: list[dict] = []
    reset_session("test-session-patch")
    chainopt_patch.uninstall()
    chainopt_patch.install(log_fn=rows.append)
    yield rows
    chainopt_patch.uninstall()
    reset_session()


def _openai_handler(request: httpx.Request) -> httpx.Response:
    assert "api.openai.com" in request.url.host
    return httpx.Response(200, json=OPENAI_RESPONSE)


def _anthropic_handler(request: httpx.Request) -> httpx.Response:
    assert "api.anthropic.com" in request.url.host
    return httpx.Response(200, json=ANTHROPIC_RESPONSE)


def _other_handler(request: httpx.Request) -> httpx.Response:
    return httpx.Response(200, json={"ok": True})


def test_is_llm_host_detects_providers():
    assert chainopt_patch.is_llm_host("api.openai.com")
    assert chainopt_patch.is_llm_host("api.anthropic.com")
    assert not chainopt_patch.is_llm_host("zhflsnfxkldkzgbglizq.supabase.co")
    assert not chainopt_patch.is_llm_host("example.com")


def test_patch_logs_openai_chat_completion(logged_rows):
    transport = httpx.MockTransport(_openai_handler)
    with httpx.Client(transport=transport, base_url="https://api.openai.com") as client:
        resp = client.post("/v1/chat/completions", json=OPENAI_REQUEST)
        assert resp.status_code == 200

    assert len(logged_rows) == 1
    row = logged_rows[0]
    assert row["model"] == "gpt-4o-mini"
    assert row["prompt_tokens"] == 10
    assert row["completion_tokens"] == 2
    assert row["prompt"] == "user: Say hello"
    assert row["response"] == "hello"
    assert row["session_id"] == "test-session-patch"
    assert row["call_order"] == 1
    assert row["latency_ms"] >= 0
    expected_cost = estimate_cost("gpt-4o-mini", 10, 2)
    assert row["cost"] == expected_cost
    assert expected_cost == pytest.approx((10 / 1_000_000) * 0.15 + (2 / 1_000_000) * 0.60)
    assert row["file_path"] is not None
    assert "test_httpx_patch.py" in row["file_path"]
    assert isinstance(row["line_number"], int)
    assert row["line_number"] > 0


def test_patch_logs_anthropic_messages(logged_rows):
    transport = httpx.MockTransport(_anthropic_handler)
    with httpx.Client(transport=transport, base_url="https://api.anthropic.com") as client:
        resp = client.post(
            "/v1/messages",
            json=ANTHROPIC_REQUEST,
            headers={"anthropic-version": "2023-06-01"},
        )
        assert resp.status_code == 200

    assert len(logged_rows) == 1
    row = logged_rows[0]
    assert row["model"] == "claude-3-5-haiku-20241022"
    assert row["prompt_tokens"] == 8
    assert row["completion_tokens"] == 1
    assert "user: Say hi" in row["prompt"]
    assert row["response"] == "hi"
    assert row["call_order"] == 1


def test_patch_ignores_non_llm_hosts(logged_rows):
    transport = httpx.MockTransport(_other_handler)
    with httpx.Client(transport=transport, base_url="https://example.com") as client:
        resp = client.get("/health")
        assert resp.status_code == 200
        assert resp.json() == {"ok": True}

    assert logged_rows == []


def test_patch_increments_call_order_within_session(logged_rows):
    transport = httpx.MockTransport(_openai_handler)
    with httpx.Client(transport=transport, base_url="https://api.openai.com") as client:
        client.post("/v1/chat/completions", json=OPENAI_REQUEST)
        client.post("/v1/chat/completions", json=OPENAI_REQUEST)

    assert [r["call_order"] for r in logged_rows] == [1, 2]
    assert logged_rows[0]["session_id"] == logged_rows[1]["session_id"]


def test_request_body_still_available_to_handler(logged_rows):
    """Ensure we don't empty the request body before the real send."""
    seen = {}

    def handler(request: httpx.Request) -> httpx.Response:
        seen["body"] = json.loads(request.content.decode())
        return httpx.Response(200, json=OPENAI_RESPONSE)

    transport = httpx.MockTransport(handler)
    with httpx.Client(transport=transport, base_url="https://api.openai.com") as client:
        client.post("/v1/chat/completions", json=OPENAI_REQUEST)

    assert seen["body"]["model"] == "gpt-4o-mini"
    assert len(logged_rows) == 1
