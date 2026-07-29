# ChainOpt MVP Plan

MVP only. One flag: oversized model usage. No VS Code extension, no hosted
dashboard, no Stripe, no redundancy or parallelization flag yet.

## Track A: SDK

- [x] Day 1: Supabase `calls` table (timestamp, model, prompt_tokens,
completion_tokens, cost, latency_ms, prompt, response, session_id,
call_order, pipeline_id, file_path, line_number)
- [x] Day 2-3: httpx transport patch, intercept + log calls to known LLM hosts
- Day 4: session id + call order tracking
- Day 5: `chainopt run --` wrapper and `chainopt.init()` one-liner

## Track B: CLI analyzer

- Day 1: CLI scaffold, `chainopt analyze ./src`
- Day 2: file discovery (LangChain/LangGraph signature grep)
- Day 3-4: Claude API call, structured JSON pipeline map
- Day 5: output pipeline_map.json + test fixtures

## Flag engine (days 6-9, needs Track A + B merged)

- Day 6: purpose-to-model-tier reference config
- Day 7: join pipeline_map.json to Supabase calls on file+line
- Day 8: mismatch detection + dollar estimate
- Day 9: validate against synthetic_pipeline.py fixture

## Evidence + report (days 9-11)

- Pull real prompt/response pairs per flag
- chainopt report: static HTML, pipeline map + flag + evidence + estimate

## Onboarding (days 11-13)

- chainopt init: local project key, no login wall
- Both instrumentation paths finished
- README / quickstart

## Validation (days 13-15, hands-on, not automated)

- Re-confirm synthetic fixture
- One real pipeline, fix false positives

