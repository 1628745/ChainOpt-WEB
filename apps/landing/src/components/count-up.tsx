"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * A money figure that counts up the first time it is read.
 *
 * The whole argument of the page is that there is money sitting in a pipeline
 * that nobody has counted. A figure that ticks up makes that felt rather than
 * merely stated -- so this is reserved for recoverable amounts, and is not a
 * general-purpose number animation.
 *
 * Fires once per element. Scrolling back up does not rewind it: the figure is
 * a fact being reported, not a loop.
 *
 * The frames are written straight to the DOM node rather than through state.
 * The markup React owns is the final figure, which is what the server sends,
 * what a reader without JavaScript sees, and what is left behind if the
 * component unmounts mid-count.
 */

const DURATION_MS = 900;
const THRESHOLD = 0.6;

/** Ease-out cubic: fast off the mark, landing slowly on the real figure. */
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export function CountUp({
  amount,
  prefix = "$",
  suffix,
  className,
  delayMs = 0,
  restartKey,
}: {
  /** The figure to land on, e.g. 38.2 renders as $38.20. */
  amount: number;
  /** Rendered before the number and never animated. */
  prefix?: string;
  /** Rendered after the number and never animated, e.g. "/mo recoverable". */
  suffix?: string;
  className?: string;
  /**
   * Wait this long after the figure comes into view before counting. For a
   * figure that arrives on an animation of its own -- the hero savings chip
   * rises at 1.4s -- counting on sight would spend the whole animation behind
   * an invisible element.
   */
  delayMs?: number;
  /**
   * Change this to count again. Used by the hero demo so a replay re-runs the
   * figure with the graph; left alone, the count fires once and stays put.
   */
  restartKey?: number;
}) {
  const reduced = useReducedMotion();
  const host = useRef<HTMLSpanElement>(null);
  const out = useRef<HTMLSpanElement>(null);

  const final = amount.toFixed(2);

  useEffect(() => {
    const hostNode = host.current;
    const outNode = out.current;
    if (!hostNode || !outNode || reduced) return;

    let frame = 0;
    let timer = 0;

    const count = () => {
      outNode.textContent = (0).toFixed(2);

      // Time from the first frame's own timestamp, not from now: rAF hands
      // back the frame's start time, which can predate this callback and
      // would otherwise make the first tick a negative amount.
      let startedAt = 0;
      const step = (now: number) => {
        startedAt ||= now;
        const t = Math.min((now - startedAt) / DURATION_MS, 1);
        outNode.textContent = (amount * ease(t)).toFixed(2);
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(count, delayMs);
      },
      { threshold: THRESHOLD },
    );

    observer.observe(hostNode);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      outNode.textContent = amount.toFixed(2);
    };
    // restartKey is a deliberate trigger: changing it tears this down and
    // re-arms the whole thing, which is exactly what a replay wants.
  }, [amount, reduced, delayMs, restartKey]);

  return (
    <span ref={host} data-countup className={className}>
      {prefix}
      {/*
        Tabular numerals hold every digit to the same width, and the fixed `ch`
        box holds its width while the integer part gains digits -- so nothing
        beside the figure moves while it counts.
      */}
      <span
        ref={out}
        data-numeric
        style={{ display: "inline-block", width: `${final.length}ch` }}
      >
        {final}
      </span>
      {suffix}
    </span>
  );
}
