import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/ScrollReveal";
import { ParallaxElement } from "@/components/animations/ParallaxSection";

const benefits = [
  "Free to join, no hidden fees",
  "Keep 100% of your earnings",
  "Connect with verified brands",
  "Professional analytics dashboard",
  "Secure payment processing",
  "24/7 creator support",
];

const BecomeCreatorSection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 section-gradient" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <ScrollReveal delay={0}>
              <span className="badge-new mb-6 inline-block">Join Today</span>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Start Your Creator{" "}
                <span className="gradient-text">Journey</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Whether you have 1,000 followers or 10 million, there's a place
                for you on Duolync. Join our community of creators and start
                earning from your influence.
              </p>
            </ScrollReveal>

            <StaggerContainer
              className="grid sm:grid-cols-2 gap-4 mb-10"
              staggerDelay={0.08}
            >
              {benefits.map((benefit, index) => (
                <StaggerItem key={index}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full gradient-hero-canva flex items-center justify-center shrink-0">
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <ScrollReveal delay={0.5}>
              <Button
                className="btn-gradient text-lg h-14 px-10 gap-2 rounded-full"
                asChild
              >
                <Link href="/auth?type=creator">
                  Apply as Creator
                  <ArrowRight size={20} />
                </Link>
              </Button>
            </ScrollReveal>
          </div>

          {/* Visual */}
          <ScrollReveal direction="right" delay={0.2}>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <ParallaxElement speed={0.15} direction="up">
                    <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform">
                      <div className="text-4xl font-bold gradient-text mb-2">
                        50K+
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Active Creators
                      </div>
                    </div>
                  </ParallaxElement>
                  <ParallaxElement speed={0.25} direction="down">
                    <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform">
                      <div className="text-4xl font-bold gradient-text mb-2">
                        $10K+
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Paid to Creators
                      </div>
                    </div>
                  </ParallaxElement>
                  <ParallaxElement speed={0.2} direction="down">
                    <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform">
                      <div className="text-4xl font-bold gradient-text mb-2">
                        10K+
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Brand Partners
                      </div>
                    </div>
                  </ParallaxElement>
                  <ParallaxElement speed={0.3} direction="up">
                    <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform">
                      <div className="text-4xl font-bold gradient-text mb-2">
                        98%
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Satisfaction Rate
                      </div>
                    </div>
                  </ParallaxElement>
                </div>
              </div>

              {/* Floating badge */}
              <ParallaxElement
                speed={0.5}
                direction="up"
                className="absolute -top-4 -right-4"
              >
                <div className="px-4 py-2 rounded-full gradient-hero-canva text-white text-sm font-bold shadow-xl">
                  🚀 Join Now
                </div>
              </ParallaxElement>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default BecomeCreatorSection;
