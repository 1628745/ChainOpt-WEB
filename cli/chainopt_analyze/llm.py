"""Claude client + JSON schema validation for pipeline maps."""

from __future__ import annotations

import json
import os
import re
from typing import Any, Callable, Mapping, Optional, Sequence

SYSTEM_PROMPT = """You are a static analyzer for LangChain and LangGraph Python pipelines.
Given one or more source files, extract the LLM/pipeline call graph.

Return ONLY valid JSON. No markdown fences, no commentary, no trailing text.
The JSON must match this schema exactly:

{
  "nodes": [
    {
      "id": "<stable node id, usually the graph node name or function name>",
      "file": "<path as provided in the input>",
      "line": <1-based line number where the node/call is defined>,
      "inferred_purpose": "<short purpose: extraction|routing|summarization|generation|validation|classification|other>",
      "model_if_hardcoded": "<model string if literally present in source, else null>"
    }
  ],
  "edges": [
    {"from": "<node id>", "to": "<node id>"}
  ]
}

Rules:
- Prefer graph node names from add_node(...) when present.
- Include START/END only if they appear as explicit edge endpoints in the source.
- inferred_purpose should be a concise lowercase label.
- model_if_hardcoded must be null when the model is not a string literal in source.
"""

Completer = Callable[[str, Sequence[tuple[str, str]]], str]

_FENCE_RE = re.compile(r"^```(?:json)?\s*|\s*```$", re.IGNORECASE | re.MULTILINE)


def build_user_prompt(files: Sequence[tuple[str, str]]) -> str:
    """Format (path, source) pairs for the user message."""
    parts: list[str] = [
        "Analyze these pipeline source files and return the JSON pipeline map.",
        "",
    ]
    for path, source in files:
        parts.append(f"----- FILE: {path} -----")
        parts.append(source)
        parts.append("")
    return "\n".join(parts)


def strip_code_fences(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = _FENCE_RE.sub("", cleaned).strip()
    return cleaned


def parse_pipeline_map(text: str) -> dict[str, Any]:
    """Parse and validate a pipeline map JSON string. Raises ValueError on failure."""
    cleaned = strip_code_fences(text)
    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        raise ValueError(f"response is not valid JSON: {exc}") from exc
    return validate_pipeline_map(data)


def validate_pipeline_map(data: Any) -> dict[str, Any]:
    """Ensure *data* matches the nodes/edges schema."""
    if not isinstance(data, dict):
        raise ValueError("pipeline map must be a JSON object")

    if "nodes" not in data or "edges" not in data:
        raise ValueError("pipeline map must contain 'nodes' and 'edges'")

    nodes = data["nodes"]
    edges = data["edges"]
    if not isinstance(nodes, list) or not isinstance(edges, list):
        raise ValueError("'nodes' and 'edges' must be arrays")

    normalized_nodes: list[dict[str, Any]] = []
    for i, node in enumerate(nodes):
        if not isinstance(node, Mapping):
            raise ValueError(f"nodes[{i}] must be an object")
        for key in ("id", "file", "line", "inferred_purpose", "model_if_hardcoded"):
            if key not in node:
                raise ValueError(f"nodes[{i}] missing required field '{key}'")
        if not isinstance(node["id"], str) or not node["id"]:
            raise ValueError(f"nodes[{i}].id must be a non-empty string")
        if not isinstance(node["file"], str):
            raise ValueError(f"nodes[{i}].file must be a string")
        if not isinstance(node["line"], int) or isinstance(node["line"], bool):
            raise ValueError(f"nodes[{i}].line must be an integer")
        if not isinstance(node["inferred_purpose"], str):
            raise ValueError(f"nodes[{i}].inferred_purpose must be a string")
        model = node["model_if_hardcoded"]
        if model is not None and not isinstance(model, str):
            raise ValueError(f"nodes[{i}].model_if_hardcoded must be string or null")
        normalized_nodes.append(
            {
                "id": node["id"],
                "file": node["file"],
                "line": node["line"],
                "inferred_purpose": node["inferred_purpose"],
                "model_if_hardcoded": model,
            }
        )

    normalized_edges: list[dict[str, str]] = []
    for i, edge in enumerate(edges):
        if not isinstance(edge, Mapping):
            raise ValueError(f"edges[{i}] must be an object")
        if "from" not in edge or "to" not in edge:
            raise ValueError(f"edges[{i}] must contain 'from' and 'to'")
        if not isinstance(edge["from"], str) or not isinstance(edge["to"], str):
            raise ValueError(f"edges[{i}].from/to must be strings")
        normalized_edges.append({"from": edge["from"], "to": edge["to"]})

    return {"nodes": normalized_nodes, "edges": normalized_edges}


def default_claude_completer(
    system_prompt: str, files: Sequence[tuple[str, str]]
) -> str:
    """Call Anthropic Messages API and return the raw text response."""
    try:
        import anthropic
    except ImportError as exc:  # pragma: no cover - dependency declared in pyproject
        raise RuntimeError(
            "The 'anthropic' package is required for `chainopt analyze`. "
            "Install with: pip install 'chainopt[analyze]' or pip install anthropic"
        ) from exc

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError(
            "ANTHROPIC_API_KEY is not set. Export it before running `chainopt analyze`."
        )

    model = os.environ.get("CHAINOPT_ANALYZE_MODEL", "claude-sonnet-4-20250514")
    client = anthropic.Anthropic(api_key=api_key)
    message = client.messages.create(
        model=model,
        max_tokens=4096,
        system=system_prompt,
        messages=[{"role": "user", "content": build_user_prompt(files)}],
    )
    chunks: list[str] = []
    for block in message.content:
        text = getattr(block, "text", None)
        if text:
            chunks.append(text)
    return "".join(chunks)


def request_pipeline_map(
    files: Sequence[tuple[str, str]],
    *,
    completer: Optional[Completer] = None,
    system_prompt: str = SYSTEM_PROMPT,
) -> dict[str, Any]:
    """Ask Claude for a pipeline map; validate JSON and retry once on failure."""
    if not files:
        return {"nodes": [], "edges": []}

    complete = completer or default_claude_completer
    last_error: Optional[Exception] = None

    for attempt in range(2):
        try:
            raw = complete(system_prompt, files)
            return parse_pipeline_map(raw)
        except ValueError as exc:
            last_error = exc
            if attempt == 0:
                continue
            break

    raise ValueError(
        f"Claude response was not valid pipeline-map JSON after retry: {last_error}"
    )
