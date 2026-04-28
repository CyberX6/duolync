import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";

const platforms = [
  { name: "TikTok", icon: "📱", color: "from-[#00F2EA] to-[#FF0050]" },
  { name: "YouTube", icon: "▶️", color: "from-[#FF0000] to-[#CC0000]" },
  { name: "Instagram", icon: "📷", color: "from-[#833AB4] to-[#FD1D1D]" },
  { name: "Twitter", icon: "🐦", color: "from-[#1DA1F2] to-[#0C85D0]" },
  { name: "Twitch", icon: "🎮", color: "from-[#9146FF] to-[#6441A5]" },
  { name: "LinkedIn", icon: "💼", color: "from-[#0077B5] to-[#00669C]" },
];

const PlatformsSection = () => {
  return (
    <section className="py-20 bg-white border-b border-border/30 relative overflow-hidden">
      <div className="container">
        <ScrollReveal>
          <p className="text-center text-muted-foreground mb-10 font-medium text-lg">
            Trusted by creators from all major platforms
          </p>
        </ScrollReveal>
        <StaggerContainer className="flex flex-wrap items-center justify-center gap-4 md:gap-6" staggerDelay={0.08}>
          {platforms.map((platform) => (
            <StaggerItem key={platform.name}>
              <div
                className="group relative px-6 py-3 rounded-full bg-secondary/50 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${platform.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="flex items-center gap-3 relative">
                  <span className="text-2xl">{platform.icon}</span>
                  <span className="font-medium text-foreground">{platform.name}</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default PlatformsSection;
