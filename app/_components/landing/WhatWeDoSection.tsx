import { useState } from "react";
import { Play, Settings, Type, Upload, Layers, Image, Wand2 } from "lucide-react";

type TabType = "enterprise" | "small-business" | "personal" | "educators";

const tabs: { id: TabType; label: string }[] = [
  { id: "enterprise", label: "Enterprise" },
  { id: "small-business", label: "Small business" },
  { id: "personal", label: "Personal" },
  { id: "educators", label: "Educators" },
];

interface FeaturePoint {
  title: string;
  description: string;
  linkText?: string;
}

interface TabContent {
  heading: string;
  features: FeaturePoint[];
}

const tabContent: Record<TabType, TabContent> = {
  enterprise: {
    heading: "Enterprise",
    features: [
      {
        title: "Empower every employee to communicate visually",
        description: "Turn everyone in your business into a creator. Our AI-powered tools will help your team streamline workflows and create impactful content with ease.",
      },
      {
        title: "An all-in-one design solution",
        description: "Forget onboarding and deploying multiple platforms or licences. Bring your design and AI tools together in one platform.",
      },
      {
        title: "Harness the power of AI safely",
        description: "Utilize AI confidently and efficiently. Advanced security, privacy and controls will keep you safe while you explore a new world of creative productivity.",
        linkText: "Contact sales",
      },
    ],
  },
  "small-business": {
    heading: "Small business",
    features: [
      {
        title: "Grow your brand with professional content",
        description: "Create stunning marketing materials, social posts, and presentations without hiring a design team. AI assists you every step of the way.",
      },
      {
        title: "Save time and resources",
        description: "Automate repetitive design tasks and focus on what matters most—growing your business. Our tools adapt to your workflow.",
      },
      {
        title: "Affordable AI-powered design",
        description: "Access enterprise-grade AI features at a fraction of the cost. Scale your visual communication as your business grows.",
        linkText: "Start free trial",
      },
    ],
  },
  personal: {
    heading: "Personal",
    features: [
      {
        title: "Express yourself creatively",
        description: "From social media posts to personal projects, unleash your creativity with AI-powered tools that make design accessible to everyone.",
      },
      {
        title: "No design experience needed",
        description: "Our intuitive AI understands what you want to create. Just describe your vision and watch it come to life in seconds.",
      },
      {
        title: "Create content that stands out",
        description: "Make your personal brand shine with professional-quality visuals. Perfect for influencers, freelancers, and creative individuals.",
        linkText: "Get started free",
      },
    ],
  },
  educators: {
    heading: "Educators",
    features: [
      {
        title: "Transform learning experiences",
        description: "Create engaging educational content that captures student attention. AI helps you design interactive materials in minutes, not hours.",
      },
      {
        title: "Simplify content creation",
        description: "Focus on teaching, not designing. Generate presentations, worksheets, and visual aids with simple prompts.",
      },
      {
        title: "Special pricing for education",
        description: "Access powerful AI tools with educator discounts. Empower the next generation of learners with cutting-edge visual communication.",
        linkText: "Learn about education plans",
      },
    ],
  },
};

