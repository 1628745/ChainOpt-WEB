"""Day 5: chainopt.init() installs the httpx patch."""

from __future__ import annotations

import httpx
import pytest

import chainopt
from chainopt import patch as chainopt_patch
from chainopt.session import reset_session


OPENAI_RESPONSE = {
    "model": "gpt-4o-mini",
    "choices": [{"message": {"role": "assistant", "content": "ok"}, "index": 0}],
    "usage": {"prompt_tokens": 3, "completion_tokens": 1, "total_tokens": 4},
}


@pytest.fixture(autouse=True)
def _clean_patch():
    chainopt_patch.uninstall()
    reset_session("init-test")
    yield
    chainopt_patch.uninstall()


def test_init_installs_httpx_patch():
    assert not chainopt_patch.is_installed()
    chainopt.init()
    assert chainopt_patch.is_installed()


def test_init_is_idempotent():
    chainopt.init()
    chainopt.init()
    assert chainopt_patch.is_installed()


def test_init_causes_llm_calls_to_be_logged(monkeypatch):
    rows: list[dict] = []
    monkeypatch.setattr(chainopt_patch, "_log_fn", rows.append)
    # Re-bind after install uses default; install with custom log via patch.install
    chainopt_patch.uninstall()
    chainopt.init()
    # Swap logger after init for test isolation (no live Supabase).
    monkeypatch.setattr(chainopt_patch, "_log_fn", rows.append)

    transport = httpx.MockTransport(lambda r: httpx.Response(200, json=OPENAI_RESPONSE))
    with httpx.Client(transport=transport, base_url="https://api.openai.com") as client:
        client.post(
            "/v1/chat/completions",
            json={"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "hi"}]},
        )

    assert len(rows) == 1
    assert rows[0]["model"] == "gpt-4o-mini"
