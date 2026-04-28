import { motion } from "framer-motion";
import { Search, Instagram, Youtube, Twitter } from "lucide-react";
import Link from "next/link";

const InfluencerSearchSection = () => {
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
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Search size={16} />
              Influencer Search 💡
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Stop scrolling to find creators!
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Find the best creators for your campaign with Nexly. Use advanced filters to 
              pinpoint perfect matches for your campaigns and supercharge your results in no time.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-xl">🧑‍💻</span>
                <div>
                  <p className="font-semibold text-foreground">Million creators you can actually reach out to</p>
                  <p className="text-sm text-muted-foreground">On all major social platforms</p>
                </div>
              </div>
              
              {/* Platform Icons */}
              <div className="flex items-center gap-3 pl-9">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <Instagram size={16} className="text-white" />
                </div>
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                  <Youtube size={16} className="text-white" />
                </div>
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </div>
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center">
                  <Twitter size={16} className="text-white" />
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.58-3.57h2.85L20.57 12V2m-1.43 9.29l-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.07V3.43h12.07z"/>
                  </svg>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">🖍️</span>
                <p className="font-semibold text-foreground">For every industry, hashtag or keyword</p>
              </div>
            </div>

            {/* CTA Link */}
            <Link 
              href="/auth" 
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group"
            >
              What our Search feature can do
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

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-primary/5 to-accent/10 rounded-3xl p-8 overflow-hidden">
              {/* Mock Search Interface */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                {/* Search Bar */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 mb-6">
                  <Search size={20} className="text-gray-400" />
                  <span className="text-gray-500">Search creators by niche, location...</span>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1.5 bg-primary text-white text-sm rounded-full">Keyword ×</span>
                  <span className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-full"># Hashtag ×</span>
                  <span className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded-full">@ Username ×</span>
                </div>

                {/* Creator Cards */}
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30" />
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
                        <div className="h-2 bg-gray-100 rounded w-16" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-primary">{90 + i}%</div>
                        <div className="text-xs text-gray-400">Match</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg px-4 py-3">
                <div className="text-2xl font-bold text-primary">6.5M</div>
                <div className="text-xs text-gray-500">Creators</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InfluencerSearchSection;
