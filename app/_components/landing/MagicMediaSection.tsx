import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Mic, Cloud } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  ctaText: string;
  bgColor: string;
  visual: React.ReactNode;
  isPro?: boolean;
  isBeta?: boolean;
  showLearnMore?: boolean;
}

const FeatureCard = ({
  title,
  description,
  ctaText,
  bgColor,
  visual,
  isPro = true,
  isBeta = false,
  showLearnMore = true,
}: FeatureCardProps) => {
  return (
    <div className={`flex flex-col h-full rounded-3xl overflow-hidden ${bgColor} min-h-[580px] md:min-h-[640px]`}>
      {/* Visual Area */}
      <div className="p-6 md:p-8 min-h-[280px] md:min-h-[320px] flex items-center justify-center relative flex-1">
        {visual}
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8 pt-0">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          {isPro && (
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-gray-900 text-white px-3 py-1 rounded-full">
              <Crown size={12} />
              PRO
            </span>
          )}
          {isBeta && (
            <span className="text-xs font-medium bg-white/80 text-gray-700 px-3 py-1 rounded-full">
              BETA
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

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="rounded-full px-6 py-2 h-auto text-sm font-medium bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            {ctaText}
          </Button>
          {showLearnMore && (
            <button className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Learn more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Text to Video Visual
const TextToVideoVisual = () => (
  <div className="relative w-full flex items-center justify-center">
    {/* Text Input */}
    <div className="bg-white rounded-xl px-4 py-3 shadow-lg max-w-[200px]">
      <p className="text-gray-700">A vibrant city j<span className="animate-pulse">|</span></p>
    </div>
    {/* Cursor Label */}
    <div className="absolute -bottom-8 right-1/4 bg-[#00b4d8] text-white px-3 py-1 rounded-lg text-sm font-medium">
      Charlie
    </div>
    {/* Pause Button */}
    <button className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-gray-900/50 flex items-center justify-center text-white">
      <div className="flex gap-1">
        <div className="w-1 h-4 bg-white rounded-full" />
        <div className="w-1 h-4 bg-white rounded-full" />
      </div>
    </button>
  </div>
);

// Text to Image Visual
const TextToImageVisual = () => (
  <div className="relative flex flex-col items-center">
    {/* 3D Sphere with VR elements */}
    <div className="relative">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 shadow-xl" />
      {/* VR Headset shapes */}
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-12 bg-indigo-600 rounded-lg transform -rotate-12 shadow-lg" />
      <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-12 bg-indigo-600 rounded-lg transform rotate-12 shadow-lg" />
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-10 bg-indigo-700 rounded-lg shadow-lg" />
    </div>
    {/* Text Input */}
    <div className="mt-6 bg-white rounded-xl px-4 py-2 shadow-lg">
      <p className="text-gray-700 text-sm">Surreal outer space<span className="animate-pulse">|</span></p>
    </div>
  </div>
);

// Text to Graphic Visual
const TextToGraphicVisual = () => (
  <div className="w-full max-w-[280px]">
    {/* Prompt Input Card */}
    <div className="bg-white rounded-xl p-4 shadow-lg mb-4">
      <p className="text-sm text-gray-500 mb-2">Describe what you'd like to create</p>
      <div className="border border-gray-200 rounded-lg p-3">
        <p className="text-gray-700 text-sm">A duck in a pond<span className="animate-pulse">|</span></p>
        <div className="flex gap-2 mt-2">
          <Mic size={16} className="text-gray-400" />
          <Cloud size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
    {/* Style Selection */}
    <div className="bg-white rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-gray-600" />
        <p className="text-sm font-medium text-gray-700">Style</p>
      </div>
      <div className="flex gap-2">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-2xl">
          🦆
        </div>
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-300 to-emerald-400 flex items-center justify-center text-2xl">
          🦆
        </div>
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-300 to-cyan-400 flex items-center justify-center text-2xl">
          🦆
        </div>
      </div>
    </div>
  </div>
);

const MagicMediaSection = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-20">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Turn ideas into images and videos{" "}
            <br className="hidden md:block" />
            with <span className="text-[#7c3aed]">Creator Studio™</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            Dream it up, then add it to your campaign. Watch your words transform into 
            beautiful images and videos with Creator Studio. You'll stand out with visual 
            content that perfectly fits your brand.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Text to Video */}
          <FeatureCard
            title="Text to Video"
            description="Visualize your video and turn it into reality. Describe what you're after and watch Creator Studio generate short videos that suit your campaign."
            ctaText="Try Creator Studio"
            bgColor="bg-[#f3e8ff]"
            visual={<TextToVideoVisual />}
            isPro
            isBeta
          />

          {/* Text to Image */}
          <FeatureCard
            title="Text to Image"
            description="Turn any idea into an image. Write a text prompt and watch as Creator Studio generates an image that fits your design."
            ctaText="Try Creator Studio"
            bgColor="bg-[#fce7f3]"
            visual={<TextToImageVisual />}
            isPro
          />

          {/* Text to Graphic */}
          <FeatureCard
            title="Text to Graphic"
            description="Describe your vision to Creator Studio, and it'll generate unique graphics, icons, stickers, and illustrations."
            ctaText="Try Creator Studio"
            bgColor="bg-gradient-to-br from-[#fce7f3] to-[#fecaca]"
            visual={<TextToGraphicVisual />}
            isPro
            showLearnMore={false}
          />
        </div>
      </div>
    </section>
  );
};

export default MagicMediaSection;
