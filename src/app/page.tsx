import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { ModuleMarquee } from "@/components/sections/ModuleMarquee";
import { BentoFeatures } from "@/components/sections/BentoFeatures";
import { IntroStatement } from "@/components/sections/IntroStatement";
import { MultiCompany } from "@/components/sections/MultiCompany";
import { Workdesk } from "@/components/sections/Workdesk";
import { ModuleEcosystem } from "@/components/sections/ModuleEcosystem";
import { AutomationFlow } from "@/components/sections/AutomationFlow";
import { DashboardPreview } from "@/components/sections/DashboardPreview";
import { IntegrationSection } from "@/components/sections/IntegrationSection";
import { AccessControl } from "@/components/sections/AccessControl";
import { IndustrySelector } from "@/components/sections/IndustrySelector";
import { ManufacturingFlow } from "@/components/sections/ManufacturingFlow";
import { TrustSection } from "@/components/sections/TrustSection";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";

/**
 * Narrative: what it is → scale → the person (Workdesk) → breadth (modules) →
 * proof (video) → automation → insight → communication → control →
 * industries → operations → trust → action.
 */
export default function Home() {
  return (
    <Providers>
      <Navbar />
      <main>
        <Hero />
        <ModuleMarquee />
        <IntroStatement />
        <BentoFeatures />
        <MultiCompany />
        <Workdesk />
        <ModuleEcosystem />
        <AutomationFlow />
        <DashboardPreview />
        <IntegrationSection />
        <AccessControl />
        <IndustrySelector />
        <ManufacturingFlow />
        <TrustSection />
        <FinalCTA />
      </main>
      <Footer />
    </Providers>
  );
}
