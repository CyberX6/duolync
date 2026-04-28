import { Button } from "@/components/ui/button";
import { Users, Target, MessageSquare, TrendingUp, Sparkles, Crown } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  ctaText: string;
  bgColor: string;
  icon: React.ReactNode;
  isNew?: boolean;
  isPro?: boolean;
  size?: "large" | "small";
}

const FeatureCard = ({
  title,
  description,
  ctaText,
  bgColor,
  icon,
  isNew = true,
  isPro = false,
  size = "large",
}: FeatureCardProps) => {
  return (
    <div
      className={`rounded-3xl ${bgColor} flex flex-col h-full overflow-hidden ${
        size === "large" ? "min-h-[500px] md:min-h-[580px]" : "min-h-[450px] md:min-h-[520px]"
      }`}
    >
      {/* Image/Preview Area */}
      <div
        className={`flex items-center justify-center relative flex-1 ${
          size === "large" ? "min-h-[240px] md:min-h-[300px]" : "min-h-[200px] md:min-h-[260px]"
        }`}
      >
        <div className="text-white/80">{icon}</div>
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8 pt-0">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          {isNew && (
            <span className="text-xs font-medium bg-white/90 text-gray-800 px-3 py-1 rounded-full">
              New
            </span>
          )}
          {isPro && (
            <span className="text-xs font-medium bg-gray-900 text-white px-3 py-1 rounded-full flex items-center gap-1">
              <Crown size={12} />
              PRO
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-700 text-base leading-relaxed mb-6">
          {description}
        </p>

        {/* CTA Button */}
        <Button
          variant="outline"
          className="w-fit rounded-full px-6 py-2 h-auto text-sm font-medium bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
};

const DiscoverSection = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container">
        {/* Section Header */}
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-900 mb-16 md:mb-20">
          Discover the latest tools
        </h2>

        {/* First Row - Asymmetric Grid */}
        <div className="grid md:grid-cols-5 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Large Card - 3 columns */}
          <div className="md:col-span-3">
            <FeatureCard
              title="Smart Creator Matching"
              description="Find your perfect creator match with AI-powered recommendations. Our algorithm analyzes engagement rates, audience demographics, and content style to connect you with creators who align with your brand values."
              ctaText="Try Smart Match"
              bgColor="bg-[#d4e5f7]"
              icon={
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <Users size={64} strokeWidth={1.5} className="text-gray-700" />
                  </div>
                  <div className="absolute -top-4 -left-4 bg-[#00b4d8] text-white px-3 py-1 rounded-lg text-sm font-medium">
                    AI Match
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg flex gap-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-pink-500" />
                    <div className="w-6 h-6 rounded-full bg-[#d4e5f7]" />
                    <div className="w-6 h-6 rounded-full bg-rose-500" />
                    <div className="w-6 h-6 rounded-full bg-orange-300" />
                  </div>
                </div>
              }
              size="large"
            />
          </div>

          {/* Small Card - 2 columns */}
          <div className="md:col-span-2">
            <FeatureCard
              title="Campaign Analytics"
              description="Track performance in real-time. Monitor engagement, reach, and ROI with comprehensive dashboards."
              ctaText="Try Analytics"
              bgColor="bg-[#fcd34d]"
              icon={
                <div className="relative">
                  <div className="w-28 h-36 rounded-xl bg-gradient-to-b from-amber-600/80 to-amber-700/80 flex items-center justify-center shadow-xl">
                    <TrendingUp size={48} strokeWidth={1.5} className="text-white" />
                  </div>
                  <Sparkles
                    size={24}
                    className="absolute -top-2 -right-2 text-white"
                    strokeWidth={2}
                  />
                  <Sparkles
                    size={20}
                    className="absolute top-4 -left-6 text-white"
                    strokeWidth={2}
                  />
                </div>
              }
              size="small"
            />
          </div>
        </div>

        {/* Second Row - Asymmetric Grid (reversed) */}
        <div className="grid md:grid-cols-5 gap-6 md:gap-8">
          {/* Small Card - 2 columns */}
          <div className="md:col-span-2">
            <FeatureCard
              title="Direct Messaging"
              description="Connect instantly with creators. Negotiate deals, share briefs, and manage collaborations all in one place."
              ctaText="Try Messaging"
              bgColor="bg-[#86efac]"
              icon={
                <div className="relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-6xl font-bold text-white/30">
                    Aa
                  </div>
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-lg">
                    <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                      <MessageSquare size={32} className="text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 right-0 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
                    <Crown size={16} className="text-amber-800" />
                  </div>
                </div>
              }
              size="small"
              isPro
            />
          </div>

          {/* Large Card - 3 columns */}
          <div className="md:col-span-3">
            <FeatureCard
              title="Brand Discovery"
              description="Get discovered by top brands looking for creators like you. Showcase your portfolio, highlight your best content, and let brands come to you. Our platform makes it easy to stand out and land dream collaborations."
              ctaText="Try Brand Discovery"
              bgColor="bg-[#f5d0fe]"
              icon={
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-40 h-28 rounded-xl bg-gradient-to-br from-fuchsia-500/80 to-purple-600/80 overflow-hidden shadow-xl">
                    <div className="w-full h-full flex items-center justify-center">
                      <Target size={48} strokeWidth={1.5} className="text-white" />
                    </div>
                  </div>
                  <div className="absolute top-1/4 right-1/4 bg-white rounded-xl p-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400" />
                      <div>
                        <p className="text-xs text-gray-600">Match your brand with</p>
                        <p className="text-sm font-medium text-gray-900">perfect creators</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="mt-2 w-full text-xs bg-transparent border border-purple-400 text-purple-600 hover:bg-purple-50 rounded-full"
                    >
                      <Sparkles size={12} className="mr-1" />
                      Find creators
                    </Button>
                  </div>
                </div>
              }
              size="large"
              isPro
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverSection;
