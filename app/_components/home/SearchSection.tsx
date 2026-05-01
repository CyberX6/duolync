"use client";

import { useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Search, CheckCircle2, ArrowRight, Instagram, Youtube, Twitter, Sparkles } from "lucide-react";

const fadeUp: Variants = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const PURPLE = "#a78bfa";
const CYAN = "#67e8f9";

const creators = [
  { name: "Liam S.", handle: "@TheTechLiam", niche: "Tech", followers: "55K", match: 91, color: "from-blue-500 to-cyan-500" },
  { name: "Aisha K.", handle: "@StyleAisha", niche: "Fashion", followers: "120K", match: 93, color: "from-pink-500 to-rose-600" },
  { name: "Marcus V.", handle: "@UrbanMotion", niche: "Video", followers: "88K", match: 89, color: "from-amber-500 to-orange-500" },
];

const platforms = [
  { name: "Instagram", color: "#e1306c", bg: "rgba(225,48,108,0.15)" },
  { name: "YouTube", color: "#ff0000", bg: "rgba(255,0,0,0.12)" },
  { name: "TikTok", color: "#f472b6", bg: "rgba(244,114,182,0.15)" },
  { name: "Twitter", color: "#1da1f2", bg: "rgba(29,161,242,0.15)" },
  { name: "Twitch", color: "#9146ff", bg: "rgba(145,70,255,0.15)" },
];

export function SearchSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? creators.filter((c) => [c.name, c.handle, c.niche].join(" ").toLowerCase().includes(query.toLowerCase()))
    : creators;

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "#09090f" }}>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 70%)" }} />

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left: content */}
          <div>
            <motion.div variants={fadeUp} transition={{ duration: 0.65 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.35)", color: PURPLE }}>
              <Search size={11} />
              AI Influencer Search
            </motion.div>
            <motion.h2 variants={fadeUp} transition={{ duration: 0.65 }} className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-5">
              Stop scrolling.{" "}
              <span style={{ background: `linear-gradient(90deg, ${PURPLE}, ${CYAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Start finding.
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} transition={{ duration: 0.65 }} className="text-slate-400 text-lg leading-relaxed mb-8">
              Find the perfect creators for your campaign with AI-powered search. Filter by niche, engagement rate, location, platform, and audience demographics — in seconds.
            </motion.p>

            {/* Platforms */}
            <motion.div variants={fadeUp} transition={{ duration: 0.65 }} className="flex flex-wrap gap-2 mb-8">
              {platforms.map((p) => (
                <div key={p.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium" style={{ background: p.bg, color: p.color, border: `1px solid ${p.color}25` }}>
                  {p.name}
                </div>
              ))}
            </motion.div>

            <motion.ul variants={stagger} className="space-y-4 mb-8">
              {[
                { text: "10M+ verified creator profiles across all major platforms" },
                { text: "Filter by niche, hashtag, keyword, location, and audience size" },
                { text: "AI-ranked results by brand-fit score and predicted conversion rate" },
                { text: "Fake follower detection built in — only real audiences" },
              ].map((item, i) => (
                <motion.li key={i} variants={fadeUp} transition={{ duration: 0.5 }} className="flex items-start gap-3">
                  <CheckCircle2 size={16} style={{ color: PURPLE }} className="shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{item.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.a
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              href="/for-brands"
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02]"
              style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)", color: PURPLE }}
            >
              Explore search features
              <ArrowRight size={15} />
            </motion.a>
          </div>

          {/* Right: interactive mockup */}
          <motion.div variants={fadeUp} transition={{ duration: 0.65 }}>
            <div className="rounded-3xl overflow-hidden" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {/* Search bar */}
              <div className="p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Search size={15} className="text-slate-600 shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by niche, hashtag, location..."
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
                  />
                  <span className="text-[10px] px-2 py-0.5 rounded font-medium shrink-0" style={{ background: `${PURPLE}25`, color: PURPLE }}>AI</span>
                </div>
                {/* Filter chips */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  {["Keyword ×", "# Hashtag ×", "@ Username ×"].map((chip, i) => (
                    <span key={chip} className="px-2.5 py-1 rounded-full text-[10px] font-medium text-white" style={{ background: i === 0 ? "rgba(124,58,237,0.4)" : i === 1 ? "rgba(52,211,153,0.4)" : "rgba(251,146,60,0.4)" }}>
                      {chip}
                    </span>
                  ))}
                  <span className="ml-auto text-[10px] text-slate-600">{filtered.length} results</span>
                </div>
              </div>

              {/* Results */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Sparkles size={10} style={{ color: PURPLE }} />
                    AI-ranked by brand fit
                  </div>
                  <div className="text-[10px] font-bold" style={{ background: `linear-gradient(90deg, ${PURPLE}, ${CYAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>6.5M creators</div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {(filtered.length ? filtered : creators).map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="rounded-2xl overflow-hidden transition-all hover:scale-[1.03] cursor-pointer"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <div className={`h-20 w-full bg-gradient-to-br ${c.color} relative`}>
                        <div className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "rgba(0,0,0,0.5)" }}>
                          {c.match}% ✓
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="text-[11px] font-bold text-white leading-tight">{c.name}</div>
                        <div className="text-[9px] text-slate-500">{c.handle}</div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[9px]" style={{ color: PURPLE }}>{c.niche}</span>
                          <span className="text-[9px] text-slate-600">{c.followers}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Platform row */}
                <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[10px] text-slate-600">Platforms</div>
                  <div className="flex gap-2">
                    {[
                      { Icon: Instagram, color: "#e1306c" },
                      { Icon: Youtube, color: "#ff0000" },
                      { Icon: Twitter, color: "#1da1f2" },
                    ].map(({ Icon, color }, i) => (
                      <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `${color}20` }}>
                        <Icon size={12} style={{ color }} />
                      </div>
                    ))}
                    <div className="text-[10px] text-slate-600 self-center">+2 more</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
