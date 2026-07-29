# ChainOpt

LLM pipeline optimizer. SDK patches httpx to log every LLM call (model, tokens,
cost, latency, prompt, response, session id, call order, file, line) to Supabase.
CLI analyzer reads LangChain/LangGraph/Custom source and maps the call graph. Engine
cross-references the two to flag oversized model usage first.

## Current phase
MVP only. One flag: oversized model usage. No VS Code extension, no hosted
dashboard, no Stripe, no redundancy or parallelization flag yet. If a task seems
to call for one of those, stop and flag it in your summary instead of building it.

## Rules
- Write or update a test before considering any function done.
- Run the full suite before committing. Never commit red.
- Commit after each PLAN.md item is verified, not in bigger batches.
- Cost numbers always come from real token counts in Supabase, never invented.
- End every session with a plain-English summary: what changed, what test proves
  it works, what's next in PLAN.md.

## Stack
Python, Supabase (pgvector), LangChain/LangGraph as the target framework (later, custom), pytest.

## Structure
/sdk — httpx patch and logging
/cli — CLI static analyzer
/engine — oversizing flag logic
/landing-page — already built, don't touch unless asked
/dashboard — web dashboard (ignored in current stage)
/tests
PLAN.md — the phase checklist, keep it updated