import { Fragment } from "react";

import { TerminalBlock } from "@/components/terminal-block";
import { cn } from "@/lib/utils";

type StepData = {
  number: string;
  title: string;
  description: string;
  command?: string;
};

const steps: StepData[] = [
  {
    number: "01",
    title: "Install the SDK",
    description:
      "Add ChainOpt to your project with pip. The SDK patches your httpx transport layer to intercept all outbound LLM calls — no changes to your existing pipeline code required. Works with LangChain, LangGraph, and raw OpenAI/Anthropic SDK usage.",
    command: "pip install chainopt",
  },
  {
    number: "02",
    title: "Run the static analyzer",
    description:
      "Point the CLI at your source directory. ChainOpt reads your pipeline files, maps the call graph, and infers the purpose of each LLM call — extraction, routing, summarization, generation, validation. Outputs a structured pipeline map.",
    command: "chainopt analyze ./src",
  },
  {
    number: "03",
    title: "Review your recommendations",
    description:
      "After your application runs, ChainOpt surfaces specific findings in your VS Code sidebar and web dashboard — each one backed by real prompt/response pairs from your actual runs, with estimated monthly savings.",
  },
];

function StepConnector({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex shrink-0 items-center text-zinc-700", className)}
      aria-hidden
    >
      <div className="h-px flex-1 bg-zinc-700" />
      <span className="px-2 font-terminal text-xs">→</span>
      <div className="h-px flex-1 bg-zinc-700" />
    </div>
  );
}

function Step({
  number,
  title,
  description,
  command,
}: StepData) {
  return (
    <article className="min-w-0 flex-1">
      <p className="font-terminal text-xs text-zinc-600">{number}</p>
      <h3 className="mt-3 text-base font-medium text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{description}</p>
      {command ? <TerminalBlock commands={command} className="mt-5" /> : null}
    </article>
  );
}

export function HowItWorks() {
  return (
    <section className="border-t border-zinc-800 px-[var(--content-x)] py-24">
      <div className="mx-auto w-full max-w-[var(--content-max)]">
        <p className="font-terminal text-sm text-zinc-500">HOW IT WORKS</p>

        <div className="mt-12 flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-6">
          {steps.map((step, index) => (
            <Fragment key={step.number}>
              {index > 0 ? (
                <>
                  <div
                    className="h-px w-full bg-zinc-700 lg:hidden"
                    aria-hidden
                  />
                  <StepConnector className="hidden w-10 self-start pt-8 lg:flex" />
                </>
              ) : null}
              <Step {...step} />
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
