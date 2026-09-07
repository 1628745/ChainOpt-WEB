import { SectionGlow } from "@/components/section-glow";
import { QUOTES, Testimonial } from "@/components/testimonial";
import { btn } from "@/components/ui/button";
import { Badge, Kicker } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

type Tier = {
  name: string;
  price: string;
  note: string;
  features: string[];
  variant: "primary" | "ghost";
  featured?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Free",
    price: "$0",
    note: "For trying it on one pipeline.",
    features: [
      "Up to 1,000 calls analysed each month",
      "Pipeline map and redundancy detection",
      "Model-appropriateness checks",
      "Community support",
    ],
    variant: "ghost",
  },
  {
    name: "Pro",
    price: "$49",
    note: "For pipelines running in production.",
    features: [
      "Unlimited calls analysed",
      "Parallelisation detection",
      "Cost trends and anomaly alerts",
      "Priority support",
    ],
    variant: "primary",
    featured: true,
  },
];

function TierCard({ name, price, note, features, variant, featured }: Tier) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-panel border p-7",
        featured
          ? "border-amber-line-strong panel-surface"
          : "border-line bg-surface",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-mono text-[0.85rem] font-semibold tracking-normal text-muted">
          {name}
        </h3>
        {featured ? <Badge>planned</Badge> : null}
      </div>

      <p className="mt-5 flex items-baseline gap-2">
        <span className="text-[2.6rem] font-extrabold tracking-[-0.03em] text-text">
          {price}
        </span>
        <span className="font-mono text-[0.78rem] text-muted">/ month</span>
      </p>

      <p className="mt-2 text-[0.92rem] text-muted">{note}</p>

      <ul className="mt-7 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3 text-[0.93rem]">
            <span
              aria-hidden
              className={cn(
                "mt-[5px] size-3 shrink-0 rounded-[3px] border",
                featured ? "border-amber-line-strong" : "border-line-strong",
              )}
            />
            <span className="text-text">{feature}</span>
          </li>
        ))}
      </ul>

      <a href="#early-access" className={cn(btn({ variant }), "mt-8 w-full")}>
        Request access
      </a>
    </div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="section relative isolate overflow-x-clip border-b border-line">
      <div className="wrap">
        <SectionGlow />
        <Kicker>pricing</Kicker>
        <h2 className="mt-5">Usage-based, with no seats to count</h2>
        <p className="mt-5 max-w-[58ch] text-[0.98rem] text-muted">
          These are the planned rates for general release. While ChainOpt is in
          private beta there is nothing to pay and no card to enter.
        </p>

        <div className="mt-11 grid max-w-[840px] gap-5 md:grid-cols-2">
          {tiers.map((tier) => (
            <TierCard key={tier.name} {...tier} />
          ))}
        </div>

        {/* Renders only once a real quote replaces the placeholder. */}
        <Testimonial quote={QUOTES.pricing} className="mt-5 max-w-[840px]" />
      </div>
    </section>
  );
}
