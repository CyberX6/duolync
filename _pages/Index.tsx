import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import VideoShowcaseSection from "@/components/landing/VideoShowcaseSection";
import InfluencerSearchSection from "@/components/landing/InfluencerSearchSection";
import InfluencerContactSection from "@/components/landing/InfluencerContactSection";
import InfluencerCRMSection from "@/components/landing/InfluencerCRMSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import FreeToolsSection from "@/components/landing/FreeToolsSection";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <VideoShowcaseSection />
        <InfluencerSearchSection />
        <InfluencerContactSection />
        <InfluencerCRMSection />
        <UseCasesSection />
        <FreeToolsSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
