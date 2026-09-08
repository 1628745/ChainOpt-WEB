"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * The two findings above, stated as one picture: what the pipeline costs a
 * month now, and what it costs with both applied.
 *
 * The bars carry the argument the prose has been making -- the amber segment
 * is the part of the current bill that is waste, and the teal bar is what is
 * left once it is gone. Amber and teal keep meaning exactly what they mean
 * everywhere else on the page.
 *
 * Deliberately divs rather than a chart: two bars and two numbers do not need
 * a charting library, an SVG, or an axis.
 */

const CURRENT = 142.8;
const RECOVERABLE = 59.6;
const OPTIMISED = CURRENT - RECOVERABLE;

const GROW_MS = 700;
/** The waste fills after the bars land, so the eye arrives on it last. */
const WASTE_DELAY_MS = 200;

const pct = (value: number) => `${(value / CURRENT) * 100}%`;

/**
 * The figure counts with its own bar over the same 700ms rather than on an
 * independent clock, so the number lands exactly as the bar stops growing.
 */
function Amount({ value, lit }: { value: number; lit: boolean }) {
  const out = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const final = value.toFixed(2);

  useEffect(() => {
    const node = out.current;
    if (!node || !lit || reduced) return;

    let frame = 0;
    let startedAt = 0;
    const step = (now: number) => {
      startedAt ||= now;
      const t = Math.min((now - startedAt) / GROW_MS, 1);
      // Ease-out cubic, matching the curve the bar itself grows on.
      node.textContent = (value * (1 - Math.pow(1 - t, 3))).toFixed(2);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    node.textContent = (0).toFixed(2);
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      node.textContent = value.toFixed(2);
    };
  }, [lit, reduced, value]);

  return (
    <span data-numeric className="text-[0.85rem] text-text">
      $
      <span ref={out} style={{ display: "inline-block", width: `${final.length}ch`, textAlign: "right" }}>
        {final}
      </span>
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
    <div ref={host} className={cn("max-w-[560px]", className)}>
      <div className="grid grid-cols-[76px_1fr_auto] items-center gap-x-4 gap-y-3">
        <span className="font-mono text-[0.74rem] text-muted">current</span>
        <div className="h-6 overflow-hidden rounded-inner bg-surface-2">
          <div
            className="cost-fill flex h-full justify-end"
            style={{ "--to": "100%" } as CSSProperties}
            data-lit={lit || undefined}
          >
            {/* The waste, at the end of the bar: the part of this month's
                bill the two findings above account for. */}
            <div
              className="cost-waste h-full bg-amber-dim"
              style={
                {
                  "--to": pct(RECOVERABLE),
                  "--delay": `${WASTE_DELAY_MS}ms`,
                } as CSSProperties
              }
              data-lit={lit || undefined}
            />
          </div>
        </div>
        <Amount value={CURRENT} lit={lit} />

        <span className="font-mono text-[0.74rem] text-muted">optimized</span>
        <div className="h-6 overflow-hidden rounded-inner bg-surface-2">
          <div
            className="cost-fill h-full rounded-inner border bg-teal-dim"
            style={{ "--to": pct(OPTIMISED) } as CSSProperties}
            data-lit={lit || undefined}
          />
        </div>
        <Amount value={OPTIMISED} lit={lit} />
      </div>

      <p className="mt-3 text-[0.8rem] text-muted">
        Illustrative — based on the two findings above.
      </p>
    </div>
  );
}
