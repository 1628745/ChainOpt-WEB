import { SectionGlow } from "@/components/section-glow";
import { Kicker } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

type Row = {
  category: string;
  examples?: string;
  does: string;
  gap: string;
  isChainOpt?: boolean;
};

const rows: Row[] = [
  {
    category: "Tracing",
    examples: "langfuse · helicone",
    does: "Records every call and totals the bill.",
    gap: "Reports what happened. Deciding what to change is left to you.",
  },
  {
    category: "Model routing",
    examples: "agentopt",
    does: "Picks a cheaper model for each step.",
    gap: "Takes the pipeline's shape as given, so duplicated and badly ordered work survives the swap.",
  },
  {
    category: "ChainOpt",
    examples: "sdk · cli",
    does: "Reads the pipeline's structure and names the calls to remove, downgrade, or parallelise.",
    gap: "Each finding cites the prompts and responses behind it, so you can check the reasoning before you touch the code.",
    isChainOpt: true,
  },
];

export function TheGap() {
  return (
    <section id="where-it-fits" className="section relative isolate overflow-x-clip border-b border-line">
      <div className="wrap">
        <SectionGlow />
        <Kicker>where it fits</Kicker>
        <h2 className="mt-5">
          Knowing the number is not the same as knowing the fix
        </h2>

        <dl className="mt-12 flex flex-col gap-2">
          {rows.map((row) => (
            <div
              key={row.category}
              className={cn(
                "grid gap-4 border border-line px-5 py-5 md:grid-cols-[240px_1fr] md:gap-8 md:px-6",
                row.isChainOpt
                  ? "rounded-l-none rounded-r-panel border-l-[3px] border-l-amber bg-[linear-gradient(90deg,var(--color-amber-dim),transparent_65%)]"
                  : "rounded-panel",
              )}
            >
              <dt className="flex flex-col gap-1.5">
                <span
                  className={cn(
                    "text-[1.05rem] font-semibold tracking-[-0.01em]",
                    row.isChainOpt ? "text-amber" : "text-text",
                  )}
                >
                  {row.category}
                </span>
                {row.examples ? (
                  <span className="font-mono text-[0.74rem] text-muted">
                    {row.examples}
                  </span>
                ) : null}
              </dt>

              <dd className="grid gap-3 text-[0.95rem] md:grid-cols-2 md:gap-8">
                <p className="text-text">{row.does}</p>
                <p className={row.isChainOpt ? "text-text" : "text-muted"}>
                  {row.gap}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
