import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroCreator from "@/assets/hero-creator.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen gradient-hero-canva overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative pt-28 md:pt-32 pb-12">
        <div className="grid lg:grid-cols-[1fr,1.2fr] gap-8 lg:gap-0 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-left px-6 md:px-12 lg:pl-16 xl:pl-24 lg:pr-8"
          >
            {/* Trust badges inline with headline */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[52px] font-bold text-foreground leading-[1.15] mb-6 tracking-tight">
              Influencer marketing{" "}
              <span className="inline-flex items-center gap-1 align-middle">
                <span className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-white"
                    />
                  ))}
                </span>
              </span>{" "}
              software designed for{" "}
              <span className="gradient-text">small agencies</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
              The go-to Influencer Marketing Software for small businesses and startups. 
              Say goodbye to time-consuming influencer recruitment and say hello to finding 
              and hiring creators in record time.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
              <Button className="btn-gradient text-base h-12 px-8 gap-2 shadow-xl rounded-full" asChild>
                <Link href="/auth">
                  Start for Free
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="text-base">✋</span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base">🌱</span>
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base">⚡</span>
                <span>5mn set-up</span>
              </div>
            </div>
          </motion.div>

          {/* Right Visual - Hero Image extending to edge */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative lg:-mr-16 xl:-mr-24"
          >
            <img
              src={heroCreator}
              alt="Creator using Nexly platform with social media analytics"
              className="w-full h-auto max-h-[500px] lg:max-h-[550px] object-cover object-top lg:rounded-l-3xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Gradient fade to white at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
