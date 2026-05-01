"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Map, Sparkles, ArrowRight, CheckCircle2, Lock, Star, TrendingUp, DollarSign, Users, Zap } from "lucide-react";

const fadeUp: Variants = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const AMBER = "#fcd34d";
const PINK = "#f472b6";
const VIOLET = "#c084fc";
const EMERALD = "#34d399";
const CYAN = "#67e8f9";

const roadmapSteps = [
  {
    phase: "Phase 1",
    title: "Foundation",
    milestone: "0 → 1K Followers",
    color: PINK,
    bg: "rgba(244,114,182,0.1)",
    border: "rgba(244,114,182,0.25)",
    done: true,
    tasks: ["Profile audit & optimization", "Niche identification", "Content pillars defined", "First 10 posts published"],
  },
  {
    phase: "Phase 2",
    title: "Momentum",
    milestone: "1K → 10K Followers",
    color: VIOLET,
    bg: "rgba(192,132,252,0.1)",
    border: "rgba(192,132,252,0.25)",
    done: false,
    active: true,
    tasks: ["Consistency streak: 3×/week", "Engagement strategy active", "First brand pitch sent", "Media kit created"],
  },
  {
    phase: "Phase 3",
    title: "Monetization",
    milestone: "First Paid Deal",
    color: AMBER,
    bg: "rgba(252,211,77,0.1)",
    border: "rgba(252,211,77,0.25)",
    done: false,
    tasks: ["Brand pitch templates", "Rate card established", "First $500+ deal signed", "CRM setup for follow-ups"],
  },
  {
    phase: "Phase 4",
    title: "Scale",
    milestone: "10K → 100K",
    color: EMERALD,
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.25)",
    done: false,
    tasks: ["Multi-platform expansion", "Premium brand deals $2K+", "Content team building", "Passive income streams"],
  },
];

const proStats = [
  { icon: Users, value: "10K", label: "avg. followers by month 4", color: PINK },
  { icon: DollarSign, value: "$1.2K", label: "first deal avg. value", color: AMBER },
  { icon: TrendingUp, value: "89%", label: "complete roadmap in 6mo", color: EMERALD },
];

export function RoadmapSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "var(--bg-page)" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[180px]" style={{ background: "radial-gradient(circle, var(--glow-amber) 0%, transparent 70%)" }} />
      </div>

      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: "rgba(252,211,77,0.12)", border: "1px solid rgba(252,211,77,0.35)", color: AMBER }}>
            <Map size={11} />
            The "Newbie to Pro" Roadmap
          </motion.div>
          <motion.h2 variants={fadeUp} transition={{ duration: 0.6 }} className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-4">
            Just starting?{" "}
            <span style={{ background: `linear-gradient(90deg, ${AMBER}, ${PINK})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              We've got you.
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="text-slate-400 max-w-xl mx-auto text-lg">
            Our AI-driven roadmap guides you step-by-step from zero to your first 10K followers and your first paid brand deal — no guesswork, no fluff.
          </motion.p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-16"
        >
          {proStats.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="text-center p-4 rounded-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)" }}
            >
              <s.icon size={16} className="mx-auto mb-2" style={{ color: s.color }} />
              <div className="text-xl font-bold font-display" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[10px] text-slate-500 leading-snug mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Roadmap phases */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
        >
          {roadmapSteps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="rounded-3xl p-5 relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{ background: step.active ? step.bg : "var(--bg-card)", border: `1px solid ${step.active ? step.border : "var(--border-card)"}` }}
            >
              {/* Phase badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${step.color}18`, color: step.color }}>
                  {step.phase}
                </span>
                {step.done ? (
                  <CheckCircle2 size={16} style={{ color: step.color }} />
                ) : step.active ? (
                  <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: `${step.color}30`, border: `1px solid ${step.color}` }}>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: step.color }} />
                  </div>
                ) : (
                  <Lock size={13} className="text-slate-700" />
                )}
              </div>

              {/* Title */}
              <div className="mb-1">
                <div className="font-display font-bold text-white text-lg leading-tight">{step.title}</div>
                <div className="text-xs font-medium" style={{ color: step.color }}>{step.milestone}</div>
              </div>

              {/* Tasks */}
              <ul className="mt-4 space-y-1.5">
                {step.tasks.map((task, j) => (
                  <li key={j} className="flex items-start gap-1.5 text-[11px]" style={{ color: step.done || step.active ? "#94a3b8" : "#475569" }}>
                    <div className="w-1 h-1 rounded-full shrink-0 mt-1.5" style={{ background: step.done || step.active ? step.color : "#374151" }} />
                    {task}
                  </li>
                ))}
              </ul>

              {step.active && (
                <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold" style={{ color: step.color }}>
                  <Zap size={10} />
                  YOU ARE HERE
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom AI callout */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="max-w-2xl mx-auto rounded-3xl p-8 text-center"
          style={{ background: "rgba(252,211,77,0.06)", border: "1px solid rgba(252,211,77,0.2)" }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles size={16} style={{ color: AMBER }} />
            <span className="text-sm font-semibold" style={{ color: AMBER }}>AI-Personalized Roadmap</span>
          </div>
          <h3 className="font-display font-bold text-white text-2xl mb-3">
            Not a generic checklist.
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-5">
            Your roadmap is built specifically for your niche, current follower count, and content style. The AI adapts your milestones in real-time as you grow — so you're always taking the right next step.
          </p>
          <button
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #d97706, #db2777)" }}
          >
            Get my personalized roadmap
            <ArrowRight size={15} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
