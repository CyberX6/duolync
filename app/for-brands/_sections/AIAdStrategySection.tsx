"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { Brain, Sparkles, ArrowRight, TrendingUp, DollarSign, Target, Play, CheckCircle2 } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const adFormats = [
  {
    name: "Storytelling",
    roi: "3.2×",
    desc: "Authentic narrative-driven content builds emotional connection. Ideal for lifestyle and beauty.",
    color: "#a78bfa",
    bg: "var(--glow-purple)",
    border: "rgba(124,58,237,0.3)",
    icon: Play,
  },
  {
    name: "Unboxing",
    roi: "2.7×",
    desc: "High excitement format that drives impulse purchases. Works best for consumer products.",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.12)",
    border: "rgba(56,189,248,0.3)",
    icon: Target,
  },
  {
    name: "Comparison",
    roi: "2.4×",
    desc: "Trust-building format that positions your product favorably against alternatives.",
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.3)",
    icon: TrendingUp,
  },
];

const chatMessages = [
  { role: "user", text: "We sell premium skincare. Target: women 25–34. Platform: TikTok. What ad format should we use?" },
  {
    role: "ai",
    text: null,
    suggestions: [
      { format: "Storytelling (60s reel)", roi: "3.2×", reason: "Top performer for skincare. Emotional narrative + before/after = 68% higher purchase intent." },
      { format: "Unboxing short", roi: "2.7×", reason: "High shareability. Perfect for new product launches with surprise elements." },
    ],
  },
  { role: "user", text: "Which creators should deliver this?" },
  { role: "ai", text: null, typing: true },
];

export function AIAdStrategySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeFormat, setActiveFormat] = useState(0);

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "var(--bg-page-alt)" }}>
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--glow-emerald) 0%, transparent 70%)" }} />

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
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.35)", color: "#6ee7b7" }}>
              <Brain size={11} />
              AI Ad Strategy Consultant
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-5">
              Your always-on{" "}
              <span style={{ background: "linear-gradient(90deg, #6ee7b7, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                strategy team.
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed mb-8">
              Describe your product and goals. Our AI consultant analyzes top-performing campaigns across thousands of brands to deliver a custom ad strategy — in seconds.
            </motion.p>

            {/* Format cards */}
            <motion.div variants={stagger} className="space-y-3 mb-8">
              {adFormats.map((format, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300"
                  style={{
                    background: activeFormat === i ? format.bg : "var(--bg-card-subtle)",
                    border: `1px solid ${activeFormat === i ? format.border : "var(--border-card)"}`,
                  }}
                  onClick={() => setActiveFormat(i)}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: format.bg, border: `1px solid ${format.border}` }}>
                    <format.icon size={16} style={{ color: format.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-semibold text-sm">{format.name}</span>
                      <div className="flex items-center gap-1 text-xs font-bold" style={{ color: format.color }}>
                        <DollarSign size={11} />
                        {format.roi} avg ROI
                      </div>
                    </div>
                    <AnimatePresence>
                      {activeFormat === i && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="text-slate-400 text-xs leading-relaxed overflow-hidden"
                        >
                          {format.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              variants={fadeUp}
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.35)", color: "#6ee7b7" }}
            >
              Try the AI consultant
              <ArrowRight size={15} />
            </motion.button>
          </div>

          {/* Right: AI chat visual */}
          <motion.div variants={fadeUp}>
            <div className="rounded-3xl overflow-hidden" style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card-strong)" }}>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--bg-card-hover)", background: "rgba(255,255,255,0.02)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}>
                  <Brain size={14} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">AI Strategy Consultant</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online · Analyzing 50K+ campaigns
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3 min-h-[300px]">
                {/* User message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white" style={{ background: "rgba(124,58,237,0.3)", border: "1px solid rgba(124,58,237,0.4)" }}>
                    We sell premium skincare. Target: women 25–34. TikTok. What ad format?
                  </div>
                </motion.div>

                {/* AI Response */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.55 }}
                >
                  <div className="max-w-[92%] rounded-2xl rounded-tl-sm p-4" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" }}>
                    <div className="flex items-center gap-1.5 mb-3">
                      <Sparkles size={11} className="text-emerald-400" />
                      <span className="text-[10px] font-semibold text-emerald-400">AI RECOMMENDATION</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { rank: 1, format: "Storytelling (60s reel)", roi: "3.2×", color: "#a78bfa" },
                        { rank: 2, format: "Unboxing short (15-30s)", roi: "2.7×", color: "#38bdf8" },
                      ].map((item) => (
                        <div key={item.rank} className="flex items-center gap-2 text-sm">
                          <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0" style={{ background: `${item.color}22`, color: item.color }}>
                            {item.rank}
                          </span>
                          <span className="text-slate-200 font-medium text-xs flex-1">{item.format}</span>
                          <span className="text-xs font-bold" style={{ color: item.color }}>{item.roi} ROI</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                      Based on 2,840 similar campaigns. Storytelling drives 68% higher purchase intent for this demographic.
                    </p>
                  </div>
                </motion.div>

                {/* Second user message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white" style={{ background: "rgba(124,58,237,0.3)", border: "1px solid rgba(124,58,237,0.4)" }}>
                    Which creators should deliver this?
                  </div>
                </motion.div>

                {/* Typing indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}>
                    <Brain size={12} className="text-white" />
                  </div>
                  <div className="flex items-center gap-1 px-3 py-2 rounded-2xl" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-card-strong)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[10px] text-slate-600">Analyzing creator database...</span>
                </motion.div>
              </div>

              {/* Input area */}
              <div className="px-4 pb-4">
                <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-card-strong)" }}>
                  <input
                    type="text"
                    placeholder="Ask anything about your ad strategy..."
                    className="flex-1 bg-transparent text-xs text-slate-400 placeholder:text-slate-600 focus:outline-none"
                  />
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}>
                    <ArrowRight size={12} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
