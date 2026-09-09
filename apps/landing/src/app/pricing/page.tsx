import type { Metadata } from "next";

import { Faq } from "@/components/faq";
import { NextStep } from "@/components/next-step";
import { Pricing } from "@/components/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Usage-based pricing with no per-seat charge and no enterprise tier, plus answers on what ChainOpt stores, what it supports, and how its savings estimates are computed.",
  alternates: { canonical: "/pricing" },
};

/**
 * Prices and the questions people ask about them. What a tool costs and what
 * it does with your source are the same decision, so they sit together.
 */
export default function PricingPage() {
  return (
    <>
      <Pricing />
      <Faq />
      <NextStep
        line="Private beta is free, and there is no card to enter."
        primary={{ href: "/early-access", label: "Request access" }}
        secondary={{ href: "/how-it-works", label: "How it works" }}
      />
    </>
  );
}
