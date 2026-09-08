import { CompatBelt } from "@/components/compat-belt";
import { Hero } from "@/components/hero";
import { NextStep } from "@/components/next-step";
import { TheGap } from "@/components/the-gap";

/**
 * What ChainOpt is and where it sits against the tools a reader already uses.
 * The method and the prices live one click away; this page only has to earn
 * that click.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <CompatBelt />
      <TheGap />
      <NextStep
        line="Three commands from install to first finding."
        primary={{ href: "/how-it-works", label: "See how it works" }}
        secondary={{ href: "/early-access", label: "Request access" }}
      />
    </>
  );
}
