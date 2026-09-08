# ChainOpt Design System — Theme Guide

Single source of truth for visual styling across the ChainOpt marketing site and
product UI. Follow it exactly. Where a situation isn't covered, extrapolate from
the principles here rather than inventing new patterns.

The implementation lives in `src/app/globals.css`; this document is why it looks
the way it does.

## 1. Core principles

1. **The page should read like the product's own UI.** ChainOpt is a developer
   tool that analyses LLM pipelines. Marketing surfaces borrow the product's
   visual vocabulary: terminal blocks, dashboard panels, metric chips, monospace
   data labels.
2. **Colour is semantic, never decorative.** Amber means "finding / waste / act
   on this". Teal means "savings / recovered value / positive outcome". Never
   use either as decoration, and never swap their meanings.
3. **One orchestrated motion moment per page.** Everything else is quiet
   micro-transitions. No scroll-jacking, no parallax, no floating elements.
4. **The wordmark and logo glyph are frozen.** Never restyle, recolour, or
   regenerate them (see §8).

## 2. Colour tokens

Defined once in `globals.css` and exposed to Tailwind through `@theme inline`.
**Never hardcode a colour in a component** — reference the token.

| Token | Value | Role |
| --- | --- | --- |
| `--color-ink` | `#0C1220` | Page background. Deep navy, not black. |
| `--color-surface` | `#121B2C` | Panels, cards, terminal blocks. |
| `--color-surface-2` | `#182338` | Nested surfaces: chips, inner blocks, DAG nodes. |
| `--color-line` | `rgba(150,172,220,.15)` | Default borders, dividers. |
| `--color-line-strong` | `rgba(150,172,220,.28)` | Emphasised borders, ghost buttons. |
| `--color-text` | `#E9EEF8` | Primary text. |
| `--color-muted` | `#94A2BD` | Secondary text, labels, metadata. |
| `--color-amber` | `#FFB224` | PRIMARY accent: findings, warnings, CTAs. |
| `--color-amber-dim` | `rgba(255,178,36,.14)` | Amber wash backgrounds. |
| `--color-amber-line` | `rgba(255,178,36,.35)` | Amber badge borders. |
| `--color-amber-line-strong` | `rgba(255,178,36,.45)` | Pro card border, list markers. |
| `--color-teal` | `#3ADFC5` | SECONDARY accent: savings, positive indicators. |
| `--color-teal-dim` | `rgba(58,223,197,.12)` | Teal wash backgrounds. |
| `--color-teal-line` | `rgba(58,223,197,.3)` | Teal borders. |
| `--color-nav` | `rgba(12,18,32,.82)` | Sticky nav wash, behind a 12px blur. |

**Fixed literals** — the only values permitted directly in a component:

| Value | Where |
| --- | --- |
| `#1a1204` | Text on amber-filled buttons. A near-black warm brown, never pure black. |
| `#ffc14d` | Hover state of amber-filled buttons. |
| `#0F1626` | Dark end of the panel gradient (see `.panel-surface`). |

**Semantic assignment:**

- **Amber:** primary CTAs, nav CTA, finding/redundancy badges, flagged DAG nodes
  and edges, the announcement pill's dot, focus rings, hover accents on
  interactive borders, the highlighted "ChainOpt" comparison row, the Pro
  pricing card border, selection highlight.
- **Teal:** savings amounts, savings chips and lines, "oversizing"-class
  secondary badges, the terminal prompt `$`, positive/matched evidence labels.
- The two never sit adjacent at full saturation. The `-dim` washes may.
- Text on amber fill is `#1a1204`. Teal is never a solid fill behind text — text
  on a teal wash is teal itself.
- `::selection { background: var(--color-amber); color: #1a1204; }`

## 3. Typography

Two families. Archivo carries display and body; IBM Plex Mono carries anything
the product would print as data.

| Element | Family | Size | Weight | Tracking | Line height |
| --- | --- | --- | --- | --- | --- |
| H1 | Archivo | `clamp(2.1rem, 4.6vw, 3.3rem)` | 800 | −0.03em | 1.08 |
| H2 | Archivo | `clamp(1.7rem, 3.4vw, 2.4rem)` | 700 | −0.02em | 1.15 |
| Finding title | Archivo | `clamp(1.35rem, 2.4vw, 1.7rem)` | 700 | −0.02em | 1.15 |
| Savings figure | Archivo | `clamp(1.9rem, 3.4vw, 2.35rem)` | 800 | −0.03em | 1 |
| H3 (step titles, FAQ questions) | Archivo | 1–1.2rem | 600 | −0.01em | default |
| Body | Archivo | 16px | 400 | 0 | 1.6 |
| Subtext / section intro | Archivo | 0.95–1.08rem, muted | 400 | 0 | 1.6 |
| Terminal / code | IBM Plex Mono | 0.83–0.9rem | 400 | 0 | — |
| Metric chips, footnotes, frame labels | IBM Plex Mono | 0.7–0.78rem | 400–600 | 0 | — |

