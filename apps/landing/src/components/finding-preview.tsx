import { CostBar } from "@/components/cost-bar";
import { CountUp } from "@/components/count-up";
import { Evidence } from "@/components/evidence";
import { SectionGlow } from "@/components/section-glow";
import { QUOTES, Testimonial } from "@/components/testimonial";
import {
  Badge,
  MetricChip,
  Panel,
  PanelBody,
  PanelFoot,
  PanelHead,
  SavingsLine,
} from "@/components/ui/primitives";

const evidence = [
  {
    step: "step 3 · sonnet",
    prompt: "Summarise the ticket below in two sentences for triage...",
  },
  {
    step: "step 6 · sonnet",
    prompt: "Give a two-sentence summary of this ticket so it can be routed...",
  },
];

export function FindingPreview() {
  return (
    <section id="finding" className="section relative isolate overflow-x-clip border-b border-line">
      <div className="wrap">
        <SectionGlow />
        <h2>What a finding actually looks like</h2>
        <p className="mt-5 max-w-[62ch] text-[0.98rem] text-muted">
          A finding is a claim with its working shown: what kind of waste it is,
          how confident the match is, how many real runs it appeared in, and the
          prompts it was drawn from. Open one to check the reasoning yourself.
        </p>

        <div className="mt-11 grid items-start gap-5 md:grid-cols-[1.25fr_0.75fr]">
          <Panel>
            <PanelHead>
              <Badge>redundancy</Badge>
              <span data-numeric>observed in 847 runs</span>
            </PanelHead>

            <PanelBody>
              <h3>Steps 3 and 6 do the same work</h3>

              <div className="mt-4 flex flex-wrap gap-2">
                <MetricChip label="prompt similarity" value="0.94" />
                <MetricChip label="output similarity" value="0.89" />
                <MetricChip label="calls / month" value="1,240" />
              </div>

              <SavingsLine className="mt-4">
                <CountUp
                  amount={38.2}
                  prefix="+$"
                  suffix="/mo recoverable"
                />
              </SavingsLine>

              <p className="mt-4 max-w-[58ch] text-[0.95rem] text-muted">
                Both calls send near-identical prompts and return summaries with
                the same structure. Step 6 can most likely be dropped and its
                downstream context filled from step 3&apos;s response.
              </p>

              <Evidence
                items={evidence}
                note="matched on embedding cosine similarity, then confirmed against output structure"
              />
            </PanelBody>

            <PanelFoot>
              detected via prompt embedding comparison across 847 recorded runs
            </PanelFoot>
          </Panel>

          <Panel>
            <PanelHead>
              <Badge tone="teal">oversizing</Badge>
              <span data-numeric>observed in 612 runs</span>
            </PanelHead>

            <PanelBody>
              <h3>A frontier model is filling in a template</h3>

              <div className="mt-4 flex flex-wrap gap-2">
                <MetricChip label="step" value="4" />
                <MetricChip label="opus → haiku" value="0.99 match" />
              </div>

              <SavingsLine className="mt-4">
                <CountUp
                  amount={21.4}
                  prefix="+$"
                  suffix="/mo recoverable"
                />
              </SavingsLine>

              <p className="mt-4 text-[0.95rem] text-muted">
                The step&apos;s outputs never deviate from a fixed shape and the
                prompt supplies every value, so the task does not need the model
                it is being sent to. ChainOpt names the cheaper model that
                covered the same outputs across the observed runs.
              </p>
            </PanelBody>

            <PanelFoot>detected via output-schema stability across runs</PanelFoot>
          </Panel>
        </div>

        <p className="mt-5 text-[0.8rem] text-muted">
          Illustrative example — not measured results.
        </p>

        {/* The two panels above, stated as one picture. */}
        <CostBar className="mt-10" />

        {/* Renders only once a real quote replaces the placeholder. */}
        <Testimonial quote={QUOTES.finding} className="mt-8 max-w-[720px]" />
      </div>
    </section>
  );
}
