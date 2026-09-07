import { TerminalBlock } from "@/components/terminal-block";
import { Kicker } from "@/components/ui/primitives";

type Step = {
  title: string;
  description: string;
  terminal: { command: string; output?: string[] }[];
  /** Illustrative output blocks are not offered for copying. */
  copyable?: boolean;
};

const steps: Step[] = [
  {
    title: "Install the SDK",
    description:
      "ChainOpt patches the httpx transport your client already uses, so outbound calls to OpenAI and Anthropic are recorded without touching your pipeline code. Works with LangChain, LangGraph, and the raw provider SDKs.",
    copyable: true,
    terminal: [
      { command: "pip install chainopt" },
      {
        command: "chainopt init",
        output: ["wrote .chainopt/config.toml", "patched httpx transport"],
      },
    ],
  },
  {
    title: "Map the pipeline",
    description:
      "Point the CLI at your source. It walks the call graph and infers what each step is for — routing, extraction, summarising, validation — and writes a structured map of the pipeline.",
    copyable: true,
    terminal: [
      {
        command: "chainopt analyze ./src",
        output: [
          "resolved 6 llm call sites",
          "wrote pipeline_map.json",
        ],
      },
    ],
  },
  {
    title: "Read the findings",
    description:
      "Once your application has run, ChainOpt compares what the map predicted against what actually executed, and ranks the waste it found. Each finding opens onto the runs it was drawn from.",
    terminal: [
      {
        command: "chainopt findings",
        output: [
          "redundancy  step 3 ≈ step 6  +$38.20/mo",
          "oversizing  step 4 → haiku   +$11.40/mo",
        ],
      },
    ],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section border-b border-line">
      <div className="wrap">
        <Kicker>how it works</Kicker>
        <h2 className="mt-5">Three commands from install to first finding</h2>

        <ol className="mt-14 flex flex-col gap-12">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="grid items-start gap-5 md:grid-cols-[56px_1fr_380px] md:gap-8"
            >
              <span
                aria-hidden
                className="flex size-11 items-center justify-center rounded-btn border border-line bg-surface-2 font-mono text-[0.9rem] text-amber"
              >
                {i + 1}
              </span>

              <div>
                <h3>{step.title}</h3>
                <p className="mt-3 max-w-[54ch] text-[0.95rem] text-muted">
                  {step.description}
                </p>
              </div>

              <TerminalBlock
                lines={step.terminal}
                copyable={step.copyable ?? false}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
