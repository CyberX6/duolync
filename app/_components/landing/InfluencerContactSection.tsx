import { motion } from "framer-motion";
import { Mail, Clock, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const InfluencerContactSection = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative bg-gradient-to-br from-accent/5 to-primary/10 rounded-3xl p-8 overflow-hidden">
              {/* Mock Email Interface */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                {/* Email Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Mail size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">
                      New Collaboration Invite
                    </div>
                    <div className="text-sm text-muted-foreground">
                      from: brand@company.com
                    </div>
                  </div>
                </div>

                {/* Campaign Brief Card */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=128&h=128&fit=crop&auto=format"
                      alt="Campaign product"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Campaign Brief
                    </div>
                    <div className="font-bold text-foreground text-sm leading-tight">
                      Summer Kick-off &apos;26
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      1x Instagram Reel, 2x Stories
                    </div>
                  </div>
                </div>

                {/* Quick Response Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 py-2 px-4 bg-primary text-white rounded-lg text-sm font-medium">
                    Accept
                  </button>
                  <button className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                    View Profile
                  </button>
                </div>
              </div>

              {/* Floating Elements */}
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 bg-purple-500 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Mail size={16} />
              Influencer Contact
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              One-click hellos, no more hurdles
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Forge connections with creators through personalized emails,
              enabled by a simple one-click contact directly from the search
              results.
            </p>

            {/* Features */}
            <div className="space-y-5 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Connect with influencers instantly
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Save valuable time and effort
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Zap size={20} className="text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Speed up your creator outreach
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Fast-track your campaigns
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Link */}
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
            >
              Learn more about direct contact
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
        </div>
      </div>
    </section>
  );
};

export default InfluencerContactSection;
