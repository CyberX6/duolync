import { DollarSign, TrendingUp, Globe, Briefcase } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { ParallaxElement } from "@/components/animations/ParallaxSection";

const features = [
  {
    icon: Briefcase,
    title: "Brand Partnerships",
    description: "Connect with brands actively seeking creators in your niche and audience size.",
    gradient: "feature-icon-purple",
  },
  {
    icon: DollarSign,
    title: "Fair Compensation",
    description: "Get paid what you're worth with transparent pricing and secure payments.",
    gradient: "feature-icon-cyan",
  },
  {
    icon: TrendingUp,
    title: "Growth Tools",
    description: "Access analytics and insights to understand and grow your audience.",
    gradient: "feature-icon-orange",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Work with international brands and expand your influence worldwide.",
    gradient: "feature-icon-magenta",
  },
];

const ForCreatorsSection = () => {
  return (
    <section id="for-creators" className="py-24 md:py-32 section-gradient relative overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <ScrollReveal direction="left" className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-square bg-gradient-to-br from-accent/5 to-primary/5 p-8">
                {/* Creator Profile Mock */}
                <ParallaxElement speed={0.2} direction="up">
                  <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-[1.02] transition-transform">
                    <div className="w-20 h-20 rounded-full gradient-hero-canva mx-auto mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-24 mx-auto mb-6" />
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div>
                        <div className="text-xl font-bold gradient-text">2.5M</div>
                        <div className="text-xs text-muted-foreground">Followers</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold gradient-text">4.8%</div>
                        <div className="text-xs text-muted-foreground">Engagement</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold gradient-text">156</div>
                        <div className="text-xs text-muted-foreground">Campaigns</div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-center flex-wrap">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">Fashion</span>
                      <span className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">Lifestyle</span>
                      <span className="px-3 py-1 bg-cyan-100 text-cyan-600 text-xs rounded-full">Travel</span>
                    </div>
                  </div>
                </ParallaxElement>

                {/* Earnings Card */}
                <ParallaxElement speed={0.4} direction="down" className="absolute bottom-12 right-4">
                  <div className="bg-white rounded-xl shadow-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">+$2,500</div>
                        <div className="text-xs text-muted-foreground">This month</div>
                      </div>
                    </div>
                  </div>
                </ParallaxElement>
              </div>
            </div>

            {/* Floating element */}
            <ParallaxElement speed={0.5} direction="up" className="absolute -bottom-4 -left-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-primary shadow-xl flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
            </ParallaxElement>
          </ScrollReveal>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <ScrollReveal delay={0}>
              <span className="badge-new mb-6 inline-block">For Creators</span>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Monetize Your{" "}
                <span className="gradient-text">Influence</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                Turn your passion into profit. Connect with brands that value your 
                authentic voice and pay you fairly for your creative work.
              </p>
            </ScrollReveal>

            <StaggerContainer className="grid sm:grid-cols-2 gap-6" staggerDelay={0.1}>
              {features.map((feature, index) => (
                <StaggerItem key={index}>
                  <div className="flex gap-4">
                    <div className={`${feature.gradient} shrink-0 text-white`}>
                      <feature.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForCreatorsSection;
