import type { Metadata } from "next";

import { FindingPreview } from "@/components/finding-preview";
import { HowItWorks } from "@/components/how-it-works";
import { NextStep } from "@/components/next-step";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Install the SDK, map the pipeline, read the findings. What ChainOpt does to an LLM agent pipeline in three commands, and what a finding looks like when it comes back.",
  alternates: { canonical: "/how-it-works" },
};

/**
 * The method and its output together: what the three commands do, then the
 * kind of finding they produce. Split apart, a reader would leave with the
 * procedure and no idea what it buys them.
 */
export default function HowItWorksPage() {
  return (
    <>
      <HowItWorks />
      <FindingPreview />
      <NextStep
        line="There is nothing to pay while ChainOpt is in private beta."
        primary={{ href: "/early-access", label: "Request access" }}
        secondary={{ href: "/pricing", label: "See pricing" }}
      />
    </>
  );
}
