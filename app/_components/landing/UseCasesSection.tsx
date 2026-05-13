import { motion } from "framer-motion";
import Link from "next/link";
import { Building2, Sparkles, Rocket } from "lucide-react";

const useCases = [
  {
    icon: Building2,
    title: "Influencer Marketing Agency Founder",
    description:
      "They need an affordable, scalable influencer marketing tool. Duolync offers cost-effectiveness and helps them deliver outstanding client results without overstretching their budget.",
    color: "bg-purple-100",
    iconColor: "text-purple-600",
    image: "bg-gradient-to-br from-purple-400 to-purple-600",
  },
  {
    icon: Sparkles,
    title: "Creative Brand Owner",
    description:
      "They need time-saving influencer marketing solutions. Duolync streamlines their discovery and outreach processes, enhancing their efficiency and campaign results.",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
    image: "bg-gradient-to-br from-blue-400 to-cyan-500",
  },
  {
    icon: Rocket,
    title: "Brand New Startup Entrepreneur",
    description:
      "This solopreneur seeks a low-risk influencer marketing software. Duolync offers them a free trial, providing a transparent path to amplify their personal business growth.",
    color: "bg-orange-100",
    iconColor: "text-orange-600",
    image: "bg-gradient-to-br from-orange-400 to-pink-500",
  },
];

const UseCasesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Duolync use cases <span className="inline-block">✨</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Duolync empowers users to overcome challenges, maximize ROI, and
            achieve their influencer marketing objectives.
          </p>
        </motion.div>

        {/* Use Case Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                {/* Image/Icon Area */}
                <div
                  className={`${useCase.image} h-48 flex items-center justify-center relative`}
                >
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <useCase.icon size={48} className="text-white" />
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full" />
                  <div className="absolute bottom-6 right-6 w-12 h-12 bg-white/10 rounded-xl" />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-display text-xl font-bold text-foreground mb-3">
                    {useCase.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {useCase.description}
                  </p>

                  {/* CTA Link */}
                  <Link
                    href="/auth"
                    className="inline-flex items-center gap-2 text-primary font-semibold mt-4 hover:gap-3 transition-all group/link text-sm"
                  >
                    Discover Use Case
                    <svg
                      className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
