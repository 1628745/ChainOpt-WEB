"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { KineticHeadline } from "@/components/kinetic-headline";
import { PipelineDiagram } from "@/components/pipeline-diagram";
import { btn } from "@/components/ui/button";
import {
  ANALYZE_OUTPUT,
  FINDINGS,
  PIPELINE,
  RECOVERABLE,
} from "@/lib/demo";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * The hero as a runnable demo rather than a picture of one.
 *
 * On load the graph draws itself once and the frame sits at the state the CLI
 * would leave it in. Pressing replay runs it properly: the command types out,
 * the lines the CLI prints stream in, and only then does the graph redraw.
 *
 * The command, its output, the graph and the findings are one frame, in one
 * column, under one button. They used to be split across the two hero columns,
 * so pressing a control on the right grew a box on the left and shunted the
 * whole hero down the page. Every row below is present at all times and only
 * changes what it says, so nothing moves while the demo runs.
 */

const COMMAND = "chainopt analyze ./src";
const TYPE_MS = 40;
const OUTPUT_GAP_MS = 400;

/** How long the graph takes to finish its own show. See `globals.css`. */
const DAG_SETTLE_MS = 1900;

type Phase = "initial" | "typing" | "output-1" | "output-2" | "running" | "done";

export function HeroDemo() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("initial");
  const [typed, setTyped] = useState(COMMAND);
  /** Bumping this remounts the graph, which resets its CSS animations. */
  const [mount, setMount] = useState(0);
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
    setMount((n) => n + 1);

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

  /**
   * The graph animates on arrival and on replay, and is held at its end state
   * while the command types, so it is never blank and never redraws behind a
   * command that has not finished running.
   */
  const drawing = phase === "initial" || phase === "running" || phase === "done";
  const settled = phase === "initial" || phase === "running" || phase === "done";
  const shown = [
    settled || phase === "output-1" || phase === "output-2",
    settled || phase === "output-2",
  ];

  return (
    <div className="grid items-center gap-14 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="min-w-0">
        <KineticHeadline
          segments={[
            { text: "Your agent pipeline is paying for calls it does not need." },
          ]}
        />

        <p className="hero-body mt-6 max-w-[56ch] text-[1.05rem] text-muted">
          ChainOpt is a Python SDK and CLI that reads your LLM pipeline and
          names the calls to cut: work that already ran, models larger than the
          task, and steps waiting on each other for no reason. Every finding
          carries the prompts and responses it was drawn from. It is in private
          beta, and I am looking for testers.
        </p>

        <div className="hero-body mt-9 flex flex-wrap items-center gap-3">
          <Link href="/early-access" className={btn()}>
            Request access
          </Link>
          <Link href="/how-it-works" className={btn({ variant: "ghost" })}>
            See how it works
          </Link>
        </div>
      </div>

      {/* The visual half: the product's own output, and the command that
          produced it, in one frame. */}
      <div className="min-w-0">
        <div className="rounded-feature border border-line panel-surface">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line px-5 py-3 font-mono text-[0.72rem] text-muted">
            <span>pipeline map · {PIPELINE}</span>
            <button
              type="button"
              onClick={start}
              className="rounded-inner border border-line px-2 py-1 font-mono text-[0.72rem] text-muted transition-colors duration-150 ease-out hover:border-amber hover:text-amber"
            >
              {hasRun ? "↻ replay" : "▶ run demo"}
            </button>
          </div>

          <div className="px-4 py-5">
            <PipelineDiagram key={mount} idle={!drawing} />
          </div>

          {/*
            The command and what it printed. Both output rows are always in the
            layout and only turn visible, so the frame is exactly as tall
            before the demo runs as during it.

            Arrows are permitted here and nowhere else on the site: these lines
            are the CLI quoted verbatim, not decoration.
          */}
          <div className="border-t border-line px-5 py-3.5 font-mono text-[0.8rem] leading-[1.7]">
            <p className="flex gap-2.5">
              <span aria-hidden className="shrink-0 select-none text-teal">
                $
              </span>
              <code className="min-w-0 text-text">
                {typed}
                {phase === "typing" ? (
                  <span aria-hidden className="caret" />
                ) : null}
              </code>
            </p>

            {ANALYZE_OUTPUT.map((line, i) => (
              <p
                key={line}
                aria-hidden={!shown[i]}
                className={cn(
                  "pl-[1.4em] text-muted",
                  !shown[i] && "invisible",
                )}
              >
                → {line}
              </p>
            ))}
          </div>

          {/* The three findings, named. The graph marks them; this says what
              each mark means and what it is worth, which is the part a phone
              can read without a 560px picture. */}
          <ul className="border-t border-line px-5 py-3.5">
            {FINDINGS.map((finding) => (
              <li
                key={finding.id}
                className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 py-1 font-mono text-[0.76rem]"
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 shrink-0 self-center rounded-chip",
                    finding.tone === "amber" ? "bg-amber" : "bg-teal",
                  )}
                />
                <span
                  className={
                    finding.tone === "amber" ? "text-amber" : "text-teal"
                  }
                >
                  {finding.kind}
                </span>
                <span className="min-w-0 text-muted">{finding.where}</span>
                <span
                  className={cn(
                    "ml-auto shrink-0",
                    finding.tone === "amber" ? "text-text" : "text-teal",
                  )}
                >
                  {finding.gain}
                </span>
              </li>
            ))}

            <li className="mt-1 flex items-baseline justify-between gap-x-2.5 border-t border-line pt-2 font-mono text-[0.76rem]">
              <span className="text-muted">recoverable</span>
              <span className="text-teal">+${RECOVERABLE.toFixed(2)}/mo</span>
            </li>
          </ul>

          <p className="border-t border-line px-5 py-3.5 font-mono text-[0.76rem] text-muted">
            Illustrative example, not measured results.
          </p>
        </div>

        {/* A persistent live region, so the result is announced rather than
            silently redrawn for anyone not watching the screen. */}
        <p className="sr-only" role="status" aria-live="polite">
          {shown[1] ? `Analysis complete. ${ANALYZE_OUTPUT.join(". ")}.` : ""}
        </p>
      </div>
    </div>
  );
}
