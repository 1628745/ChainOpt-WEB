import { CostBar } from "@/components/cost-bar";
import { Evidence, type EvidenceItem } from "@/components/evidence";
import { SectionGlow } from "@/components/section-glow";
import { QUOTES, Testimonial } from "@/components/testimonial";
import {
  Gain,
  Kind,
  Metric,
  Metrics,
  Panel,
  PanelBody,
  PanelFoot,
  PanelHead,
} from "@/components/ui/primitives";
import {
  LATENCY_SAVED,
  OVERSIZING_MONTHLY,
  REDUNDANCY_MONTHLY,
  RUNS,
} from "@/lib/demo";

/**
 * All three findings from the worked example, in the shape the product prints
 * them. Every card carries the same parts in the same order, including the
 * evidence toggle: a card that cannot show its working looks like the one
 * finding that has none.
 *
 * The third card is a parallelism finding, and it reports seconds rather than
 * dollars. Running two independent steps at the same time does not lower the
 * bill, and quoting it in money to keep the row tidy would be a lie about what
 * the tool found.
 */

type Card = {
  id: string;
  kind: string;
  tone: "amber" | "teal";
  title: string;
  value: string;
  unit: string;
  metrics: Array<[label: string, value: string]>;
  body: string;
  evidence: EvidenceItem[];
  method: string;
};

const runs = RUNS.toLocaleString("en-US");

const CARDS: Card[] = [
  {
    id: "redundancy",
    kind: "redundancy",
    tone: "amber",
    title: "Steps 3 and 6 do the same work",
    value: `+$${REDUNDANCY_MONTHLY.toFixed(2)}`,
    unit: "/mo recoverable",
    metrics: [
      ["prompt similarity", "0.94"],
      ["output similarity", "0.89"],
      ["duplicate calls", runs],
    ],
    body: "Both calls send near-identical prompts and return summaries with the same structure. Step 6 can most likely be dropped and its downstream context filled from step 3's response.",
    evidence: [
      {
        step: "step 3 · sonnet",
        prompt:
          "Summarize the ticket below in two sentences for triage. State the customer's problem and what they have already tried.",
        response:
          "The customer cannot complete checkout: the payment step returns a generic error after they enter card details. They have retried on two browsers and cleared their cache.",
      },
      {
        step: "step 6 · sonnet",
        prompt:
          "Give a two-sentence summary of this ticket so it can be routed. Cover the problem and any steps the customer already took.",
        response:
          "Checkout fails for this customer with an unspecified error once card details are submitted. They have already tried a second browser and cleared their cache.",
      },
    ],
    method:
      "Matched by prompt embedding, then confirmed against output structure.",
  },
  {
    id: "oversizing",
    kind: "oversizing",
    tone: "amber",
    title: "Step 4 sends a filled-in template to a frontier model",
    value: `+$${OVERSIZING_MONTHLY.toFixed(2)}`,
    unit: "/mo recoverable",
    metrics: [
      ["current model", "opus"],
      ["cheapest match", "haiku"],
      ["output match", "0.99"],
    ],
    body: "The step's outputs never deviate from a fixed shape and the prompt supplies every value, so the task does not need the model it is being sent to. ChainOpt replays the observed calls against smaller models and names the cheapest one that reproduced the same outputs.",
    evidence: [
      {
        step: "step 4 · opus",
        prompt:
          "Return a JSON routing plan with keys queue, priority and owner. queue is one of billing, technical or account. Ticket category: billing. Severity: 2. Region: EU.",
        response:
          '{"queue": "billing", "priority": "P2", "owner": "billing-eu"}',
      },
      {
        step: "step 4 · haiku, replayed",
        prompt:
          "Return a JSON routing plan with keys queue, priority and owner. queue is one of billing, technical or account. Ticket category: billing. Severity: 2. Region: EU.",
        response:
          '{"queue": "billing", "priority": "P2", "owner": "billing-eu"}',
      },
    ],
    method:
      "Detected from output-schema stability, then replayed against smaller models.",
  },
  {
    id: "parallelism",
    kind: "parallelism",
    tone: "teal",
    title: "Step 5 waits on step 3 and never reads it",
    value: `-${LATENCY_SAVED}`,
    unit: "per run, no change to spend",
    metrics: [
      ["time spent waiting", LATENCY_SAVED],
      ["values passed on", "none"],
      ["safe to reorder", "yes"],
    ],
    body: "Step 5 is awaited after step 3 because of how the two were written, not because it needs anything step 3 produces. Started together, the pair finishes when the slower of the two finishes rather than when both have run end to end.",
    evidence: [
      {
        step: "step 3 · sonnet, output",
        prompt: "Summarize the ticket below in two sentences for triage.",
        response:
          "The customer cannot complete checkout: the payment step returns a generic error after they enter card details. They have retried on two browsers and cleared their cache.",
      },
      {
        step: "step 5 · haiku, next call",
        prompt:
          "Retrieve the three most relevant help-center articles for account_id 41822 and category billing.",
        response:
          "kb-2831 Card declined at checkout; kb-1190 Payment retry limits; kb-0442 Updating a saved card.",
      },
    ],
    method:
      "Derived from the call graph: no value produced by step 3 reaches step 5.",
  },
];

export function FindingPreview() {
  return (
    <section
      id="finding"
      className="section relative isolate overflow-x-clip border-b border-line"
    >
      <div className="wrap">
        <SectionGlow />
        <h2>Three findings from one pipeline</h2>
        <p className="mt-5 max-w-[62ch] text-[1.05rem] text-muted">
          A finding says what kind of waste it is, how confident the match is,
          what it is worth, and which calls it was drawn from. Open one and you
          get the prompts and the responses, so you can check the reasoning
          before you touch the code.
        </p>

        <div className="mt-11 grid gap-5 md:grid-cols-3">
          {CARDS.map((card) => (
            <Panel key={card.id}>
              <PanelHead>
                <Kind tone={card.tone}>{card.kind}</Kind>
                <span data-numeric>{runs} runs analyzed</span>
              </PanelHead>

              <PanelBody>
                <h3 className="text-[clamp(1.2rem,2vw,1.45rem)] leading-[1.2] font-bold tracking-[-0.02em] text-text">
                  {card.title}
                </h3>

                <Gain value={card.value} unit={card.unit} className="mt-5" />

                <Metrics>
                  {card.metrics.map(([label, value]) => (
                    <Metric key={label} label={label} value={value} />
                  ))}
                </Metrics>

                <p className="mt-5 text-[0.95rem] leading-[1.65] text-muted">
                  {card.body}
                </p>

                <Evidence items={card.evidence} />
              </PanelBody>

              <PanelFoot>{card.method}</PanelFoot>
            </Panel>
          ))}
        </div>

        <p className="mt-5 text-[0.82rem] text-muted">
          Illustrative example, not measured results.
        </p>

        {/* The two cost findings above, stated as one picture. */}
        <CostBar className="mt-10" />

        {/* Renders only once a real quote replaces the placeholder. */}
        <Testimonial quote={QUOTES.finding} className="mt-8 max-w-[720px]" />
      </div>
    </section>
  );
}
