import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

function FindingBadge({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block font-terminal text-xs tracking-wide uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

function FindingCardShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-zinc-700 bg-zinc-900",
        className,
      )}
    >
      {children}
    </div>
  );
}

function RedundancyFindingCard() {
  return (
    <FindingCardShell>
      <div className="p-6">
        <FindingBadge className="bg-amber-950 px-2 py-1 text-amber-400">
          REDUNDANCY
        </FindingBadge>

        <h3 className="mt-4 text-base font-medium text-white">
          Steps 3 → 7 are semantically equivalent
        </h3>

        <p className="mt-3 font-terminal text-xs leading-relaxed text-zinc-400">
          Prompt similarity: 0.94 · Output similarity: 0.89 · 847 runs
          observed
        </p>

        <hr className="my-6 border-zinc-700" />

        <p className="text-lg text-white">
          $38.20 / month estimated savings
        </p>

        <p className="mt-4 text-sm leading-relaxed text-zinc-300">
          These two calls share nearly identical prompt templates and produce
          structurally equivalent outputs. Step 7 can likely be removed and its
          downstream context populated from Step 3&apos;s response.
        </p>

        <div
          className="mt-6 flex cursor-default items-center justify-between border border-zinc-700 bg-zinc-950 px-4 py-3"
          role="presentation"
        >
          <span className="font-terminal text-sm text-zinc-300">
            See evidence (4 run pairs)
          </span>
          <ChevronDown className="size-4 shrink-0 text-zinc-500" aria-hidden />
        </div>

        <p className="mt-6 font-terminal text-[0.6875rem] leading-relaxed text-zinc-500">
          Detected via pgvector cosine similarity + output structure comparison
        </p>
      </div>
    </FindingCardShell>
  );
}

function CollapsedFindingCard() {
  return (
    <FindingCardShell>
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <FindingBadge className="bg-sky-950 px-2 py-1 text-sky-400">
            OVERSIZING
          </FindingBadge>
          <h3 className="mt-3 text-sm font-medium text-zinc-300">
            GPT-4o used for template slot-filling
          </h3>
        </div>
        <ChevronDown className="mt-1 size-4 shrink-0 text-zinc-600" aria-hidden />
      </div>
    </FindingCardShell>
  );
}

export function FindingPreview() {
  return (
    <section className="border-t border-zinc-800 px-[var(--content-x)] py-24">
      <div className="mx-auto w-full max-w-[var(--content-max)]">
        <h2 className="text-2xl font-medium tracking-tight text-white">
          Here&apos;s what a finding will look like
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
          Every recommendation includes the detection type, similarity scores,
          the number of real runs it was observed in, estimated monthly cost
          savings, and a panel of supporting evidence from your actual pipeline
          runs. The cards below are illustrative examples.
        </p>

        <div className="mt-10 max-w-2xl space-y-3">
          <RedundancyFindingCard />
          <CollapsedFindingCard />
        </div>
      </div>
    </section>
  );
}