**Rules:**

- Headlines may split into strong/soft halves with a muted 700-weight span.
- H2 caps at 22ch. Body and intro copy at 50–64ch. Text never runs the full
  container width.
- **No labels above headings.** Sections are introduced by their H2 and
  nothing else. The lowercase monospace kicker this system used to carry has
  been removed: monospace is for what the product would print -- commands,
  metrics, metadata, evidence -- and reading it as a section title made
  marketing copy look like terminal output. The single exception is the hero
  announcement pill, which is a badge with somewhere to go rather than a
  section title, and it is set in Archivo like the prose around it.
- Numbers render in mono when they are data being reported -- metric values,
  run counts, similarity scores, graph labels. They are set in Archivo 800 when
  they are a headline in their own right: the prices, and the recoverable
  amount on a finding card.
- Never append arrows to button labels. Arrows appear only inside terminal
  output lines, as literal CLI output.

## 4. Layout & spacing

- `.wrap` — `max-width: 1120px`, `padding-inline: 28px` (20px at ≤640px).
- `.section` — `padding-block: 96px` (64px at ≤640px).
- **Breakpoints:** exactly two. 940px (`md:`, grids collapse to one column) and
  640px (`sm:`, spacing shrinks, pricing stacks, non-CTA nav links hide).
  Tailwind's `lg`/`xl`/`2xl` are reset to `initial` so nothing drifts past them.
- **Alignment:** everything is left-aligned. No centred hero, no centred section
  headers.
- **Grids:** hero `minmax(0,1.05fr) minmax(0,.95fr)`; steps `56px 1fr 380px`;
  finding cards `1.25fr .75fr` (one dominant panel plus one supporting, never
  equal twins); comparison rows `240px 1fr` full-width and stacked, not a card
  trio.
- **Radii:** panels 14px, large feature panels 18px, terminal blocks 12px,
  buttons 10px, nav CTA 9px, inner blocks and metrics 8px, chips and badges
  fully rounded (999px).
- **Nav:** sticky, 66px, `--color-nav` behind `backdrop-filter: blur(12px)`,
  bottom border `--color-line`. The current page is marked with `aria-current`
  and full-brightness text; the others stay muted.

**Pages.** The site is four routes, not one scroll:

| Route | Holds |
| --- | --- |
| `/` | Hero, the works-with belt, where ChainOpt fits |
| `/how-it-works` | The three commands, then what a finding looks like |
| `/pricing` | Prices, then the questions people ask about them |
| `/early-access` | The waitlist form and the booking link |

`main` and the footer live in the layout, so every route gets the same frame.
Every page except `/early-access` ends in a `NextStep` band naming the obvious
next move -- a page that ends in a footer is a dead end. Internal navigation
goes through `next/link`, so routes are prefetched and transitions are
client-side.

## 5. Component recipes

**Buttons.** Two variants, no third. Primary is amber fill with `#1a1204` text
(hover `#ffc14d`); ghost is a `--color-line-strong` border on transparent, with
border and text going amber on hover. Both translate down 1px on `:active`.

**Terminal blocks.** `--color-surface`, `--color-line` border, 12px radius, mono
0.83–0.9rem. Prompt `$` in teal, command in text, output lines muted.
Interactive ones carry a corner copy button: mono 0.72rem, `--color-line`
border, turning amber on hover.

**Panels.** Three zones, always: a **head** (flex row, badge left, metadata
right, mono 0.75rem muted, bottom border), a **body**, and a **foot** naming the
detection mechanism (mono 0.7rem muted, top border). Ground is `.panel-surface`.

**Badges.** Pill, mono 0.7rem 600. Amber: `--color-amber-dim` fill, amber text,
`--color-amber-line` border. Teal: the same construction in teal.

**Metric chips.** `--color-surface-2` fill, `--color-line` border, 8px radius,
mono 0.74rem. Label muted, value in `<b>` in `--color-text`.

**Savings indicators.** The recoverable amount is the point of the product, so
on a finding card it is the largest thing on the card: Archivo 800 in teal at
`clamp(1.9rem, 3.4vw, 2.35rem)`, on `--color-teal-dim` behind a
`--color-teal-line` border, with its unit beside it in mono 0.82rem at 75%
opacity. That is the same weight and tracking as the prices on the pricing
page -- what this costs and what it gives back are the same kind of object, and
the one to read first is the one that is teal. The floating hero chip keeps the
small treatment, being an annotation on a diagram rather than a headline.

**Hierarchy inside a panel.** A card should step clearly rather than sit at one
size: savings figure, then title, then body, then metric values, then head and
foot metadata. If two of those measure the same, the card reads as a form
rather than as a finding.

