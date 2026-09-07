import { cn } from "@/lib/utils";

/**
 * Quote slots, placed next to the specific thing they are about rather than
 * collected into a wall of praise: one under the finding cards, one beside the
 * Pro pricing card.
 *
 * NOTHING RENDERS UNTIL THERE ARE REAL QUOTES. The placeholders below are
 * marked and disabled, and `Testimonial` returns null for any quote still
 * flagged as one. A fabricated endorsement on a landing page is a lie about a
 * person who did not say it, and the repo rule against inventing numbers
 * applies at least as strongly to inventing people.
 *
 * To go live: replace a slot's text, name and role with what the person
 * actually said and agreed to, and drop `placeholder`. That is the only
 * change needed -- the slot starts rendering on its own.
 */

export type Quote = {
  text: string;
  name: string;
  role: string;
  /** True until a real, attributable quote replaces the sample. */
  placeholder?: boolean;
};

export const QUOTES: Record<"finding" | "pricing", Quote> = {
  // PLACEHOLDER — sample copy showing the shape of a quote that would earn
  // its place here: specific, about one finding, with a number in it.
  finding: {
    text: "It found two summarisation steps we had written eight months apart and never noticed were the same call. The evidence panel is what made it an easy sell internally.",
    name: "Placeholder Name",
    role: "role · company",
    placeholder: true,
  },
  // PLACEHOLDER — a pricing-adjacent quote should speak to what the spend
  // became, not to how much the product is liked.
  pricing: {
    text: "We were arguing about which model to downgrade. It turned out the cheaper fix was deleting a call neither of us had looked at.",
    name: "Placeholder Name",
    role: "role · company",
    placeholder: true,
  },
};

export function Testimonial({
  quote,
  className,
}: {
  quote: Quote;
  className?: string;
}) {
  // The slot is wired up and styled; it simply has nothing true to say yet.
  if (quote.placeholder) return null;

  return (
    <figure
      className={cn(
        "rounded-panel border border-line border-l-[3px] border-l-amber bg-surface px-5 py-4",
        className,
      )}
    >
      <blockquote className="max-w-[62ch] text-[0.95rem] text-text">
        {quote.text}
      </blockquote>
      <figcaption className="mt-3 font-mono text-[0.75rem] text-muted">
        — {quote.name} · {quote.role}
      </figcaption>
    </figure>
  );
}
