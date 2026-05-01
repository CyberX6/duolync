"use client";

import Navbar from "@/app/_components/layout/Navbar";
import Footer from "@/app/_components/layout/Footer";
import { HeroSection } from "@/app/_components/home/HeroSection";
import { BentoSection } from "@/app/_components/home/BentoSection";
import { SearchSection } from "@/app/_components/home/SearchSection";
import { OutreachSection } from "@/app/_components/home/OutreachSection";
import { CRMSection } from "@/app/_components/home/CRMSection";
import { UseCasesSection } from "@/app/_components/home/UseCasesSection";
import { ToolsSection } from "@/app/_components/home/ToolsSection";
import { FAQSection } from "@/app/_components/home/FAQSection";
import { FinalCTASection } from "@/app/_components/home/FinalCTASection";

export default function Page() {
  return (
    <div className="min-h-screen" style={{ background: "#09090f" }}>
      {/* Navbar — fixed dark overlay */}
      <div
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(9,9,15,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
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
        <UseCasesSection />
        <ToolsSection />
        <FAQSection />
        <FinalCTASection />
      </main>

      <div style={{ background: "#060609", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Footer />
      </div>
    </div>
  );
}
