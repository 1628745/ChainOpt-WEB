import Link from "next/link";

import { SectionGlow } from "@/components/section-glow";
import { QUOTES, Testimonial } from "@/components/testimonial";
import { btn } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Two plans, both of them planned rates.
 *
 * Every feature listed here has to survive the FAQ two sections down, which
 * says there is no hosted backend. Anything phrased as a service ChainOpt runs
 * for you (trend dashboards, alerting) contradicts that, so what Pro adds is
 * volume, history kept in your own repo, and a CI check.
 *
 * Detection is not a paid feature. Parallelism findings used to sit behind
 * Pro while the hero called them one of the three things ChainOpt looks for;
 * gating a third of the product's stated purpose reads as a paywall on the
 * demo. Free finds everything Pro finds, on less traffic.
 */

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
      "Up to 1,000 calls analyzed each month",
      "Redundancy, oversizing and parallelism findings",
      "Prompt and response evidence on every finding",
      "Community support",
    ],
    variant: "ghost",
  },
  {
    name: "Pro",
    price: "$49",
    note: "For pipelines running in production.",
    features: [
      "Unlimited calls analyzed",
      "Cost history across runs, written to your repo",
      "CI check that fails a build on new findings",
      "Support direct from me",
    ],
    variant: "primary",
    featured: true,
  },
];

/**
 * A list marker, not a verdict. These were checkmarks, teal on Free and amber
 * on Pro, which spent both accent colours on decoration: nothing in a plan's
 * feature list is a saving or a finding. The marker is the small rounded
 * square the design system reserves for pricing, in the Pro card's own border
 * colour and otherwise in the neutral line.
 */
function Marker({ featured }: { featured?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "mt-[7px] size-2.5 shrink-0 rounded-[3px]",
        featured ? "bg-amber-line-strong" : "bg-line-strong",
      )}
    />
  );
}

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
      {/*
        Both cards carry the same label row. It sat on the featured card only,
        which pushed that card's price a line lower than the one beside it and
        left the two figures the page most wants compared out of alignment.
      */}
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-mono text-[0.85rem] font-semibold tracking-normal text-muted">
          {name}
        </h3>
        <span className="font-mono text-[0.72rem] text-muted">planned rate</span>
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
            <Marker featured={featured} />
            <span className="text-text">{feature}</span>
          </li>
        ))}
      </ul>

      <Link href="/early-access" className={cn(btn({ variant }), "mt-8 w-full")}>
        Request access
      </Link>
    </div>
  );
}

export function Pricing() {
  return (
    <section
      id="pricing"
      className="section relative isolate overflow-x-clip border-b border-line"
    >
      <div className="wrap">
        <SectionGlow />
        <h2>Two plans, no seats and no enterprise tier</h2>
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
        <Testimonial quote={QUOTES.pricing} className="mt-5" />
      </div>
    </section>
  );
}
