import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight, Users, Target, Sparkles, MessageSquare, TrendingUp, Zap, Grid3X3 } from "lucide-react";

interface AppCardProps {
  title: string;
  bgColor: string;
  visual: React.ReactNode;
  appIcon: React.ReactNode;
  appName: string;
  appDescription: string;
}

const AppCard = ({ title, bgColor, visual, appIcon, appName, appDescription }: AppCardProps) => {
  return (
    <div className="flex-shrink-0 w-[280px] md:w-[300px]">
      {/* Card Image */}
      <div className={`${bgColor} rounded-2xl h-[200px] md:h-[220px] p-6 flex items-center justify-center relative overflow-hidden group cursor-pointer`}>
        {visual}
        {/* Title Overlay */}
        <div className="absolute top-4 left-4 right-4">
          <h3 className="text-white font-semibold text-base leading-tight flex items-center gap-1">
            {title}
            <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
        </div>
      </div>
      
      {/* App Info */}
      <div className="flex items-center gap-3 mt-4 px-1">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
          {appIcon}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-gray-900 text-sm truncate">{appName}</p>
          <p className="text-gray-500 text-xs truncate">{appDescription}</p>
        </div>
      </div>
    </div>
  );
};

const apps: AppCardProps[] = [
  {
    title: "Find your perfect creator match",
    bgColor: "bg-gradient-to-br from-orange-400 to-orange-500",
    visual: (
      <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center">
        <Users size={48} className="text-white" />
      </div>
    ),
    appIcon: <Users size={20} className="text-orange-500" />,
    appName: "Smart Match",
    appDescription: "AI-powered creator matching",
  },
  {
    title: "Generate custom QR codes for campaigns",
    bgColor: "bg-gradient-to-br from-green-400 to-emerald-500",
    visual: (
      <div className="relative">
        <div className="w-28 h-28 bg-white rounded-xl p-2 grid grid-cols-5 gap-0.5">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-green-600' : 'bg-transparent'}`} />
          ))}
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full text-xs text-gray-700 shadow-md whitespace-nowrap">
          Scan to connect
        </div>
      </div>
    ),
    appIcon: <Grid3X3 size={20} className="text-green-500" />,
    appName: "Campaign QR",
    appDescription: "Custom branded QR codes",
  },
  {
    title: "Create stunning content with AI",
    bgColor: "bg-gradient-to-br from-pink-400 to-rose-500",
    visual: (
      <div className="w-32 h-40 rounded-xl bg-white/20 backdrop-blur-sm overflow-hidden flex items-center justify-center">
        <Sparkles size={48} className="text-white" />
      </div>
    ),
    appIcon: <Sparkles size={20} className="text-pink-500" />,
    appName: "Content Studio",
    appDescription: "AI-powered content creation",
  },
  {
    title: "Analyze campaign performance instantly",
    bgColor: "bg-gradient-to-br from-amber-400 to-yellow-500",
    visual: (
      <div className="w-28 h-28 rounded-xl bg-white/20 flex items-center justify-center">
        <TrendingUp size={48} className="text-white" />
      </div>
    ),
    appIcon: <TrendingUp size={20} className="text-amber-500" />,
    appName: "Analytics Pro",
    appDescription: "Real-time campaign insights",
  },
  {
    title: "Supercharge your workflow with integrations",
    bgColor: "bg-gradient-to-br from-cyan-400 to-teal-500",
    visual: (
      <div className="grid grid-cols-2 gap-2">
        <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center">
          <Zap size={24} className="text-white" />
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center">
          <Target size={24} className="text-white" />
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center">
          <MessageSquare size={24} className="text-white" />
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center">
          <Users size={24} className="text-white" />
        </div>
      </div>
    ),
    appIcon: <Grid3X3 size={20} className="text-cyan-500" />,
    appName: "Integrations Hub",
    appDescription: "Connect your favorite tools",
  },
];

const AppsSliderSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Weave AI tools into your workflow
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Power up your creative process with the best AI-powered marketing and collaboration tools from our marketplace.
          </p>
          <Button
            variant="outline"
            className="rounded-full px-8 py-3 h-auto text-base font-medium bg-white border-gray-300 hover:bg-gray-50"
          >
            Discover Apps Marketplace
          </Button>
        </div>
      </div>

      {/* Slider Container - Full width overflow */}
      <div className="relative mt-12">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-opacity ${
            canScrollLeft ? "opacity-100 hover:bg-gray-50" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>

        <button
          onClick={() => scroll("right")}
          className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-opacity ${
            canScrollRight ? "opacity-100 hover:bg-gray-50" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} className="text-gray-700" />
        </button>

        {/* Scrollable Area */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-[calc(50vw-600px)] md:px-[calc(50vw-580px)]"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Duplicate apps for infinite feel */}
          {apps.map((app, index) => (
            <AppCard key={index} {...app} />
          ))}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default AppsSliderSection;
