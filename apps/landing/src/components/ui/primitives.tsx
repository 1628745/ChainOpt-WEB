import type { ReactNode } from "react";

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
        "inline-flex items-center rounded-chip border px-2.5 py-1 font-mono text-[0.7rem] font-semibold",
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

/** A single measured fact, in the shape the product prints it. */
export function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-inner border border-line bg-surface-2 px-2.5 py-1.5 font-mono text-[0.74rem] text-muted">
      {label}
      <b data-numeric className="font-medium text-text">
        {value}
      </b>
    </span>
  );
}

/** Recovered money, stated in teal and never anywhere else. */
export function SavingsLine({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      data-numeric
      className={cn(
        "rounded-btn border border-teal-line bg-teal-dim px-3.5 py-2.5 font-mono text-[0.95rem] text-teal",
        className,
      )}
    >
      {children}
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
        "flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5 font-mono text-[0.75rem] text-muted",
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
  return <div className={cn("flex-1 px-5 py-[22px]", className)}>{children}</div>;
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
        "border-t border-line px-5 py-3 font-mono text-[0.7rem] text-muted",
        className,
      )}
    >
      {children}
    </footer>
  );
}
