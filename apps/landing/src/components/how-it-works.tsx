import { SectionGlow } from "@/components/section-glow";
import { TerminalBlock } from "@/components/terminal-block";
import { CALL_SITES, FINDINGS_OUTPUT, STEPS } from "@/lib/demo";

/**
 * The three commands, and what each one prints.
 *
 * There is no `pip install chainopt` here. ChainOpt is not published to a
 * public index, so printing an install line for a name nobody owns sends
 * readers to a 404 at best and to somebody else's package at worst. Testers
 * get the install line with their invite; the page starts at the first command
 * that is actually theirs to run.
 */

type Step = {
  title: string;
  description: string;
  terminal: { command: string; output?: string[] }[];
};

const steps: Step[] = [
  {
    title: "Add the SDK",
    description:
      "ChainOpt is in private beta and is not on PyPI yet, so the install line comes with your invite. Once it is in, ChainOpt patches the httpx transport your client already uses, and outbound calls to OpenAI and Anthropic are recorded without touching your pipeline code. Works with LangChain, LangGraph, and the raw provider SDKs.",
    terminal: [
      {
        command: "chainopt init",
        output: ["wrote .chainopt/config.toml", "patched httpx transport"],
      },
    ],
  },
  {
    title: "Map the pipeline",
    description:
      "Point the CLI at your source. It walks the call graph and infers what each step is for, whether that is routing, extraction, summarizing or validation, and writes a structured map of the pipeline.",
    terminal: [
      {
        command: "chainopt analyze ./src",
        output: [
          `resolved ${CALL_SITES} call sites across ${STEPS.length} steps`,
          "wrote pipeline_map.json",
        ],
      },
    ],
  },
  {
    title: "Read the findings",
    description:
      "Once your application has run, ChainOpt compares what the map predicted against what actually executed, and ranks the waste it found. Each finding opens onto the runs it was drawn from, which is the section below.",
    terminal: [
      {
        command: "chainopt findings",
        output: FINDINGS_OUTPUT,
      },
    ],
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section relative isolate overflow-x-clip border-b border-line"
    >
      <div className="wrap">
        <SectionGlow />
        <h2>Three commands from install to first finding</h2>
        <p className="mt-5 max-w-[62ch] text-[1.05rem] text-muted">
          The whole of ChainOpt is a Python package and a CLI that runs on your
          machine. Nothing is uploaded and there is no account to sign into.
        </p>

        <ol className="mt-14 flex flex-col gap-12">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="grid items-start gap-5 md:grid-cols-[1fr_420px] md:gap-10"
            >
              <div>
                {/* Metadata in the muted mono the rest of the site uses for
                    it. It was amber, which is the colour of a finding, and a
                    step counter is not something to act on. */}
                <p className="font-mono text-[0.76rem] text-muted">
                  step {i + 1} of {steps.length}
                </p>
                <h3 className="mt-2 text-[1.15rem]">{step.title}</h3>
                <p className="mt-3 max-w-[54ch] text-[0.95rem] text-muted">
                  {step.description}
                </p>
              </div>

              <TerminalBlock lines={step.terminal} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
