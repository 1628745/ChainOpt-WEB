import type { Metadata } from "next";

import { CtaWaitlist } from "@/components/cta-waitlist";

export const metadata: Metadata = {
  title: "Early access",
  description:
    "ChainOpt is in private beta. Request access to run the analysis engine against a real pipeline before a wider release.",
  alternates: { canonical: "/early-access" },
};

/** The end of every path through the site, so it offers no onward step. */
export default function EarlyAccessPage() {
  return <CtaWaitlist />;
}
