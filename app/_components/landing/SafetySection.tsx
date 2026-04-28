import { Button } from "@/components/ui/button";

const SafetySection = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Advanced AI safety with Nexly Shield
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            AI trust and safety, built with enterprises in mind.
          </p>
          <Button
            variant="outline"
            className="rounded-full px-8 py-3 h-auto text-base font-medium bg-white border-gray-300 hover:bg-gray-50"
          >
            Contact sales
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Card 1 - Lavender */}
          <div className="bg-[#e8e0f0] rounded-3xl p-8 md:p-10 min-h-[220px]">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Scaled AI controls and protection
            </h3>
            <p className="text-gray-700 text-base leading-relaxed">
              Manage your team's access to AI-powered features with administrator controls.{" "}
              <a href="#" className="text-[#7c3aed] hover:underline">
                Nexly Shield's
              </a>{" "}
              advanced privacy and security tools, plus indemnification for enterprise accounts with over 100 seats at no extra cost, will keep your business safe.
            </p>
          </div>

          {/* Card 2 - Mint/Teal */}
          <div className="bg-[#a7f3d0] rounded-3xl p-8 md:p-10 min-h-[220px]">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Privacy Controls
            </h3>
            <p className="text-gray-700 text-base leading-relaxed">
              Nexly doesn't use user content to improve AI-powered features unless that is consistent with the user's Privacy Controls. This setting is disabled for Enterprise users and cannot be turned on.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetySection;
