"""Estimate USD cost from real token counts and published model rates."""

from __future__ import annotations

# Prices are USD per 1M tokens (input, output). Sourced from public provider pricing.
# Unknown models return 0.0 rather than inventing a number.
_PRICING: dict[str, tuple[float, float]] = {
    # OpenAI
    "gpt-4o": (2.50, 10.00),
    "gpt-4o-2024-08-06": (2.50, 10.00),
    "gpt-4o-mini": (0.15, 0.60),
    "gpt-4o-mini-2024-07-18": (0.15, 0.60),
    "gpt-4.1": (2.00, 8.00),
    "gpt-4.1-mini": (0.40, 1.60),
    "gpt-4.1-nano": (0.10, 0.40),
    "o1": (15.00, 60.00),
    "o1-mini": (1.10, 4.40),
    "o3-mini": (1.10, 4.40),
    # Anthropic
    "claude-opus-4-20250514": (15.00, 75.00),
    "claude-sonnet-4-20250514": (3.00, 15.00),
    "claude-3-7-sonnet-20250219": (3.00, 15.00),
    "claude-3-5-sonnet-20241022": (3.00, 15.00),
    "claude-3-5-sonnet-latest": (3.00, 15.00),
    "claude-3-5-haiku-20241022": (0.80, 4.00),
    "claude-3-5-haiku-latest": (0.80, 4.00),
    "claude-3-opus-20240229": (15.00, 75.00),
    "claude-3-sonnet-20240229": (3.00, 15.00),
    "claude-3-haiku-20240307": (0.25, 1.25),
}


def _lookup_rates(model: str) -> tuple[float, float] | None:
    if model in _PRICING:
        return _PRICING[model]
    # Prefix match for dated variants, e.g. gpt-4o-mini-YYYY-MM-DD
    for key, rates in _PRICING.items():
        if model.startswith(key):
            return rates
    return None


def estimate_cost(model: str, prompt_tokens: int, completion_tokens: int) -> float:
    """Return USD cost from token counts. 0.0 if the model rate is unknown."""
    rates = _lookup_rates(model)
    if rates is None:
        return 0.0
    input_rate, output_rate = rates
    return (prompt_tokens / 1_000_000) * input_rate + (completion_tokens / 1_000_000) * output_rate
