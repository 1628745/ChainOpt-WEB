import { SectionGlow } from "@/components/section-glow";
import { cn } from "@/lib/utils";

/**
 * Where ChainOpt sits next to the tools a reader already runs.
 *
 * A real table with real column headers. It was three unlabelled columns, and
 * the third one quietly changed meaning on our own row: a limitation for
 * everybody else, a benefit for us. Every row now answers the same question in
 * the same column, including ours.
 *
 * Our row is marked the way the system marks a finding: an amber wash that
 * fades out across the row, an amber title, and body text at full brightness
 * where the competitor rows stay muted. The wash needs room either side of
 * the text, so every row carries the same inner padding and the table is
 * pulled out by that amount; the highlight used to pad only its own cells,
 * which indented our name twenty pixels off the column above it.
 */

type Row = {
  tool: string;
  examples: string;
  does: string;
  leaves: string;
  ours?: boolean;
};

const COLUMNS = ["Tool", "What it does", "What it leaves to you"];

const rows: Row[] = [
  {
    tool: "Tracing",
    examples: "langfuse · helicone",
    does: "Records every call and totals the bill.",
    leaves:
      "Which calls to change. The totals are per model and per run, so a duplicated step looks like ordinary spend.",
  },
  {
    tool: "Model routing",
    examples: "agentopt",
    does: "Swaps a cheaper model in for each step.",
    leaves:
      "The shape of the pipeline. Duplicated and badly ordered work survives the swap and keeps costing you.",
  },
  {
    tool: "ChainOpt",
    examples: "sdk · cli",
    does: "Reads the pipeline structure and names the calls to remove, downgrade, or run in parallel.",
    leaves:
      "Whether to apply it. Each finding is a suggestion with its prompts and responses attached, and nothing is rewritten for you.",
    ours: true,
  },
];

/** The column label, repeated inside each cell at the width the header row is
    not shown. */
function CellLabel({ children }: { children: string }) {
  return (
    <span className="mb-1 block font-mono text-[0.7rem] text-muted md:hidden">
      {children}
    </span>
  );
}

export function TheGap() {
  return (
    <section
      id="where-it-fits"
      className="section relative isolate overflow-x-clip border-b border-line"
    >
      <div className="wrap">
        <SectionGlow />
        <h2>Where ChainOpt sits next to your tracing stack</h2>

        <table className="mt-12 w-full border-collapse text-left md:-mx-5 md:w-[calc(100%+2.5rem)]">
          <caption className="sr-only">
            What tracing tools, model routers and ChainOpt each do, and what
            each one leaves for you to decide.
          </caption>

          <thead className="hidden md:table-header-group">
            <tr>
              {COLUMNS.map((column, i) => (
                <th
                  key={column}
                  scope="col"
                  className={cn(
                    "border-b border-line pb-3 font-mono text-[0.74rem] font-normal text-muted",
                    i === 0 ? "w-[240px] pr-6 pl-5" : "px-6",
                    i === COLUMNS.length - 1 && "pr-5",
                  )}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.tool}
                className={cn(
                  "mb-2 block rounded-panel border border-line last:mb-0 md:mb-0 md:table-row md:rounded-none md:border-x-0 md:border-t-0",
                  row.ours &&
                    "bg-[linear-gradient(90deg,var(--color-amber-dim),transparent_65%)]",
                )}
              >
                <th
                  scope="row"
                  className="block px-5 pt-5 text-left align-top font-normal md:table-cell md:py-6 md:pr-6"
                >
                  <CellLabel>{COLUMNS[0]}</CellLabel>
                  <span
                    className={cn(
                      "block text-[1.05rem] font-semibold tracking-[-0.01em]",
                      row.ours ? "text-amber" : "text-text",
                    )}
                  >
                    {row.tool}
                  </span>
                  <span className="mt-1 block font-mono text-[0.74rem] text-muted">
                    {row.examples}
                  </span>
                </th>

                <td className="block px-5 pt-4 align-top text-[0.95rem] text-text md:table-cell md:px-6 md:py-6">
                  <CellLabel>{COLUMNS[1]}</CellLabel>
                  {row.does}
                </td>

                <td
                  className={cn(
                    "block px-5 pt-4 pb-5 align-top text-[0.95rem] md:table-cell md:py-6 md:pr-5 md:pl-6",
                    row.ours ? "text-text" : "text-muted",
                  )}
                >
                  <CellLabel>{COLUMNS[2]}</CellLabel>
                  {row.leaves}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
