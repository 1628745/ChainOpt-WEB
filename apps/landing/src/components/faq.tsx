"use client";

import { useEffect, useRef, useState } from "react";

import { SectionGlow } from "@/components/section-glow";
import { cn } from "@/lib/utils";

/**
 * The questions a developer asks before they will run an unfamiliar binary
 * over their own source.
 *
 * The privacy answer leads and opens by default, because it is the question
 * this product most wants to be asked -- an analyser that never sends your
 * prompts anywhere is the differentiator, and it should not cost a click.
 */

type Item = { question: string; answer: string };

const ITEMS: Item[] = [
  {
    question: "Do you store my data?",
    answer:
      "No. ChainOpt runs entirely on your machine. The CLI reads your local traces, computes everything locally, and prints to stdout. Your prompts, responses, and source code never leave your environment — there is no hosted backend to send them to.",
  },
  {
    question: "What frameworks does it support?",
    answer:
      "LangChain, LangGraph, and raw OpenAI or Anthropic SDK usage in Python. TypeScript support is on the roadmap.",
  },
  {
    question: "Will it change my code?",
    answer:
      "Only if you ask it to. Analysis is read-only by default; fixes are suggested as diffs you review and apply yourself.",
  },
  {
    question: "How accurate are the savings estimates?",
    answer:
      "Estimates are computed from your actual observed runs — real token counts at current API prices — not benchmarks. Findings below confidence thresholds are suppressed rather than guessed.",
  },
  {
    question: "What does it cost to try?",
    answer:
      "The free tier covers 1,000 analyzed calls per month, no card required.",
  },
];

function Row({
  item,
  open,
  onToggle,
}: {
  item: Item;
  open: boolean;
  onToggle: () => void;
}) {
  const body = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // Re-measure while open so a reflow -- a resize, a font swap, a neighbour
  // opening -- cannot leave the answer clipped at a stale height.
  useEffect(() => {
    const node = body.current;
    if (!open || !node) return;

    const observer = new ResizeObserver(() => setHeight(node.scrollHeight));
    observer.observe(node);
    return () => observer.disconnect();
  }, [open]);

  function toggle() {
    if (!open) setHeight(body.current?.scrollHeight ?? 0);
    onToggle();
  }

  return (
    <div className="border-b border-line last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className={cn(
            "flex w-full items-center justify-between gap-6 px-5 py-4 text-left text-[1rem] font-semibold tracking-[-0.01em] transition-colors duration-150 ease-out",
            open ? "text-text" : "text-text hover:text-amber",
          )}
        >
          {item.question}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden
            className={cn(
              "shrink-0 transition-transform duration-[250ms] ease-out",
              open ? "rotate-90 text-amber" : "text-muted",
            )}
          >
            <path
              d="m4.5 2.5 3.5 3.5-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </h3>

      <div
        className="overflow-hidden transition-[max-height] duration-[350ms] ease-out"
        /*
         * `none` until something has been measured, so the row that opens by
         * default is simply open on arrival rather than animating itself in.
         * Only a real toggle ever runs the transition.
         */
        style={{ maxHeight: open ? height || "none" : 0 }}
      >
        <div ref={body} className="px-5 pb-5">
          <p className="max-w-[62ch] text-[0.95rem] text-muted">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  // One at a time: a wall of open answers is a wall of text, and the point of
  // the accordion is that the reader picks the question they actually have.
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="questions" className="section relative isolate overflow-x-clip border-b border-line">
      <div className="wrap">
        <SectionGlow />
        <h2>What developers ask first</h2>

        <div className="mt-11 max-w-[840px] overflow-hidden rounded-panel border border-line bg-surface">
          {ITEMS.map((item, i) => (
            <Row
              key={item.question}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
