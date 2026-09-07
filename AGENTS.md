# ChainOpt

ChainOpt analyzes LLM pipelines and surfaces evidence-backed recommendations for
reducing cost and latency.

## What is on this branch

`main` was stripped to the marketing site (commit 86fb684). The only application here
is `apps/landing/` -- a Next.js 16 site. `packages/`, `services/`, `docs/`,
`supabase/migrations/`, `fixtures/`, and `apps/dashboard/` are empty placeholders.

The Python SDK, CLI analyzer, FastAPI service, `docs/SPEC.md`, and the model registry
live on the **`archive/pre-revamp`** branch. Read them there:

    git show archive/pre-revamp:docs/SPEC.md

Project rules are in `.cursor/rules/chainopt.mdc`.

## apps/landing

Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4. Dark-only marketing
site with a Supabase-backed waitlist. No component library: every component is
local to `src/components`, and the only icons are inline SVG.

The visual system is documented in `apps/landing/README.md` and defined in
`apps/landing/src/app/globals.css`. Two rules matter more than the rest: colour is
semantic (amber = a finding, teal = a saving, never decorative, never swapped), and
the wordmark glyph in `src/components/wordmark.tsx` is frozen -- its hex values are
part of the mark, not the palette.

    cd apps/landing
    npm ci
    npm run dev      # http://localhost:3000
    npm run build
    npm run lint     # eslint flat config; `next lint` is removed in Next 16

### Environment

Copy `apps/landing/.env.example` to `.env.local`. The waitlist route needs a Supabase
project with a `waitlist` table; see `supabase/migrations/`.

### Checks

There is no test suite for the landing page. `npm run build` (which typechecks) and
`npm run lint` are the checks. Run both before calling a change done.
