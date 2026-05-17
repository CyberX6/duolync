"use client";

import Navbar from "@/app/_components/layout/Navbar";
import Footer from "@/app/_components/layout/Footer";
import { WaitlistProvider } from "@/app/_components/waitlist/WaitlistContext";
import { WaitlistModal } from "@/app/_components/waitlist/WaitlistModal";
import { HeroSection } from "./_sections/HeroSection";
import { BentoSection } from "./_sections/BentoSection";
import { AIMatchSection } from "./_sections/AIMatchSection";
import { CampaignCalendarSection } from "./_sections/CampaignCalendarSection";
import { AIAdStrategySection } from "./_sections/AIAdStrategySection";
import { ChromeExtensionSection } from "./_sections/ChromeExtensionSection";
import { CRMSection } from "./_sections/CRMSection";
import { FinalCTASection } from "./_sections/FinalCTASection";

export default function ForBrandsPage() {
  return (
    <WaitlistProvider>
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      {/* Navbar with dark override */}
      <div className="fixed top-0 left-0 right-0 z-50" style={{ background: "var(--bg-navbar)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border-card)" }}>
        <Navbar />
      </div>

      <main>
        <HeroSection />
        <BentoSection />
        <AIMatchSection />
        <CampaignCalendarSection />
        <AIAdStrategySection />
        <ChromeExtensionSection />
        <CRMSection />
        <FinalCTASection />
      </main>

      {/* Footer with dark override */}
      <div style={{ background: "var(--bg-footer)", borderTop: "1px solid var(--border-card)" }}>
        <Footer />
      </div>

      <WaitlistModal />
    </div>
    </WaitlistProvider>
  );
}
