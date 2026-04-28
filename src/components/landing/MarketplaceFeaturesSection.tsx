import { Search, BarChart3, ShieldCheck, MessageSquare } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Cross-Platform Discovery",
    description:
      "Find creators on Instagram, TikTok, and YouTube using advanced filters for niche and audience demographics.",
    gradient: "from-primary to-purple-600",
    iconBg: "feature-icon-purple",
  },
  {
    icon: BarChart3,
    title: "Verified Audience Analytics",
    description:
      "No more fake followers. Access real-time, vetted data on engagement and audience authenticity before you book.",
    gradient: "from-cyan-500 to-teal-500",
    iconBg: "feature-icon-cyan",
  },
  {
    icon: ShieldCheck,
    title: "Secure Escrow Payments",
    description:
      "Your budget is safe. Funds are held securely and only released when the approved content is live.",
    gradient: "from-emerald-500 to-green-600",
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
  },
  {
    icon: MessageSquare,
    title: "Direct Outreach & CRM",
    description:
      "Negotiate terms, send briefs, and manage relationships directly through our built-in messaging system.",
    gradient: "from-primary to-accent",
    iconBg: "feature-icon-magenta",
  },
];

const MarketplaceFeaturesSection = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Platform Features
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Everything you need to succeed
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Our marketplace provides all the tools brands and creators need to build 
            successful, transparent partnerships.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-3xl border border-border/50 bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.iconBg}`}
              >
                <feature.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 pt-16 border-t border-border/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { value: "50K+", label: "Verified Creators" },
              { value: "10K+", label: "Active Brands" },
              { value: "$2M+", label: "Secure Payments" },
              { value: "98%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceFeaturesSection;
