"""Find Python files that look like LangChain / LangGraph pipelines."""

from __future__ import annotations

from pathlib import Path
from typing import Iterable, Sequence

# Signatures that mark a file as relevant for static analysis.
PIPELINE_SIGNATURES: Sequence[str] = (
    "StateGraph",
    "add_node",
    "add_edge",
    "add_conditional_edges",
    "ChatOpenAI",
    "ChatAnthropic",
    "LLMChain",
    "SequentialChain",
    "SimpleSequentialChain",
    "ConversationChain",
    "RunnableSequence",
    "create_react_agent",
    "create_extraction_chain",
    "create_stuff_documents_chain",
)

_SKIP_DIR_NAMES = {
    ".git",
    ".hg",
    ".svn",
    ".tox",
    ".mypy_cache",
    ".pytest_cache",
    ".ruff_cache",
    ".venv",
    "venv",
    "__pycache__",
    "node_modules",
    "dist",
    "build",
    ".eggs",
}


def file_references_pipeline(source: str) -> bool:
    """Return True if *source* mentions a known LangChain/LangGraph construct."""
    return any(sig in source for sig in PIPELINE_SIGNATURES)


def discover_pipeline_files(target: Path) -> list[Path]:
    """Walk *target* and return Python files that reference pipeline constructs.

    *target* may be a file or a directory. Results are sorted for stability.
    """
    target = target.resolve()
    if not target.exists():
        raise FileNotFoundError(f"analyze target not found: {target}")

    candidates: Iterable[Path]
    if target.is_file():
        if target.suffix != ".py":
            return []
        candidates = [target]
    else:
        candidates = (
            path
            for path in target.rglob("*.py")
            if not any(part in _SKIP_DIR_NAMES for part in path.parts)
        )

    found: list[Path] = []
    for path in candidates:
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError):
            continue
        if file_references_pipeline(text):
            found.append(path)
    return sorted(found)
