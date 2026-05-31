import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TierData = {
  name: string;
  price: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  ctaVariant?: "default" | "outline";
};

const tiers: TierData[] = [
  {
    name: "Free",
    price: "$0",
    features: [
      "Up to 1,000 LLM calls analyzed per month",
      "Pipeline map, redundancy detection, model appropriateness analysis",
      "Community support",
    ],
    cta: "Get started free",
    ctaVariant: "outline",
  },
  {
    name: "Pro",
    price: "$49",
    features: [
      "Unlimited calls analyzed",
      "Cost trend history and anomaly alerts",
      "Parallelization detection",
      "Priority support",
    ],
    cta: "Request early access",
    highlighted: true,
    ctaVariant: "default",
  },
];

function PricingCard({
  name,
  price,
  features,
  cta,
  highlighted,
  ctaVariant = "outline",
}: TierData) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col border p-8",
        highlighted ? "border-[#3b82f6]" : "border-zinc-700",
      )}
    >
      <p className="text-sm font-medium text-white">{name}</p>

      <p className="mt-4">
        <span className="text-4xl font-medium tracking-tight text-white">
          {price}
        </span>
        <span className="text-zinc-500"> / month</span>
      </p>

      <ul className="mt-8 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-relaxed">
            <span className="shrink-0 text-zinc-400" aria-hidden>
              –
            </span>
            <span className="text-zinc-200">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant={ctaVariant}
        className="mt-8 h-11 w-full rounded-none text-sm font-medium"
      >
        {cta}
      </Button>
    </div>
  );
}

export function Pricing() {
  return (
    <section className="border-t border-zinc-800 px-[var(--content-x)] py-24">
      <div className="mx-auto w-full max-w-[var(--content-max)]">
        <h2 className="text-2xl font-medium tracking-tight text-white">
          Pricing
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">
          Simple, usage-based. No per-seat pricing, no enterprise tiers.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {tiers.map((tier) => (
            <PricingCard key={tier.name} {...tier} />
          ))}
        </div>
      </div>
    </section>
  );
}
