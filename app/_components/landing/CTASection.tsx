import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ParallaxElement } from "@/components/animations/ParallaxSection";

const CTASection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-hero-canva" />
      
      {/* Animated elements with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <ParallaxElement speed={0.3} direction="down">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </ParallaxElement>
        <ParallaxElement speed={0.4} direction="up">
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl" />
        </ParallaxElement>
      </div>

      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Sparkle */}
          <ScrollReveal delay={0}>
            <div className="flex justify-center mb-6">
              <Sparkles className="w-10 h-10 text-white/80 animate-sparkle" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-shadow-hero">
              Ready to Transform Your Marketing?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of brands and creators who trust Duolync for authentic 
              collaborations that drive real results.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className="btn-white text-lg h-14 px-10 gap-2 shadow-2xl" asChild>
                <Link href="/auth">
                  Get Started Free
                  <ArrowRight size={20} />
                </Link>
              </Button>
              <Button className="btn-outline-white text-lg h-14 px-10">
                Schedule a Demo
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p className="text-sm text-white/60 mt-8">
              No credit card required • Free plan available
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
