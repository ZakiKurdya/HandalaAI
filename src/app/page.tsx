import { Hero } from "@/components/landing/hero";
import { WhySection } from "@/components/landing/why-section";
import { HowSection } from "@/components/landing/how-section";
import { TrustSection } from "@/components/landing/trust-section";
import { ScrollingOliveBranch } from "@/components/landing/scrolling-olive";

export default function HomePage() {
  return (
    <>
      <ScrollingOliveBranch />
      <Hero />
      <WhySection />
      <HowSection />
      <TrustSection />
    </>
  );
}
