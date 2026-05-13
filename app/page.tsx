"use client";

import Navbar from "@/app/_components/layout/Navbar";
import Footer from "@/app/_components/layout/Footer";
import { HeroSection } from "@/app/_components/home/HeroSection";
import { BentoSection } from "@/app/_components/home/BentoSection";
import { SearchSection } from "@/app/_components/home/SearchSection";
import { OutreachSection } from "@/app/_components/home/OutreachSection";
import { CRMSection } from "@/app/_components/home/CRMSection";
import { ToolsSection } from "@/app/_components/home/ToolsSection";
import { FAQSection } from "@/app/_components/home/FAQSection";
import { FinalCTASection } from "@/app/_components/home/FinalCTASection";
import { WaitlistProvider } from "@/app/_components/waitlist/WaitlistContext";
import { WaitlistModal } from "@/app/_components/waitlist/WaitlistModal";

export default function Page() {
  return (
    <WaitlistProvider>
      <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
        {/* Navbar — fixed dark overlay */}
        <div
          className="fixed top-0 left-0 right-0 z-50"
          style={{
            background: "var(--bg-navbar)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid var(--border-card)",
          }}
        >
          <Navbar />
        </div>

        <main>
          <HeroSection />
          <BentoSection />
          <SearchSection />
          <OutreachSection />
          <CRMSection />
          <ToolsSection />
          <FAQSection />
          <FinalCTASection />
        </main>

        <div style={{ background: "var(--bg-footer)", borderTop: "1px solid var(--border-card)" }}>
          <Footer />
        </div>

        <WaitlistModal />
      </div>
    </WaitlistProvider>
  );
}
