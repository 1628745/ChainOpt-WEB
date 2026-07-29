"""Parse OpenAI / Anthropic request and response bodies for logging fields."""

from __future__ import annotations

import json
from typing import Any, Optional


def _as_dict(body: bytes | str | None) -> dict[str, Any]:
    if body is None:
        return {}
    if isinstance(body, bytes):
        if not body:
            return {}
        text = body.decode("utf-8", errors="replace")
    else:
        text = body
    if not text.strip():
        return {}
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        return {}
    return data if isinstance(data, dict) else {}


def _flatten_openai_messages(messages: list[Any]) -> str:
    parts: list[str] = []
    for msg in messages:
        if not isinstance(msg, dict):
            continue
        role = msg.get("role", "")
        content = msg.get("content", "")
        if isinstance(content, list):
            chunks = []
            for item in content:
                if isinstance(item, dict) and item.get("type") == "text":
                    chunks.append(str(item.get("text", "")))
                else:
                    chunks.append(str(item))
            content = "\n".join(chunks)
        parts.append(f"{role}: {content}")
    return "\n".join(parts)


def _flatten_anthropic_messages(payload: dict[str, Any]) -> str:
    parts: list[str] = []
    system = payload.get("system")
    if isinstance(system, str) and system:
        parts.append(f"system: {system}")
    elif isinstance(system, list):
        for block in system:
            if isinstance(block, dict) and block.get("type") == "text":
                parts.append(f"system: {block.get('text', '')}")
    messages = payload.get("messages") or []
    if isinstance(messages, list):
        parts.append(_flatten_openai_messages(messages))
    return "\n".join(p for p in parts if p)


def extract_openai(request_body: bytes | str | None, response_body: bytes | str | None) -> dict[str, Any]:
    req = _as_dict(request_body)
    resp = _as_dict(response_body)
    usage = resp.get("usage") or {}
    choices = resp.get("choices") or []
    response_text = ""
    if choices and isinstance(choices[0], dict):
        message = choices[0].get("message") or {}
        response_text = str(message.get("content") or "")
    return {
        "model": str(req.get("model") or resp.get("model") or "unknown"),
        "prompt_tokens": int(usage.get("prompt_tokens") or 0),
        "completion_tokens": int(usage.get("completion_tokens") or 0),
        "prompt": _flatten_openai_messages(req.get("messages") or []),
        "response": response_text,
    }


def extract_anthropic(request_body: bytes | str | None, response_body: bytes | str | None) -> dict[str, Any]:
    req = _as_dict(request_body)
    resp = _as_dict(response_body)
    usage = resp.get("usage") or {}
    content = resp.get("content") or []
    chunks: list[str] = []
    if isinstance(content, list):
        for block in content:
            if isinstance(block, dict) and block.get("type") == "text":
                chunks.append(str(block.get("text", "")))
    return {
        "model": str(req.get("model") or resp.get("model") or "unknown"),
        "prompt_tokens": int(usage.get("input_tokens") or 0),
        "completion_tokens": int(usage.get("output_tokens") or 0),
        "prompt": _flatten_anthropic_messages(req),
        "response": "\n".join(chunks),
    }


def extract_for_host(
    host: str,
    request_body: bytes | str | None,
    response_body: bytes | str | None,
) -> Optional[dict[str, Any]]:
    host = host.lower()
    if "openai.com" in host or host.endswith("openai.azure.com"):
        return extract_openai(request_body, response_body)
    if "anthropic.com" in host:
        return extract_anthropic(request_body, response_body)
    return None
