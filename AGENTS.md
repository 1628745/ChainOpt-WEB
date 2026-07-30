# ChainOpt

See `CLAUDE.md` and `PLAN.md` for the product overview, current MVP scope, and rules.

## Cursor Cloud specific instructions

The Python package (SDK `/sdk`, CLI analyzer `/cli`, tests `/tests`) is the product
in the current MVP phase. The dependency-refresh update script creates a virtualenv at
`.venv` and installs the package editable with dev extras, so use that interpreter.

### Services and how to run them

- SDK + CLI (`chainopt`). Console entry point installed into `.venv`.
  - `.venv/bin/chainopt run -- your_script.py` installs the httpx patch, then runs the
    script so LLM calls (OpenAI/Anthropic hosts) are intercepted and logged.
  - `.venv/bin/chainopt analyze <dir> --output pipeline_map.json` builds a pipeline map.
    Non-obvious: when it discovers files referencing LangChain/LangGraph pipelines it
    calls the Anthropic API and needs `ANTHROPIC_API_KEY`; a directory with no pipeline
    files produces an empty map with no key (used by the smoke test).

### Test / lint / build

- Tests: `.venv/bin/python -m pytest` (config in `pyproject.toml`; `pythonpath` is set to
  `sdk` + `cli`, so no manual `PYTHONPATH` is needed when using the venv interpreter).
- `tests/test_calls_table.py::test_calls_table_round_trip` is skipped unless Supabase creds
  are set (`SUPABASE_URL` + `SUPABASE_KEY`, or the `NEXT_PUBLIC_*` / `*_ANON_KEY` variants).
  Everything else runs offline via httpx mock transports and canned completers.
- There is no Python linter configured; `pytest` is the check for this package.

### Out of current MVP scope (do not touch unless asked)

- `/landing-page` — Next.js 16 marketing site (its own `eslint`/`next` tooling, Node deps
  not installed by the update script).
- `/dashboard` — ignored in the current stage.
