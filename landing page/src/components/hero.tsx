import { buttonVariants } from "@/components/ui/button";
import { TerminalBlock } from "@/components/terminal-block";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="px-[var(--content-x)] py-32">
      <div className="mx-auto w-full max-w-[var(--content-max)]">
        <p className="font-terminal text-sm text-zinc-500">
          LLM Pipeline Analysis
        </p>

        <h1 className="mt-6 max-w-3xl text-4xl font-medium tracking-tight text-white md:text-[2.75rem] md:leading-[1.15]">
          Your observability tool shows costs. ChainOpt explains them.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
          A lightweight SDK and CLI that analyzes your LLM agent pipelines,
          identifies redundant calls, oversized model usage, and parallelization
          opportunities — with specific evidence from your real runs.
        </p>

        <TerminalBlock
          commands={["pip install chainopt", "chainopt analyze ./src"]}
          className="mt-10 max-w-lg"
        />

        <a
          href="#early-access"
          className={cn(
            buttonVariants(),
            "mt-8 h-11 rounded-none px-6 text-sm font-medium no-underline",
          )}
        >
          Request Early Access
        </a>
      </div>
    </section>
  );
}
