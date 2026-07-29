"""httpx Client.send / AsyncClient.send patch that logs LLM calls to Supabase."""

from __future__ import annotations

import inspect
import time
from typing import Any, Callable, Optional
from urllib.parse import urlparse

import httpx

from chainopt.cost import estimate_cost
from chainopt.db import insert_call
from chainopt.parse import extract_for_host
from chainopt.session import get_session_id, next_call_order

LLM_HOST_MARKERS = (
    "api.openai.com",
    "openai.azure.com",
    "api.anthropic.com",
)

# Hosts we must never treat as LLM traffic (including our own logger).
_SKIP_HOST_MARKERS = (
    "supabase.co",
    "supabase.in",
)

_PATCHED = False
_orig_sync_send: Optional[Callable[..., Any]] = None
_orig_async_send: Optional[Callable[..., Any]] = None
_log_fn: Callable[[dict[str, Any]], Any] = insert_call


def is_llm_host(host: str) -> bool:
    host = (host or "").lower()
    if any(marker in host for marker in _SKIP_HOST_MARKERS):
        return False
    return any(marker in host for marker in LLM_HOST_MARKERS)


def _request_host(request: httpx.Request) -> str:
    return request.url.host or urlparse(str(request.url)).hostname or ""


def _caller_file_line() -> tuple[Optional[str], Optional[int]]:
    """Walk the stack to the first frame outside chainopt / httpx / SDKs."""
    # Match path segments so we don't skip user files like test_httpx_patch.py.
    skip_substrings = (
        "/site-packages/",
        "/dist-packages/",
        "/.venv/",
        "/venv/",
        "/_pytest/",
        "/pluggy/",
    )
    skip_segments = {
        "chainopt",
        "httpx",
        "httpcore",
        "openai",
        "anthropic",
        "anyio",
        "asyncio",
        "pytest",
        "py.test",
        "python",
        "python3",
    }
    for frame_info in inspect.stack():
        filename = frame_info.filename
        if filename.startswith("<"):
            continue
        normalized = filename.replace("\\", "/")
        if any(part in normalized for part in skip_substrings):
            continue
        parts = normalized.split("/")
        if any(part in skip_segments for part in parts):
            continue
        return filename, frame_info.lineno
    return None, None


def _read_request_body(request: httpx.Request) -> bytes:
    body = request.content
    if body:
        return body
    # Some clients stream; try to read without consuming permanently.
    try:
        return request.read()
    except Exception:
        return b""


def _log_llm_call(
    request: httpx.Request,
    response: httpx.Response,
    latency_ms: int,
) -> None:
    host = _request_host(request)
    if not is_llm_host(host):
        return

    request_body = _read_request_body(request)
    try:
        response.read()
    except Exception:
        pass
    response_body = response.content or b""

    extracted = extract_for_host(host, request_body, response_body)
    if extracted is None:
        return

    prompt_tokens = int(extracted["prompt_tokens"])
    completion_tokens = int(extracted["completion_tokens"])
    model = extracted["model"]
    file_path, line_number = _caller_file_line()

    row = {
        "model": model,
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
        "cost": estimate_cost(model, prompt_tokens, completion_tokens),
        "latency_ms": latency_ms,
        "prompt": extracted["prompt"],
        "response": extracted["response"],
        "session_id": get_session_id(),
        "call_order": next_call_order(),
        "pipeline_id": None,
        "file_path": file_path,
        "line_number": line_number,
    }
    try:
        _log_fn(row)
    except Exception:
        # Logging must never break the user's LLM call.
        pass


def _patched_sync_send(self: httpx.Client, request: httpx.Request, *args: Any, **kwargs: Any) -> httpx.Response:
    assert _orig_sync_send is not None
    if not is_llm_host(_request_host(request)):
        return _orig_sync_send(self, request, *args, **kwargs)

    start = time.perf_counter()
    response = _orig_sync_send(self, request, *args, **kwargs)
    latency_ms = int((time.perf_counter() - start) * 1000)
    _log_llm_call(request, response, latency_ms)
    return response


async def _patched_async_send(
    self: httpx.AsyncClient, request: httpx.Request, *args: Any, **kwargs: Any
) -> httpx.Response:
    assert _orig_async_send is not None
    if not is_llm_host(_request_host(request)):
        return await _orig_async_send(self, request, *args, **kwargs)

    start = time.perf_counter()
    response = await _orig_async_send(self, request, *args, **kwargs)
    latency_ms = int((time.perf_counter() - start) * 1000)
    _log_llm_call(request, response, latency_ms)
    return response


def install(*, log_fn: Optional[Callable[[dict[str, Any]], Any]] = None) -> None:
    """Monkey-patch httpx Client.send / AsyncClient.send. Idempotent."""
    global _PATCHED, _orig_sync_send, _orig_async_send, _log_fn
    if log_fn is not None:
        _log_fn = log_fn
    if _PATCHED:
        return
    _orig_sync_send = httpx.Client.send
    _orig_async_send = httpx.AsyncClient.send
    httpx.Client.send = _patched_sync_send  # type: ignore[method-assign]
    httpx.AsyncClient.send = _patched_async_send  # type: ignore[method-assign]
    _PATCHED = True


def uninstall() -> None:
    """Restore original httpx send methods."""
    global _PATCHED, _orig_sync_send, _orig_async_send, _log_fn
    if not _PATCHED:
        return
    if _orig_sync_send is not None:
        httpx.Client.send = _orig_sync_send  # type: ignore[method-assign]
    if _orig_async_send is not None:
        httpx.AsyncClient.send = _orig_async_send  # type: ignore[method-assign]
    _orig_sync_send = None
    _orig_async_send = None
    _log_fn = insert_call
    _PATCHED = False


def is_installed() -> bool:
    return _PATCHED
