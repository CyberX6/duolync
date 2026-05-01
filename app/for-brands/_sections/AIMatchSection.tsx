"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Sparkles, Search, TrendingUp, Star, Users, Target, ArrowRight, CheckCircle2 } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const creators = [
  {
    name: "@nova.beauty",
    niche: "Beauty",
    followers: "2.4M",
    engRate: "5.2%",
    match: 96,
    gradient: "from-pink-500 to-rose-600",
    tags: ["Skincare", "Makeup", "Tutorials"],
  },
  {
    name: "@style.world",
    niche: "Fashion",
    followers: "1.8M",
    engRate: "4.8%",
    match: 91,
    gradient: "from-violet-500 to-purple-700",
    tags: ["Street Style", "Hauls", "OOTDs"],
  },
  {
    name: "@fitlife.co",
    niche: "Wellness",
    followers: "980K",
    engRate: "7.1%",
    match: 88,
    gradient: "from-emerald-500 to-teal-600",
    tags: ["Fitness", "Nutrition", "Health"],
  },
];

const aiInsights = [
  { label: "Audience-brand fit", value: 94, color: "#a78bfa" },
  { label: "Sales prediction score", value: 89, color: "#38bdf8" },
  { label: "Engagement quality", value: 97, color: "#34d399" },
  { label: "Content authenticity", value: 92, color: "#fcd34d" },
];

export function AIMatchSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "var(--bg-page-alt)" }}>
      {/* Ambient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--glow-purple) 0%, transparent 70%)" }} />

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
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: "var(--glow-purple)", border: "1px solid rgba(124,58,237,0.35)", color: "#c4b5fd" }}>
              <Sparkles size={11} />
              AI Smart Search & Matching
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-5">
              Your AI{" "}
              <span style={{ background: "linear-gradient(90deg, #a78bfa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                matchmaker
              </span>{" "}
              for creator partnerships.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed mb-8">
              Our AI ingests your product catalog and brand identity, then cross-references it against creator audience data to surface partnerships that are scientifically proven to convert.
            </motion.p>

            <motion.ul variants={stagger} className="space-y-4 mb-8">
              {[
                { icon: Target, text: "Audience-to-brand affinity scoring across 200+ signals" },
                { icon: TrendingUp, text: "Sales potential prediction before you spend a dollar" },
                { icon: Star, text: "Fake-follower and engagement fraud detection built in" },
                { icon: Users, text: "Cross-platform discovery: TikTok, Instagram, YouTube" },
              ].map((item, i) => (
                <motion.li key={i} variants={fadeUp} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)" }}>
                    <item.icon size={15} style={{ color: "#a78bfa" }} />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">{item.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.button
              variants={fadeUp}
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "#c4b5fd" }}
            >
              See how it works
              <ArrowRight size={15} />
            </motion.button>
          </div>

          {/* Right: visual */}
          <motion.div variants={fadeUp} className="relative">
            {/* Search bar */}
            <div className="rounded-2xl p-4 mb-4" style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card-strong)" }}>
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-card-strong)" }}>
                <Search size={15} className="text-slate-600" />
                <span className="text-slate-500 text-sm flex-1">Skincare brand targeting 25-34F with $50+ AOV...</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-medium" style={{ background: "rgba(124,58,237,0.25)", color: "#c4b5fd" }}>AI</span>
              </div>
              <div className="flex items-center gap-2 mt-2 px-1">
                <span className="text-[10px] text-slate-600">Filters:</span>
                {["Engagement >4%", "100K–5M followers", "Female majority"].map((f) => (
                  <span key={f} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--bg-card-hover)", color: "#64748b", border: "1px solid var(--bg-card-hover)" }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Creator results */}
            <div className="space-y-3">
              {creators.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.035)", border: "1px solid var(--border-card-strong)" }}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${c.gradient} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white font-medium text-sm">{c.name}</span>
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5">
                      <span>{c.followers}</span>
                      <span>·</span>
                      <span>Eng {c.engRate}</span>
                    </div>
                    <div className="flex gap-1">
                      {c.tags.map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded-full text-[9px]" style={{ background: "var(--bg-card-hover)", color: "#94a3b8" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  {/* Match score */}
                  <div className="shrink-0 text-center">
                    <div className="text-lg font-bold text-emerald-400">{c.match}%</div>
                    <div className="text-[9px] text-slate-600">Match</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI insights panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-4 rounded-2xl p-4"
              style={{ background: "var(--glow-purple)", border: "1px solid rgba(124,58,237,0.2)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={13} className="text-violet-400" />
                <span className="text-xs font-medium text-violet-300">AI Analysis — @nova.beauty</span>
              </div>
              <div className="space-y-2">
                {aiInsights.map((insight) => (
                  <div key={insight.label}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-slate-500">{insight.label}</span>
                      <span className="font-medium" style={{ color: insight.color }}>{insight.value}%</span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: "var(--bg-card-hover)" }}>
                      <div className="h-1 rounded-full transition-all duration-1000" style={{ width: isInView ? `${insight.value}%` : "0%", background: insight.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
