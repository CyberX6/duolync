"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Globe, Bookmark, CheckCircle2, ArrowRight, Star, Users, TrendingUp, Plus, Zap } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const savedCreators = [
  { name: "@nova.beauty", platform: "TikTok", followers: "1.8M", niche: "Beauty", color: "from-pink-500 to-rose-600" },
  { name: "@style.world", platform: "Instagram", followers: "2.1M", niche: "Fashion", color: "from-violet-500 to-purple-600" },
];

export function ChromeExtensionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "var(--bg-page)" }}>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)" }} />

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
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.35)", color: "#fcd34d" }}>
              <Globe size={11} />
              Chrome Extension — The Scout
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-5">
              Discover creators{" "}
              <span style={{ background: "linear-gradient(90deg, #fcd34d, #f87171)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                anywhere on the web.
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed mb-8">
              Install The Scout on Chrome and start building your creator database without leaving TikTok, Instagram, or YouTube. One click saves their full profile, stats, and contact info.
            </motion.p>

            <motion.ul variants={stagger} className="space-y-4 mb-8">
              {[
                { icon: Bookmark, text: "Save creator profiles with one click — directly from their social pages" },
                { icon: Star, text: "Auto-fetches engagement rate, audience demographics, and niche tags" },
                { icon: Users, text: "Syncs instantly to your Talent Trend Spot CRM and creator lists" },
                { icon: Zap, text: "Works on TikTok, Instagram, YouTube, and Twitter/X" },
              ].map((item, i) => (
                <motion.li key={i} variants={fadeUp} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)" }}>
                    <item.icon size={15} style={{ color: "#fcd34d" }} />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">{item.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.35)", color: "#fcd34d" }}
              >
                <Globe size={14} />
                Add to Chrome — Free
              </button>
              <span className="text-[11px] text-slate-600">Available for Chrome & Edge</span>
            </motion.div>
          </div>

          {/* Right: Browser window mockup */}
          <motion.div variants={fadeUp} className="relative">
            {/* Main browser window */}
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: "var(--bg-page-alt)", border: "1px solid var(--border-card-strong)" }}>
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#080810", borderBottom: "1px solid var(--border-card)" }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 mx-3 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-600" style={{ background: "var(--bg-card-hover)" }}>
                  <div className="w-3 h-3 rounded-sm bg-slate-700" />
                  tiktok.com/@nova.beauty
                  <CheckCircle2 size={10} className="text-green-500 ml-auto" />
                </div>
                {/* Extension icon in toolbar */}
                <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}>
                  <Bookmark size={11} className="text-white" />
                </div>
              </div>

              {/* Page content - TikTok profile mockup */}
              <div className="p-6 relative">
                {/* Profile area */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-4 rounded" style={{ background: "rgba(255,255,255,0.15)", width: 120 }} />
                      <CheckCircle2 size={14} className="text-blue-400" />
                    </div>
                    <div className="h-2.5 rounded mb-3" style={{ background: "var(--border-card-strong)", width: 160 }} />
                    <div className="flex gap-4 text-xs text-slate-500">
                      <div><strong className="text-slate-300">1.8M</strong> Followers</div>
                      <div><strong className="text-slate-300">12.4M</strong> Likes</div>
                    </div>
                  </div>
                </div>

                {/* Video grid mockup */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[9/16] rounded-xl" style={{ background: `rgba(${i % 2 === 0 ? "124,58,237" : "8,194,204"},0.15)` }} />
                  ))}
                </div>

                {/* Extension popup overlay */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-4 right-4 rounded-2xl p-4 w-56 shadow-2xl"
                  style={{ background: "#0f0f1e", border: "1px solid rgba(124,58,237,0.4)" }}
                >
                  {/* Extension header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}>
                      <Bookmark size={11} className="text-white" />
                    </div>
                    <span className="text-[11px] font-bold text-white">Talent Trend Spot</span>
                  </div>

                  {/* Creator stats */}
                  <div className="space-y-1.5 mb-3">
                    {[
                      { label: "Followers", value: "1.8M" },
                      { label: "Avg. Eng. Rate", value: "5.2%" },
                      { label: "Audience: F 25–34", value: "62%" },
                      { label: "Niche", value: "Beauty" },
                    ].map((stat, i) => (
                      <div key={i} className="flex justify-between text-[10px]">
                        <span className="text-slate-500">{stat.label}</span>
                        <span className="text-slate-200 font-medium">{stat.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Save button */}
                  <button
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold text-white transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}
                  >
                    <Plus size={12} />
                    Save to CRM
                  </button>

                  {/* Success state */}
                  <div className="flex items-center gap-1.5 mt-2 text-[9px] text-emerald-400 justify-center">
                    <CheckCircle2 size={9} />
                    Auto-adds contact info & tags
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Saved creators notification */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 rounded-2xl p-3 shadow-xl"
              style={{ background: "#0f0f1e", border: "1px solid rgba(52,211,153,0.3)", minWidth: "200px" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span className="text-xs font-semibold text-white">Saved to CRM</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-300 font-medium">@nova.beauty</div>
                  <div className="text-[9px] text-slate-600">1.8M · Beauty · TikTok</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
