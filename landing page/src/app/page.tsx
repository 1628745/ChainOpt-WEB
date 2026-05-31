import { CtaWaitlist } from "@/components/cta-waitlist";
import { FindingPreview } from "@/components/finding-preview";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Pricing } from "@/components/pricing";
import { TheGap } from "@/components/the-gap";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <TheGap />
        <HowItWorks />
        <FindingPreview />
        <Pricing />
        <CtaWaitlist />
      </main>
      <Footer />
    </>
  );
}
