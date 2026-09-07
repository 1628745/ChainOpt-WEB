"use client";

import { useEffect, useRef, useState } from "react";

import { PipelineDiagram } from "@/components/pipeline-diagram";
import { btn } from "@/components/ui/button";
import { Kicker } from "@/components/ui/primitives";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * The hero as a runnable demo rather than a picture of one.
 *
 * Pressing run types the analyze command, streams the two lines the CLI would
 * print, and only then replays the pipeline graph -- so a first-time reader
 * watches the product work in the order it actually works, on one screen.
 *
 * The terminal and the graph sit in different grid columns but are one
 * machine, which is why they share a component: the graph must not start
 * drawing until the command that produces it has finished printing.
 */

const COMMAND = "chainopt analyze ./src";
const IDLE_COMMAND = "pip install chainopt";
const TYPE_MS = 40;
const OUTPUT_GAP_MS = 400;

/** How long the graph takes to finish its own show. See `globals.css`. */
const DAG_SETTLE_MS = 1900;

type Phase = "idle" | "typing" | "output-1" | "output-2" | "running" | "done";

export function HeroDemo() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");
  /** Bumping this remounts the graph, which restarts its CSS animations. */
  const [run, setRun] = useState(0);
  const [hasRun, setHasRun] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  function after(ms: number, fn: () => void) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  function start() {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setHasRun(true);
    setRun((n) => n + 1);

    if (reduced) {
      // Nothing to watch unfold: land on the finished state directly.
      setTyped(COMMAND);
      setPhase("done");
      return;
    }

    setTyped("");
    setPhase("typing");

    for (let i = 1; i <= COMMAND.length; i += 1) {
      after(i * TYPE_MS, () => setTyped(COMMAND.slice(0, i)));
    }

    const typedAt = COMMAND.length * TYPE_MS;
    after(typedAt + OUTPUT_GAP_MS, () => setPhase("output-1"));
    after(typedAt + OUTPUT_GAP_MS * 2, () => setPhase("output-2"));
    after(typedAt + OUTPUT_GAP_MS * 2 + 200, () => setPhase("running"));
    after(typedAt + OUTPUT_GAP_MS * 2 + 200 + DAG_SETTLE_MS, () =>
      setPhase("done"),
    );
  }

  const settled = phase === "running" || phase === "done";
  const showLine1 = phase === "output-1" || phase === "output-2" || settled;
  const showLine2 = phase === "output-2" || settled;

  return (
    <div className="grid items-center gap-14 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="min-w-0">
        <Kicker>llm pipeline analysis</Kicker>

        <h1 className="mt-6">
          <span className="font-bold text-muted">
            Your traces show what the pipeline cost.
          </span>{" "}
          ChainOpt shows which calls to cut.
        </h1>

        <p className="mt-6 max-w-[56ch] text-[1.05rem] text-muted">
          A Python SDK and CLI that reads your LLM agent pipeline, then points
          at the calls wasting money: duplicated work, models larger than the
          task needs, and steps that could have run in parallel. Every finding
          carries the prompts and responses it came from.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a href="#early-access" className={btn()}>
            Request access
          </a>
          <a href="#how-it-works" className={btn({ variant: "ghost" })}>
            See how it works
          </a>
        </div>

        <div className="mt-7 max-w-[26rem] rounded-term border border-line bg-surface px-4 py-3.5 font-mono text-[0.85rem] leading-[1.7]">
          <p className="flex gap-2.5">
            <span aria-hidden className="shrink-0 select-none text-teal">
              $
            </span>
            <code className="min-w-0 text-text">
              {phase === "idle" ? IDLE_COMMAND : typed}
              {phase === "typing" ? <span aria-hidden className="caret" /> : null}
            </code>
          </p>

          {/*
            Arrows are permitted here and nowhere else on the page: these lines
            are the CLI quoted verbatim, not decoration.
          */}
          {showLine1 ? (
            <p className="pl-[1.4em] text-muted">→ 7 call sites mapped</p>
          ) : null}
          {showLine2 ? (
            <p className="pl-[1.4em] text-muted">
              → 2 findings ·{" "}
              <span data-numeric className="text-teal">
                $59.60/mo
              </span>{" "}
              recoverable
            </p>
          ) : null}
        </div>

        {/* A persistent live region, so the result is announced rather than
            silently redrawn for anyone not watching the screen. */}
        <p className="sr-only" role="status" aria-live="polite">
          {showLine2
            ? "Analysis complete. 7 call sites mapped, 2 findings, $59.60 per month recoverable."
            : ""}
        </p>
      </div>

      {/* The visual half: the product's own output, mid-analysis. */}
      <div className="min-w-0">
        <div className="relative">
          <div className="rounded-feature border border-line panel-surface">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line px-5 py-3 font-mono text-[0.72rem] text-muted">
              <span>pipeline map · support-triage</span>
              <button
                type="button"
                onClick={start}
                className="rounded-inner border border-line px-2 py-1 font-mono text-[0.72rem] text-muted transition-colors duration-150 ease-out hover:border-amber hover:text-amber"
              >
                {hasRun ? "↻ replay" : "▶ run demo"}
              </button>
            </div>
            {/* On a narrow screen the graph would compress its labels past
                legibility, so it scrolls inside its own frame instead. */}
            <div className="overflow-x-auto px-4 py-5">
              <PipelineDiagram key={run} idle={!settled} />
            </div>
          </div>

          <p
            data-numeric
            className={`absolute right-4 -bottom-4 rounded-chip border border-teal-line bg-teal-dim px-3.5 py-2 font-mono text-[0.8rem] text-teal backdrop-blur-[6px] ${
              settled ? "savings-rise" : ""
            }`}
          >
            +$38.20/mo recoverable
          </p>
        </div>

        <p className="mt-14 font-mono text-[0.72rem] text-muted">
          illustrative example · not measured results
        </p>
      </div>
    </div>
  );
}
