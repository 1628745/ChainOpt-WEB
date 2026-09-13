import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The small vocabulary every section is built from. These mirror the product's
 * own dashboard chrome, which is the point: the marketing page should read
 * like a screenshot of the thing it is selling.
 *
 * Nothing here is a pill any more. Rounded chips around every label, tag and
 * figure is the house style of a template rather than of a tool that prints to
 * a terminal, so a kind is a dot and a word, and a measurement is a label with
 * a number under it.
 */

/** Amber = a finding. Teal = a saving or a positive match. Nothing else. */
export function Kind({
  tone = "amber",
  children,
  className,
}: {
  tone?: "amber" | "teal";
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[0.78rem] font-semibold",
        tone === "amber" ? "text-amber" : "text-teal",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 shrink-0 rounded-chip",
          tone === "amber" ? "bg-amber" : "bg-teal",
        )}
      />
      {children}
    </span>
  );
}

/**
 * A single measured fact, in the shape the product prints it: the label sits
 * above and the value comes forward, so a row of them scans as numbers with
 * captions rather than as a wall of equal-weight text.
 */
export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="font-mono text-[0.72rem] text-muted">{label}</dt>
      <dd data-numeric className="mt-0.5 text-[0.95rem] font-semibold text-text">
        {value}
      </dd>
    </div>
  );
}

export function Metrics({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "flex flex-wrap gap-x-6 gap-y-4 border-y border-line py-4",
        className,
      )}
    >
      {children}
    </dl>
  );
}

/**
 * What a finding gives back: the point of the entire product, and therefore
 * the largest thing on the card it sits in.
 *
 * Set in Archivo 800, at the same weight and tracking as the prices on the
 * pricing page, so the two biggest numbers on the site are the same kind of
 * object: what this costs, and what it returns.
 *
 * The figure is printed, not counted up. A number that ticks from zero spends
 * most of its animation showing amounts that are not true, and on a fast
 * scroll those are the only amounts a reader ever sees.
 */
export function Gain({
  value,
  unit,
  className,
}: {
  /** The figure exactly as it should read, e.g. `+$38.20` or `-8.4s`. */
  value: string;
  /** What it is per, e.g. `/mo recoverable`. */
  unit: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-x-2.5 gap-y-1 rounded-panel border border-teal-line bg-teal-dim px-5 py-4 text-teal",
        className,
      )}
    >
      <span className="text-[clamp(1.9rem,3.4vw,2.35rem)] leading-none font-extrabold tracking-[-0.03em] [font-variant-numeric:tabular-nums]">
        {value}
      </span>
      <span className="font-mono text-[0.82rem] text-teal/75">{unit}</span>
    </p>
  );
}

/**
 * Dashboard panel, always in three zones: a head carrying the kind of finding
 * and its metadata, a body, and a foot naming the mechanism that produced it.
 */
export function Panel({
  children,
  className,
  feature = false,
}: {
  children: ReactNode;
  className?: string;
  feature?: boolean;
}) {
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden border border-line",
        feature ? "rounded-feature" : "rounded-panel",
        "panel-surface",
        className,
      )}
    >
      {children}
    </article>
  );
}

export function PanelHead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4 font-mono text-[0.78rem] text-muted",
        className,
      )}
    >
      {children}
    </header>
  );
}

export function PanelBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("flex-1 px-6 py-7", className)}>{children}</div>;
}

export function PanelFoot({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <footer
      className={cn(
        "border-t border-line px-6 py-3.5 font-mono text-[0.75rem] text-muted",
        className,
      )}
    >
      {children}
    </footer>
  );
}
