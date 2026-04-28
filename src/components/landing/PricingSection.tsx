import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check, Crown, User, Users, Building2 } from "lucide-react";

const pricingPlans = [
  {
    id: "free",
    userType: "Creators",
    userIcon: User,
    name: "Free",
    description: "Start connecting with brands and grow your influence. No cost, just opportunities.",
    price: 0,
    period: "/year for one person",
    cta: "Get started",
    ctaVariant: "default" as const,
    featured: false,
    introLabel: null,
    features: [
      "Basic creator profile",
      "Up to 3 social account connections",
      "Browse brand opportunities",
      "Basic analytics dashboard",
      "Community access",
      "Email support",
    ],
  },
  {
    id: "pro",
    userType: "Creators",
    userIcon: User,
    name: "Pro",
    description: "Unlock premium features, get discovered faster, and land more collaborations.",
    price: 99,
    period: "/year for one person",
    cta: "Start a free trial",
    ctaVariant: "default" as const,
    featured: false,
    introLabel: null,
    showCrown: true,
    features: [
      "Verified creator badge",
      "Unlimited social connections",
      "Priority in brand searches",
      "Advanced analytics & insights",
      "Direct messaging with brands",
      "Media kit generator",
      "Collaboration management tools",
    ],
  },
  {
    id: "business",
    userType: "Brands & Teams",
    userIcon: Users,
    name: "Business",
    description: "Find the perfect creators, manage campaigns, and measure ROI with powerful tools.",
    price: 299,
    period: "/year per person",
    cta: "Start a free trial",
    ctaVariant: "default" as const,
    secondaryCta: "Contact Sales",
    featured: true,
    introLabel: "Most popular",
    showCrown: true,
    features: [
      "Advanced creator discovery",
      "AI-powered matching",
      "Campaign management suite",
      "Team collaboration (up to 5)",
      "Performance analytics",
      "Contract templates",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    userType: "Organizations",
    userIcon: Building2,
    name: "Enterprise",
    description: "Scale your influencer marketing with enterprise-grade security and custom solutions.",
    price: null,
    priceText: "Let's talk",
    period: "Get in touch to learn more",
    cta: "Contact Sales",
    ctaVariant: "default" as const,
    secondaryCta: "Book a demo",
    featured: false,
    introLabel: null,
    showCrown: true,
    features: [
      "Unlimited team members",
      "Custom integrations & API",
      "Dedicated success manager",
      "SSO and advanced security",
      "Custom reporting",
      "White-label options",
      "SLA guarantees",
    ],
  },
];

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(true);

  const getPrice = (basePrice: number | null) => {
    if (basePrice === null) return null;
    return isYearly ? basePrice : Math.round(basePrice / 10);
  };

  return (
    <section className="py-20 md:py-28 bg-[#faf9f7]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Plans & pricing
          </h2>
          <p className="text-gray-600 text-lg">
            A plan for everyone - from creators to{" "}
            <span className="text-purple-600 hover:underline cursor-pointer">
              enterprise
            </span>
            .
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm font-medium ${!isYearly ? "text-gray-900" : "text-gray-500"}`}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-purple-600"
          />
          <span className={`text-sm font-medium ${isYearly ? "text-gray-900" : "text-gray-500"}`}>
            Yearly
          </span>
          {isYearly && (
            <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              Save from 16%
            </span>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => {
            const UserIcon = plan.userIcon;
            const displayPrice = getPrice(plan.price);
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl p-6 border-2 transition-shadow hover:shadow-lg ${
                  plan.featured 
                    ? "border-purple-500 shadow-lg" 
                    : "border-gray-200"
                }`}
              >
                {/* Intro Label */}
                {plan.introLabel && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                      {plan.introLabel}
                    </span>
                  </div>
                )}

                {/* User Type */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <UserIcon size={14} />
                    <span>{plan.userType}</span>
                  </div>
                  {plan.showCrown && (
                    <Crown className="w-5 h-5 text-amber-500" />
                  )}
                </div>

                {/* Plan Name */}
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 min-h-[60px]">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  {displayPrice !== null ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-gray-600">US$</span>
                        <span className="font-display text-4xl font-bold text-gray-900">
                          {displayPrice}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">{plan.period}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-display text-3xl font-bold text-gray-900">
                        {plan.priceText}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">{plan.period}</p>
                    </>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 mb-8">
                  <Button
                    className={`w-full rounded-full h-11 font-medium ${
                      plan.featured
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                  {plan.secondaryCta && (
                    <Button
                      variant="outline"
                      className="w-full rounded-full h-11 font-medium border-gray-300"
                    >
                      {plan.secondaryCta}
                    </Button>
                  )}
                </div>

                {/* Features */}
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-4">
                    With {plan.name}, get:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
