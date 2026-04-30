import { motion } from "framer-motion";
import { FileText, Users, Rocket, BarChart3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const campaigns = [
  {
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
    title: "Tech Unboxing Series w/ @TechGuruLiam",
    subtitle: "5 creators active | Engagement: 6.2%",
    status: "In Progress",
    statusClass: "bg-yellow-100 text-yellow-700",
  },
  {
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&auto=format",
    title: "Spring Collection | Lifestyle Campaign w/ 8 creators",
    subtitle: "Review Pending | Content Quality Check",
    status: "Review",
    statusClass: "bg-blue-100 text-blue-700",
  },
  {
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format",
    title: "Videography Contest Finale | 11 creators",
    subtitle: "participating | Reach: 850K | Best Entry Announced",
    status: "Completed",
    statusClass: "bg-green-100 text-green-700",
  },
];

const InfluencerCRMSection = () => {
  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileText size={16} />
              Influencer Relationship Management
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              It's time to ditch the spreadsheet!
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Enhance your productivity with our in-app campaign management and
              tracking, allowing data-driven insights to lead your influencer
              marketing strategy.
            </p>

            {/* Features */}
            <div className="space-y-5 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                  <Users size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Use our built-in CRM to manage your community
                  </p>
                  <p className="text-sm text-muted-foreground">
                    All your creators in one place
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Keep track of your partnerships and past campaigns
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Full history at your fingertips
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <Rocket size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Use the time you saved to scale up!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Focus on growth, not admin
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Link */}
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
            >
              Read all about the CRM
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 overflow-hidden">
              {/* Mock CRM Dashboard */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-foreground">
                    Campaign Dashboard
                  </h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Active
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      3 Campaigns
                    </span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-primary/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-primary">24</div>
                    <div className="text-xs text-muted-foreground">
                      Creators
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      $45K
                    </div>
                    <div className="text-xs text-muted-foreground">Budget</div>
                  </div>
                  <div className="bg-accent/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-accent">2.8M</div>
                    <div className="text-xs text-muted-foreground">Reach</div>
                  </div>
                </div>

                {/* Creator List */}
                <div className="space-y-3">
                  {campaigns.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={c.avatar}
                          alt={c.title}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground leading-tight truncate">
                          {c.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 truncate">
                          {c.subtitle}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full shrink-0 ${c.statusClass}`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Chart */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4">
                <BarChart3 size={32} className="text-primary" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InfluencerCRMSection;
