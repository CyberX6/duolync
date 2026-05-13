import { motion } from "framer-motion";
import Link from "next/link";
import { Chrome, ShieldCheck, BarChart3, BookOpen, FileText, Newspaper } from "lucide-react";

const tools = [
  {
    icon: ShieldCheck,
    title: "Fake Follower Checker",
    description: "Verify if an influencer has authentic followers or fake bots.",
    color: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    icon: BarChart3,
    title: "Engagement Calculator",
    description: "Calculate true engagement rates across any social platform.",
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Chrome,
    title: "Chrome Extension",
    description: "Find creators directly while browsing social media.",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
];

const resources = [
  {
    icon: BookOpen,
    title: "Usage Guides",
    description: "Level up your influencer marketing knowledge.",
  },
  {
    icon: Newspaper,
    title: "Blog",
    description: "Stay informed with insightful articles.",
  },
  {
    icon: FileText,
    title: "FAQ",
    description: "Get answers to common questions.",
  },
];

const FreeToolsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            More resources to explore 🔎
          </h2>
          <Link 
            href="/auth" 
            className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
          >
            Read all
            <svg 
              className="w-4 h-4 transition-transform group-hover:translate-x-1" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Free Tools */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-primary/5 to-accent/10 rounded-3xl p-8">
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                Free resources 📖
              </h3>
              <p className="text-lg font-medium text-foreground mb-2">
                Your complete guide to influencer marketing
              </p>
              <p className="text-muted-foreground mb-8">
                Unlock the power of influencer marketing with Duolync's free resources. 
                Gain insights, tips, and strategies to effectively harness the potential 
                of influencers for your business success.
              </p>

              {/* Free Tools Grid */}
              <div className="space-y-4">
                {tools.map((tool, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
                  >
                    <div className={`${tool.color} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}>
                      <tool.icon size={24} className={tool.iconColor} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{tool.title}</h4>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                    <Link 
                      href="/auth" 
                      className="text-primary hover:text-primary/80 shrink-0"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Resources */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {resources.map((resource, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <resource.icon size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{resource.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                    <Link 
                      href="/auth" 
                      className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all"
                    >
                      See more
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Download Extension CTA */}
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Chrome size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Free Chrome Extension</h4>
                  <p className="text-sm text-white/80">Find creators while browsing social media</p>
                </div>
                <Link 
                  href="/auth" 
                  className="px-4 py-2 bg-white text-primary rounded-lg font-medium text-sm hover:bg-white/90 transition-colors shrink-0"
                >
                  Download
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FreeToolsSection;
