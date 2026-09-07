import { PipelineDiagram } from "@/components/pipeline-diagram";
import { TerminalBlock } from "@/components/terminal-block";
import { btn } from "@/components/ui/button";
import { Kicker } from "@/components/ui/primitives";

export function Hero() {
  return (
    <section className="border-b border-line py-[72px] sm:py-[104px]">
      <div className="wrap grid items-center gap-14 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
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

          <TerminalBlock lines="pip install chainopt" className="mt-7 max-w-[22rem]" />
        </div>

        {/* The visual half: the product's own output, mid-analysis. */}
        <div className="min-w-0">
          <div className="relative">
            <div className="rounded-feature border border-line panel-surface">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line px-5 py-3 font-mono text-[0.72rem] text-muted">
                <span>pipeline map · support-triage</span>
                <span data-numeric>6 steps · 847 runs</span>
              </div>
              {/* On a narrow screen the graph would compress its labels past
                  legibility, so it scrolls inside its own frame instead. */}
              <div className="overflow-x-auto px-4 py-5">
                <PipelineDiagram />
              </div>
            </div>

            <p
              data-numeric
              className="savings-rise absolute -bottom-4 right-4 rounded-chip border border-teal-line bg-teal-dim px-3.5 py-2 font-mono text-[0.8rem] text-teal backdrop-blur-[6px]"
            >
              +$38.20/mo recoverable
            </p>
          </div>

          <p className="mt-14 font-mono text-[0.72rem] text-muted">
            illustrative example · not measured results
          </p>
        </div>
      </div>
    </section>
  );
}
