"use client";

import Navbar from "@/app/_components/layout/Navbar";
import Footer from "@/app/_components/layout/Footer";
import { HeroSection } from "./_sections/HeroSection";
import { BentoSection } from "./_sections/BentoSection";
import { SmartFiltersSection } from "./_sections/SmartFiltersSection";
import { OmniDashboardSection } from "./_sections/OmniDashboardSection";
import { MailCRMSection } from "./_sections/MailCRMSection";
import { AIGrowthSection } from "./_sections/AIGrowthSection";
import { RoadmapSection } from "./_sections/RoadmapSection";
import { FinalCTASection } from "./_sections/FinalCTASection";

export default function ForCreatorsPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page-alt)" }}>
      {/* Dark Navbar override */}
      <div className="fixed top-0 left-0 right-0 z-50" style={{ background: "var(--bg-navbar)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border-card)" }}>
        <Navbar />
      </div>

      <main>
        <HeroSection />
        <BentoSection />
        <SmartFiltersSection />
        <OmniDashboardSection />
        <MailCRMSection />
        <AIGrowthSection />
        <RoadmapSection />
        <FinalCTASection />
      </main>

      <div style={{ background: "var(--bg-footer)", borderTop: "1px solid var(--bg-card-hover)" }}>
        <Footer />
      </div>
    </div>
  );
}
