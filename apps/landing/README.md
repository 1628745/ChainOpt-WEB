# ChainOpt landing

Marketing site for ChainOpt, at `apps/landing`. Next.js 16 (App Router, Turbopack),
React 19, and Tailwind v4. Dark-only, with a Supabase-backed early-access form.

The UI has no component library: everything is local to `src/components`, built on
the design system described below. There is no shadcn, no Radix/Base UI, and no
icon package -- the only icons on the page are inline SVG.

## Running it

    npm ci
    npm run dev      # http://localhost:3000

## Checks

There is no test suite. These two are the gate:

    npm run build    # also typechecks
    npm run lint

## Environment

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project holding the `waitlist` table |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key; access is governed by RLS |
| `NEXT_PUBLIC_SITE_URL` | Absolute origin for canonical URLs, sitemap, and social cards |

Without Supabase credentials the site renders fine and the form returns a 503.

## The waitlist

`POST /api/waitlist` validates the address, drops honeypot submissions, rate limits
per IP, and inserts into `public.waitlist`. The table and its RLS policy are defined
in `supabase/migrations/0001_waitlist.sql`. The anon key can insert and cannot read,
so the list is not exposed to the browser.

### Wiring it to a Supabase project

1. Create a project at supabase.com.
2. Run `supabase/migrations/0001_waitlist.sql` in the SQL editor. It creates the
   table, a unique index on `lower(email)`, and an RLS policy that lets `anon`
   INSERT and nothing else. There is deliberately no SELECT policy.
3. Copy the Project URL and the **anon/public** key from Settings → API into
   `.env.local`. The anon key is meant to reach the browser; the service_role
   key must never be used here.
4. Set the same two variables in the deploy environment.

The insert is sent without `Prefer: return=representation`, so PostgREST never
runs a SELECT afterwards. That is what makes an insert-only policy workable --
adding a `.select()` to the insert would start failing under RLS, in production
only.

### Checking it works

Submit the form twice with the same address. The first gives "You're on the
list", the second "That address is already on the list" -- which proves the
insert, the unique index, and the 23505-to-409 mapping in one go.

| Case | Response |
| --- | --- |
| New address | `200 {"success":true}` |
| Same address again, any casing | `409` "That address is already on the list." |
| Malformed address | `400` "Enter a valid email address." |
| Honeypot field filled | `200 {"success":true}`, silently discarded |
| 6th request from one IP inside a minute | `429` |
| Supabase not configured | `503`, page still renders |

The rate limit is per instance and in memory, so it raises the cost of casual
scripting rather than providing a hard cap. Move it to a shared store if the
endpoint is ever targeted.

## Analytics

`@vercel/analytics` reports page views, and the form fires a `waitlist_signup`
event carrying only the path it happened on -- never the address. Page views say
people arrived; that event is the only thing that says the site worked.

It is cookieless and stores no device identifier, so it needs no consent banner,
which matters on a site whose central claim is that ChainOpt does not phone
home. Both only report once deployed to Vercel: locally the beacon endpoint does
not exist and calls simply queue.

## Design system

`CHAINOPT_THEME.md` is the written source of truth and `src/app/globals.css`
is its implementation. Read the theme guide before any UI work; the summary
below is orientation, not a substitute. Colour, radius, and
rhythm are CSS custom properties exposed to Tailwind through `@theme inline`, so
components reference semantic names and never raw values.

Colour is semantic and never decorative:

| Token | Means |
| --- | --- |
| `amber` | A finding: waste, a warning, something to act on. Also every primary CTA. |
| `teal` | A saving: recovered value, a positive match, the terminal prompt. |
| `ink` / `surface` / `surface-2` | Page ground, panels, nested surfaces. |
| `line` / `line-strong` | Default and emphasised borders. |
| `text` / `muted` | Primary and secondary text. |

The two accents never swap meanings and never sit adjacent at full saturation.

Type is two families: Archivo for display and body, IBM Plex Mono for anything the
product would print as data -- code, labels, metrics, metadata, section kickers.

Layout is left-aligned throughout, capped at 1120px by `.wrap`, with two
breakpoints: 940px (`md:`, grids collapse) and 640px (`sm:`, spacing shrinks and
non-CTA nav links hide).

The site is four routes -- `/`, `/how-it-works`, `/pricing`, `/early-access` --
each assembled in `src/app/<route>/page.tsx` from the section components in
`src/components`. Sections know nothing about which page they sit on.

Motion is one orchestrated moment: the hero DAG draws its edges on load, the
redundancy resolves, and the savings chip rises in. Everything else is a 0.15s
hover transition. `prefers-reduced-motion` skips all of it.

### Frozen brand marks

The wordmark and node glyph in `src/components/wordmark.tsx` are not themed. Their
three hex values (`#FFB224`, `#94A2BD`, `#3ADFC5`) are part of the mark and stay
put if the palette ever changes. Do not recolour, restroke, or regenerate them.

### The vocabulary

`src/components/ui/primitives.tsx` holds the pieces every section is built from --
`Kicker`, `Badge`, `MetricChip`, `SavingsLine`, and the three-zone `Panel`
(head / body / foot). `src/components/ui/button.tsx` has exactly two variants,
primary and ghost; there is deliberately no third.