// Visual mockup component for each tab
const EnterpriseMockup = () => (
  <div className="relative w-full max-w-lg">
    {/* Browser frame */}
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      {/* Top bar */}
      <div className="bg-[#7c3aed] px-4 py-3 flex items-center justify-between">
        <span className="text-white font-semibold text-sm">Nexly</span>
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded-full bg-pink-400" />
          <div className="w-6 h-6 rounded-full bg-yellow-400 -ml-2" />
          <div className="w-6 h-6 rounded-full bg-blue-400 -ml-2" />
        </div>
      </div>
      
      {/* Content area */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-12 bg-gray-50 border-r border-gray-200 py-4 flex flex-col items-center gap-3">
          <Settings size={18} className="text-gray-400" />
          <Layers size={18} className="text-gray-400" />
          <Type size={18} className="text-gray-400" />
          <Upload size={18} className="text-gray-400" />
          <Image size={18} className="text-gray-400" />
        </div>
        
        {/* Panel */}
        <div className="w-40 bg-white p-3 border-r border-gray-200">
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <Wand2 size={12} />
            Magic Animate
          </div>
          <p className="text-xs text-gray-600 mb-3">Recommended style</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="aspect-square rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">Aa</span>
            </div>
            <div className="aspect-square rounded-lg bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center">
              <span className="text-white text-xs font-bold">Aa</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-2">Alternative styles</p>
          <div className="grid grid-cols-3 gap-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square rounded bg-gray-100" />
            ))}
          </div>
        </div>
        
        {/* Main canvas */}
        <div className="flex-1 bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 p-4 min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 mx-auto mb-2 flex items-center justify-center">
              <span className="text-white font-bold text-lg">∞</span>
            </div>
            <h4 className="text-2xl font-bold text-gray-800">Financial</h4>
            <h4 className="text-2xl font-bold text-gray-800">report</h4>
          </div>
        </div>
      </div>
      
      {/* Bottom timeline */}
      <div className="bg-gray-50 px-4 py-2 flex items-center gap-2 border-t border-gray-200">
        <Play size={16} className="text-gray-500" />
        <div className="flex gap-1 flex-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-12 rounded bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const SmallBusinessMockup = () => (
  <div className="relative w-full max-w-lg">
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      <div className="bg-[#10b981] px-4 py-3 flex items-center justify-between">
        <span className="text-white font-semibold text-sm">Nexly</span>
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded-full bg-white/30" />
        </div>
      </div>
      <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-100 min-h-[280px] flex items-center justify-center">
        <div className="text-center">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 mb-2" />
              <p className="text-xs text-gray-600">Social Post</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-blue-500 mb-2" />
              <p className="text-xs text-gray-600">Presentation</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Choose a template</p>
        </div>
      </div>
    </div>
  </div>
);

const PersonalMockup = () => (
  <div className="relative w-full max-w-lg">
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      <div className="bg-[#f59e0b] px-4 py-3 flex items-center justify-between">
        <span className="text-white font-semibold text-sm">Nexly</span>
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded-full bg-white/30" />
        </div>
      </div>
      <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-100 min-h-[280px] flex items-center justify-center">
        <div className="grid grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-20 h-20 rounded-xl bg-white shadow-md flex items-center justify-center">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                ['from-pink-400 to-rose-500', 'from-purple-400 to-indigo-500', 'from-cyan-400 to-blue-500',
                 'from-green-400 to-emerald-500', 'from-yellow-400 to-orange-500', 'from-red-400 to-pink-500'][i]
              }`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const EducatorsMockup = () => (
  <div className="relative w-full max-w-lg">
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
      <div className="bg-[#3b82f6] px-4 py-3 flex items-center justify-between">
        <span className="text-white font-semibold text-sm">Nexly</span>
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded-full bg-white/30" />
        </div>
      </div>
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-[280px] flex items-center justify-center">
        <div className="bg-white rounded-xl p-4 shadow-lg w-full max-w-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500" />
            <span className="font-medium text-sm">Lesson Plan</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 rounded w-full" />
            <div className="h-2 bg-gray-200 rounded w-3/4" />
            <div className="h-2 bg-gray-200 rounded w-5/6" />
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-16 flex-1 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200" />
            <div className="h-16 flex-1 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const mockups: Record<TabType, React.ReactNode> = {
  enterprise: <EnterpriseMockup />,
  "small-business": <SmallBusinessMockup />,
  personal: <PersonalMockup />,
  educators: <EducatorsMockup />,
};

const WhatWeDoSection = () => {
  const [activeTab, setActiveTab] = useState<TabType>("enterprise");
  const content = tabContent[activeTab];

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-white to-[#f5f3ff]">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            What Nexly can do for you
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
            Make an impact with Nexly's AI tools for every marketing need. With our platform, you can explore even more ways to connect. From rapid content creation to on-brand scalability – the possibilities are endless.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all ${
                activeTab === tab.id
                  ? "text-gray-900 border-b-2 border-[#7c3aed]"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center max-w-6xl mx-auto">
          {/* Left - Text Content */}
          <div className="min-h-[400px]">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              {content.heading}
            </h3>
            
            <div className="space-y-6">
              {content.features.map((feature, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                    {feature.linkText && (
                      <>
                        {" "}
                        <a href="#" className="text-[#7c3aed] hover:underline">
                          {feature.linkText}
                        </a>{" "}
                        to learn more.
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Visual Mockup */}
          <div className="flex justify-center">
            {mockups[activeTab]}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
