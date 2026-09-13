"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

import { MONTHLY, OPTIMIZED, RECOVERABLE } from "@/lib/demo";
import { cn } from "@/lib/utils";

/**
 * The two cost findings above, stated as one picture: what the pipeline costs
 * a month now, and what it costs with both applied.
 *
 * Both segments of the current bar are painted and both are named. The bar
 * used to draw only its amber part, leaving the rest of the spend the same
 * colour as the empty track, so a bar that was mostly cost read as a bar that
 * was mostly empty.
 *
 * Deliberately divs rather than a chart: two bars and two numbers do not need
 * a charting library, an SVG, or an axis. The figures are printed rather than
 * counted up, so no frame of the animation shows an amount that is not true.
 */

const pct = (value: number) => `${(value / MONTHLY) * 100}%`;

const money = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

function Amount({ value }: { value: number }) {
  return (
    <span
      data-numeric
      className="text-[1.05rem] font-bold tracking-[-0.02em] text-text"
    >
      {money(value)}
    </span>
  );
}

export function CostBar({ className }: { className?: string }) {
  const [lit, setLit] = useState(false);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLit(true);
        observer.disconnect();
      },
      { threshold: 0.6 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={host} className={cn("max-w-[680px]", className)}>
      <div className="grid grid-cols-[96px_1fr_auto] items-center gap-x-5 gap-y-4">
        <span className="font-mono text-[0.8rem] text-muted">current</span>
        <div className="h-9 overflow-hidden rounded-inner bg-surface-2">
          {/* Clipped to its own width so the segments inside cannot paint their
              borders and padding as a sliver before the bar has grown. */}
          <div
            className="cost-fill flex h-full overflow-hidden"
            style={{ "--to": "100%" } as CSSProperties}
            data-lit={lit || undefined}
          >
            {/* What the pipeline would still cost with both findings applied,
                and then the part of the bill the findings account for. */}
            <div
              className="h-full border-y border-l border-teal-line bg-teal/15"
              style={{ width: pct(OPTIMIZED) }}
            />
            {/* The waste, labelled where it is rather than in a key the eye
                has to travel to and match by colour. */}
            <div className="flex h-full min-w-0 flex-1 items-center justify-end overflow-hidden border-y border-r border-amber-line bg-amber/22 pr-2.5">
              <span
                data-numeric
                className="text-[0.74rem] whitespace-nowrap text-amber"
              >
                {money(RECOVERABLE)}
              </span>
            </div>
          </div>
        </div>
        <Amount value={MONTHLY} />

        <span className="font-mono text-[0.8rem] text-muted">optimized</span>
        <div className="h-9 overflow-hidden rounded-inner bg-surface-2">
          <div
            className="cost-fill h-full rounded-inner border bg-teal/15"
            style={{ "--to": pct(OPTIMIZED) } as CSSProperties}
            data-lit={lit || undefined}
          />
        </div>
        <Amount value={OPTIMIZED} />
      </div>

      <p className="mt-4 max-w-[64ch] text-[0.88rem] text-text">
        <span className="text-amber">Amber</span> is what the two cost findings
        above account for. <span className="text-teal">Teal</span> is what the
        pipeline still costs once both are applied.
      </p>

      <p className="mt-2 max-w-[64ch] text-[0.82rem] text-muted">
        The parallelism finding returns time rather than spend, so it is not in
        these bars.
      </p>
    </div>
  );
}
