import type { ReactNode } from "react";

import { CountUp } from "@/components/count-up";
import { cn } from "@/lib/utils";

/**
 * The small vocabulary every section is built from. These mirror the
 * product's own dashboard chrome, which is the point: the marketing page
 * should read like a screenshot of the thing it is selling.
 */

/** Amber = a finding. Teal = a saving or a positive match. Nothing else. */
export function Badge({
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
        "inline-flex items-center rounded-chip border px-3 py-1.5 font-mono text-[0.76rem] font-semibold",
        tone === "amber"
          ? "border-amber-line bg-amber-dim text-amber"
          : "border-teal-line bg-teal-dim text-teal",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * A single measured fact, in the shape the product prints it. The label sits
 * back and the value comes forward, so a row of chips scans as numbers with
 * captions rather than as a wall of equal-weight text.
 */
export function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-2 rounded-inner border border-line bg-surface-2 px-3 py-2 font-mono text-[0.78rem] text-muted">
      {label}
      <b data-numeric className="text-[0.92rem] font-semibold text-text">
        {value}
      </b>
    </span>
  );
}

/**
 * Recovered money: the point of the entire product, and therefore the largest
 * thing on the card it sits in.
 *
 * Set in Archivo 800 rather than mono, at the same weight and tracking as the
 * prices on the pricing page. The two biggest numbers on the site are then the
 * same kind of object -- what this costs, and what it gives back -- and the
 * one you want read first is the one that is teal.
 */
export function SavingsLine({
  amount,
  unit = "/mo recoverable",
  className,
}: {
  amount: number;
  unit?: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-x-2.5 gap-y-1 rounded-panel border border-teal-line bg-teal-dim px-5 py-4 text-teal",
        className,
      )}
    >
      <CountUp
        amount={amount}
        prefix="+$"
        mono={false}
        className="text-[clamp(1.9rem,3.4vw,2.35rem)] leading-none font-extrabold tracking-[-0.03em]"
      />
      <span className="font-mono text-[0.82rem] text-teal/75">{unit}</span>
    </p>
  );
}

/**
 * Dashboard panel, always in three zones: a head carrying a badge and its
 * metadata, a body, and a foot naming the mechanism that produced it.
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
  return (
    <div className={cn("flex-1 px-6 py-7", className)}>{children}</div>
  );
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
