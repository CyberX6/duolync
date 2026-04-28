import { Search, MessageSquare, Handshake, TrendingUp } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";

const steps = [
  {
    icon: Search,
    title: "Discover",
    description: "Browse thousands of verified creators or let brands find you with smart AI matching.",
    gradient: "feature-icon-purple",
  },
  {
    icon: MessageSquare,
    title: "Connect",
    description: "Message directly, discuss campaign details, and negotiate terms in-platform.",
    gradient: "feature-icon-cyan",
  },
  {
    icon: Handshake,
    title: "Collaborate",
    description: "Manage projects, share content drafts, and track deliverables seamlessly.",
    gradient: "feature-icon-orange",
  },
  {
    icon: TrendingUp,
    title: "Grow Together",
    description: "Track campaign performance with real-time analytics and build lasting partnerships.",
    gradient: "feature-icon-magenta",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 md:py-32 section-gradient relative overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <ScrollReveal delay={0}>
            <span className="badge-new mb-6 inline-block">How It Works</span>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              From Discovery to{" "}
              <span className="gradient-text">Success</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-muted-foreground text-lg md:text-xl">
              Whether you're a brand looking for influencers or a creator seeking opportunities, 
              our platform makes collaboration effortless.
            </p>
          </ScrollReveal>
        </div>

        {/* Steps */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.15}>
          {steps.map((step, index) => (
            <StaggerItem key={index}>
              <div className="relative group h-full">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent z-0" />
                )}
                
                <div className="card-interactive p-8 h-full relative z-10 bg-white">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full gradient-hero-canva text-white text-sm font-bold flex items-center justify-center shadow-lg">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className={`${step.gradient} mb-6 text-white`}>
                    <step.icon size={28} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-display text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default HowItWorksSection;
