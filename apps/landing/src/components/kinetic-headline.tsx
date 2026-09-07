import type { CSSProperties } from "react";

/**
 * The headline assembles itself word by word on load: each word fades in and
 * rises 8px, 60ms behind the one before it.
 *
 * The words are split on the server, not wrapped by script after hydration.
 * Splitting at runtime means the browser paints the finished headline, then
 * script hides it again to animate it -- a visible flash of the very thing
 * being revealed. Emitting the spans up front costs nothing, survives with
 * JavaScript disabled, and lets CSS alone honour reduced motion.
 *
 * Authoring stays clean because the sentences arrive as data: the caller
 * writes the headline, not the markup.
 */

const WORD_MS = 60;
const LEAD_MS = 80;

export type Segment = {
  text: string;
  /** Renders muted and heavy -- the setup half of a two-part headline. */
  dim?: boolean;
};

export function KineticHeadline({
  segments,
  className,
}: {
  segments: Segment[];
  className?: string;
}) {
  // Each segment carries how many words precede it, so the stagger runs
  // continuously through the segment boundary instead of restarting at each
  // span -- and the position is derived rather than counted, so rendering the
  // headline twice cannot produce two different sets of delays.
  const prepared = segments.map((segment, s) => ({
    ...segment,
    words: segment.text.split(" "),
    offset: segments
      .slice(0, s)
      .reduce((total, earlier) => total + earlier.text.split(" ").length, 0),
  }));

  return (
    <h1 className={className}>
      {prepared.map((segment, s) => {
        const { words } = segment;

        return (
          <span key={segment.text} className={segment.dim ? "dim" : undefined}>
            {words.map((word, w) => {
              const index = segment.offset + w;
              const delay = LEAD_MS + index * WORD_MS;

              return (
                <span key={`${word}-${index}`}>
                  {/* The word is inline-block so it can be moved; the space
                      that follows stays a plain text node outside it, so the
                      line still breaks exactly where it would have. */}
                  <span
                    className="word"
                    style={{ "--word-delay": `${delay}ms` } as CSSProperties}
                  >
                    {word}
                  </span>
                  {w < words.length - 1 ? " " : null}
                </span>
              );
            })}
            {s < prepared.length - 1 ? " " : null}
          </span>
        );
      })}
    </h1>
  );
}
