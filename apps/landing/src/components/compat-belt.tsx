/**
 * A slim strip under the hero naming what ChainOpt reads.
 *
 * One sentence, set once. It was a scrolling marquee carrying eight copies of
 * a five-name list, which is forty list items of motion to state a fact that
 * fits on a line, and it read as a logo wall hunting for credibility.
 *
 * Text, not logos: these are other people's trademarks, and setting them in
 * our own type is a statement of compatibility rather than an implied
 * endorsement.
 */

const WORKS_WITH = [
  "LangChain",
  "LangGraph",
  "the OpenAI and Anthropic Python SDKs",
  "OpenTelemetry",
];

export function CompatBelt() {
  return (
    <section className="border-b border-line bg-ink py-4">
      <div className="wrap">
        {/* A sentence in the site's own voice, so one family throughout:
            "works with" in mono put a label and its prose in two typefaces on
            one line. */}
        <p className="text-[0.85rem] text-muted">
          Works with <span className="text-text">{WORKS_WITH.join(", ")}</span>
        </p>
      </div>
    </section>
  );
}
