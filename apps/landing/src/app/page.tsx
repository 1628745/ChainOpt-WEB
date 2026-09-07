import { CompatBelt } from "@/components/compat-belt";
import { CtaWaitlist } from "@/components/cta-waitlist";
import { Faq } from "@/components/faq";
import { FindingPreview } from "@/components/finding-preview";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Pricing } from "@/components/pricing";
import { TheGap } from "@/components/the-gap";

export default function Home() {
  return (
    <>
      <main id="main" className="flex-1">
        <Hero />
        <CompatBelt />
        <TheGap />
        <HowItWorks />
        <FindingPreview />
        <Pricing />
        <Faq />
        <CtaWaitlist />
      </main>
      <Footer />
    </>
  );
}
