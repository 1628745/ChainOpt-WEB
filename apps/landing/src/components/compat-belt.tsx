import type { CSSProperties } from "react";

/**
 * A slim strip under the hero naming what ChainOpt reads.
 *
 * Text wordmarks, not logos: these are other people's trademarks, and setting
 * them in our own mono at our own muted grey is a statement of compatibility
 * rather than an implied endorsement or partnership.
 *
 * The list scrolls because a static row of five names reads as a logo wall
 * hunting for credibility, while a slow belt reads as a stack being carried
 * past -- and the horizontal drift breaks up a page that is otherwise entirely
 * vertical.
 */

/**
 * Copies of the list laid end to end. The run has to be longer than the track
 * plus one copy, or the belt shows daylight behind itself at the loop point;
 * eight covers a 4K track with room to spare, at the cost of a few list items.
 */
const COPIES = 8;

const WORKS_WITH = [
  "LangChain",
  "LangGraph",
  "OpenAI SDK",
  "Anthropic SDK",
  "OpenTelemetry",
];

function Sequence({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-10 pr-10 font-mono text-[0.85rem] text-muted"
    >
      {WORKS_WITH.map((name) => (
        <li key={name} className="whitespace-nowrap">
          {name}
        </li>
      ))}
    </ul>
  );
}

export function CompatBelt() {
  return (
    <section
      aria-label="Works with"
      className="belt border-b border-line bg-ink py-[18px]"
    >
      <div className="flex items-center gap-6">
        <p className="shrink-0 pl-[var(--wrap-x)] font-mono text-[0.7rem] text-muted">
          works with
        </p>

        {/*
          The cycle carries the run left by exactly one copy's width, so at the
          end of it copy two sits where copy one began and the loop has no
          seam. The shift is derived from COPIES rather than written out, so
          the two cannot drift apart. Duplicates are hidden from assistive
          tech, which should hear the list once.
        */}
        <div className="belt-track min-w-0 flex-1 overflow-hidden">
          <div
            className="belt-run flex w-max items-center"
            style={{ "--belt-shift": `-${100 / COPIES}%` } as CSSProperties}
          >
            {Array.from({ length: COPIES }, (_, i) => (
              <Sequence key={i} ariaHidden={i > 0 || undefined} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
