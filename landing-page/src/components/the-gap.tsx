import { cn } from "@/lib/utils";

type ColumnData = {
  title: string;
  description: string;
  highlighted?: boolean;
};

const columns: ColumnData[] = [
  {
    title: "Observability tools (Langfuse, Helicone)",
    description:
      "Show you what your pipeline costs and where latency lives. Essential, but passive — they don't tell you what to change.",
  },
  {
    title: "Model selectors (AgentOpt)",
    description:
      "Optimize which model handles each step. Narrow scope — doesn't address pipeline structure, redundancy, or call sequencing.",
  },
  {
    title: "ChainOpt",
    description:
      "Analyzes your pipeline structure. Flags redundant call pairs with semantic similarity scores. Identifies oversized model usage. Detects parallelization opportunities. Shows you the actual prompt/response evidence behind every finding.",
    highlighted: true,
  },
];

function Column({ title, description, highlighted }: ColumnData) {
  return (
    <div
      className={cn(
        "min-w-0",
        highlighted && "border border-[#3b82f6] bg-[#111111] px-6 py-6 md:px-8",
      )}
    >
      <h3 className="text-sm font-medium leading-snug text-white">{title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-zinc-400">{description}</p>
    </div>
  );
}

export function TheGap() {
  return (
    <section className="border-t border-zinc-800 px-[var(--content-x)] py-24">
      <div className="mx-auto w-full max-w-[var(--content-max)]">
        <p className="font-terminal text-sm text-zinc-400">WHERE IT FITS</p>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {columns.map((column) => (
            <Column key={column.title} {...column} />
          ))}
        </div>
      </div>
    </section>
  );
}