**Highlighted comparison row.** `border-left: 3px solid var(--color-amber)`,
background `linear-gradient(90deg, var(--color-amber-dim), transparent 65%)`,
rounded on the right only, amber title, full-brightness body text (competitor
rows keep muted body text).

**Pricing cards.** Two columns, max-width 840px. The Pro card takes
`--color-amber-line-strong` for its border and its list markers. Markers are
12px rounded squares, not checkmarks or dots.

**Forms.** Inputs sit on `--color-ink` (darker than the panel around them), with
a `--color-line-strong` border, 10px radius, 13px/16px padding, muted
placeholder.

## 6. Motion

- **Curves.** Two, and only two:
  - `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` — entrances, reveals, draws.
  - `--ease-inout: cubic-bezier(0.65, 0, 0.35, 1)` — moves and morphs between
    two states an element already had.

  These override Tailwind's built-in `ease-out` / `ease-in-out` utilities, so
  every transition on the site lands on the same curves.
- **Durations.** Entrances 250–400ms. No single transition exceeds 700ms.
  Micro-interactions (hover colour, border) stay at 150ms.
- **The one orchestrated moment.** The hero pipeline DAG draws its edges on load
  via `stroke-dashoffset` (0.7s per edge, 0.12s stagger), then the flagged
  redundancy resolves at ~1.2s, then the savings chip rises at ~1.4s. That is
  the entire show.
- **Accordions.** `max-height: 0; overflow: hidden`, transitioned over 350ms
  against a measured `scrollHeight`.
- **Scroll-triggered effects**, where used, must be subtle and fire once — never
  re-trigger on scroll up. No scroll-jacking, no parallax, no 3D.
- **Never add:** parallax, hover lift/scale on cards, background particles,
  animated gradients.
- **Always honour reduced motion.** Under `prefers-reduced-motion: reduce`,
  every animation skips to its end state immediately.

## 7. Interaction states

- **Focus:** `outline: 2px solid var(--color-amber); outline-offset: 2px` on
  every interactive element, via a global `:focus-visible`.
- **Hover:** ghost buttons and interactive borders go amber. Links go muted to
  text. Amber fills go `#ffc14d`.
- **Active:** buttons translate down 1px. No scale transforms.

## 8. Brand marks — do not touch

The wordmark is the string `chainopt` in IBM Plex Mono 600, paired with the node
glyph: an amber filled circle (`#FFB224`) joined by grey strokes (`#94A2BD`) to
two outlined circles (teal `#3ADFC5` and grey `#94A2BD`). **These hex values are
part of the mark and do not re-theme with the palette.** If the palette changes,
the logo colours stay exactly as they are. Never regenerate, recolour, restroke,
or replace the glyph or wordmark. It lives in `src/components/wordmark.tsx` at
20px in the nav and 18px in the footer.

## 9. Content & voice

- **Monospace is what the product would print** — commands, metrics, labels,
  metadata, evidence. Prose the site speaks in its own voice is Archivo, even
  when it is small and grey: captions under an illustration, the reassurance
  under the form, the footer disclaimer. Setting editorial copy in mono makes
  marketing read as terminal output, which is the one thing this system must
  not do.
- Metadata is lowercase. Body copy, including small grey copy, is sentence
  case. No ALL-CAPS.
- Data separators inside mono strings use `·`: `step 1 · haiku`,
  `langfuse · helicone`. Mono data strings only, never prose — prose takes an
  em dash or a full stop.
- Findings are evidence-first: every claim is paired with similarity scores, run
  counts, or dollar amounts in metric chips.
- Dollar amounts follow `$38.20 / month` or `+$38.20/mo recoverable`.
- Never invent model names, model IDs, or pricing. Never present illustrative
  figures as measured results — label them "Illustrative example — not measured
  results."
- One nav entry per destination. A tab that deep-links into a page another tab
  already owns promises two places and delivers one; put it in the footer,
  where a list of links reads as a list rather than as a set of destinations.

## 10. Checklist for new UI work

- [ ] No hardcoded colours outside the fixed literals in §2
- [ ] Amber = findings/CTA, teal = savings; no semantic drift, no decoration
- [ ] All data and labels in IBM Plex Mono, all prose in Archivo
- [ ] Left-aligned, text constrained to a readable measure
- [ ] No label above the heading; no ALL-CAPS, no arrows in buttons
- [ ] Transitions on `--ease-out` / `--ease-inout`, within the duration budget
- [ ] `:focus-visible` amber ring on every interactive element
- [ ] `prefers-reduced-motion` honoured for anything animated
- [ ] Logo and wordmark untouched, original hex values intact
- [ ] Verified at 1280px, 940px, and 375px, with no horizontal overflow
