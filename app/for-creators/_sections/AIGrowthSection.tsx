"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { Brain, Sparkles, ArrowRight, TrendingUp, BarChart3, Clock, Target } from "lucide-react";

const fadeUp: Variants = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const EMERALD = "#34d399";
const VIOLET = "#c084fc";
const CYAN = "#67e8f9";

const tipCategories = [
  {
    label: "Engagement",
    color: EMERALD,
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.3)",
    icon: TrendingUp,
    tip: "Your Reels posted on Tuesday at 7 PM get 2.4× more saves. Schedule your next brand collab then for max reach.",
    stat: "+2.4× saves",
  },
  {
    label: "Content Mix",
    color: VIOLET,
    bg: "rgba(192,132,252,0.12)",
    border: "rgba(192,132,252,0.3)",
    icon: BarChart3,
    tip: "You're over-indexing on product showcases (68%). Add more educational content — your audience responds 3× better to tutorials.",
    stat: "3× better CTR",
  },
  {
    label: "Best Time",
    color: CYAN,
    bg: "rgba(103,232,249,0.12)",
    border: "rgba(103,232,249,0.3)",
    icon: Clock,
    tip: "Your YouTube Shorts get 40% more views when published on Friday between 3–5 PM. Your current timing is off by 2 hours.",
    stat: "+40% views",
  },
  {
    label: "Growth",
    color: "#fcd34d",
    bg: "rgba(252,211,77,0.12)",
    border: "rgba(252,211,77,0.3)",
    icon: Target,
    tip: "Creators with your profile score hit 50K in avg. 4.2 months. Your current pace puts you there in 6.1 months — here's how to close the gap.",
    stat: "On track",
  },
];

const audienceStats = [
  { label: "Avg. Engagement", value: "4.2%", change: "+0.8%", positive: true, color: EMERALD },
  { label: "Follower Growth", value: "+12%", change: "vs last month", positive: true, color: VIOLET },
  { label: "Profile Score", value: "78/100", change: "Top 15%", positive: true, color: CYAN },
];

export function AIGrowthSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "var(--bg-page-alt)" }}>
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--glow-emerald) 0%, transparent 70%)" }} />

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
            <motion.div variants={fadeUp} transition={{ duration: 0.65 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.35)", color: EMERALD }}>
              <Brain size={11} />
              AI Growth Mentor
            </motion.div>
            <motion.h2 variants={fadeUp} transition={{ duration: 0.65 }} className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-5">
              Your personal AI{" "}
              <span style={{ background: `linear-gradient(90deg, ${EMERALD}, ${CYAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                growth coach.
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} transition={{ duration: 0.65 }} className="text-slate-400 text-lg leading-relaxed mb-8">
              Whether you have 500 followers or 5 million — our AI studies your content performance and gives you a personalized weekly action plan to grow faster and land better deals.
            </motion.p>

            {/* Tip category tabs */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex flex-wrap gap-2 mb-4">
              {tipCategories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200"
                  style={{
                    background: activeTab === i ? cat.bg : "var(--bg-card-hover)",
                    border: `1px solid ${activeTab === i ? cat.border : "var(--border-card)"}`,
                    color: activeTab === i ? cat.color : "#64748b",
                  }}
                >
                  <cat.icon size={11} />
                  {cat.label}
                </button>
              ))}
            </motion.div>

            {/* Active tip */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl p-4 mb-8"
                style={{ background: `${tipCategories[activeTab].color}10`, border: `1px solid ${tipCategories[activeTab].border}` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={12} style={{ color: tipCategories[activeTab].color }} />
                  <span className="text-[10px] font-semibold" style={{ color: tipCategories[activeTab].color }}>
                    AI INSIGHT · {tipCategories[activeTab].stat}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{tipCategories[activeTab].tip}</p>
              </motion.div>
            </AnimatePresence>

            <motion.button
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02]"
              style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.35)", color: EMERALD }}
            >
              Get my AI growth plan
              <ArrowRight size={15} />
            </motion.button>
          </div>

          {/* Right: AI dashboard visual */}
          <motion.div variants={fadeUp} transition={{ duration: 0.65 }}>
            <div className="rounded-3xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-card-strong)" }}>
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--bg-card-hover)", background: "rgba(255,255,255,0.02)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #059669, #0891b2)" }}>
                  <Brain size={14} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">AI Growth Mentor</div>
                  <div className="flex items-center gap-1.5 text-[10px]" style={{ color: EMERALD }}>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: EMERALD }} />
                    Analyzing your last 30 days
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-px" style={{ background: "var(--bg-card-hover)" }}>
                {audienceStats.map((s, i) => (
                  <div key={i} className="p-4 text-center" style={{ background: "var(--bg-page-alt)" }}>
                    <div className="text-lg font-bold font-display" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-[9px] text-slate-500 mb-0.5">{s.label}</div>
                    <div className="text-[9px] font-medium" style={{ color: s.positive ? "#34d399" : "#f87171" }}>{s.change}</div>
                  </div>
                ))}
              </div>

              {/* Performance bar chart mockup */}
              <div className="p-5">
                <div className="text-[11px] font-semibold text-slate-500 mb-3">Engagement by content type</div>
                <div className="space-y-2.5">
                  {[
                    { label: "Tutorial / Educational", value: 78, color: EMERALD },
                    { label: "Brand Collaboration", value: 62, color: VIOLET },
                    { label: "Behind the Scenes", value: 54, color: CYAN },
                    { label: "Product Showcase", value: 41, color: "#fcd34d" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-slate-500">{item.label}</span>
                        <span className="font-medium" style={{ color: item.color }}>{item.value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: "var(--bg-card-hover)" }}>
                        <motion.div
                          className="h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${item.value}%` } : { width: 0 }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                          style={{ background: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI suggestion card */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.1 }}
                  className="mt-4 rounded-2xl p-4"
                  style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" }}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles size={11} className="text-emerald-400" />
                    <span className="text-[10px] font-semibold text-emerald-400">THIS WEEK'S PRIORITY</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Post <strong>2 tutorial-style Reels</strong> this week. Your tutorials get 3× more saves and attract higher-quality brand partnerships in your niche.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
