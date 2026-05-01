"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { ShieldCheck, BarChart3, Globe, BookOpen, Newspaper, FileText, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const fadeUp: Variants = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const AMBER = "#fcd34d";
const PURPLE = "#a78bfa";

const tools = [
  { Icon: ShieldCheck, title: "Fake Follower Checker", desc: "Verify if a creator has real, authentic followers — or bots.", color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.25)" },
  { Icon: BarChart3, title: "Engagement Calculator", desc: "Calculate true engagement rates across any social platform instantly.", color: "#34d399", bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.25)" },
  { Icon: Globe, title: "Chrome Extension", desc: "Discover and save creators directly while browsing social media.", color: "#67e8f9", bg: "rgba(103,232,249,0.12)", border: "rgba(103,232,249,0.25)" },
];

const resources = [
  { Icon: BookOpen, title: "Usage Guides", desc: "Level up your influencer marketing knowledge with step-by-step guides." },
  { Icon: Newspaper, title: "Blog", desc: "Stay ahead with insightful articles on creator economy trends." },
  { Icon: FileText, title: "FAQ", desc: "Get quick answers to the most common platform questions." },
];

export function ToolsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "#09090f" }}>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(252,211,77,0.05) 0%, transparent 70%)" }} />

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: "rgba(252,211,77,0.12)", border: "1px solid rgba(252,211,77,0.3)", color: AMBER }}>
            <Sparkles size={11} />
            Free Resources
          </motion.div>
          <motion.h2 variants={fadeUp} transition={{ duration: 0.6 }} className="font-display font-bold text-white text-4xl md:text-5xl mb-4">
            More resources{" "}
            <span style={{ background: `linear-gradient(90deg, ${AMBER}, #f472b6)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              to explore.
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="text-slate-400 max-w-lg mx-auto">
            Free tools and guides to help you master influencer marketing — no account required.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* Left: Free tools */}
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
            <div className="rounded-3xl p-6 h-full" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="mb-2">
                <div className="text-lg font-display font-bold text-white">Free Tools</div>
                <p className="text-slate-500 text-sm">Your complete guide to influencer marketing</p>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">
                Unlock the power of influencer marketing with Nexly's free resources. Gain insights, tips, and strategies to harness the potential of influencers for your business.
              </p>

              <div className="space-y-3">
                {tools.map((tool, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-4 rounded-2xl p-4 transition-all hover:scale-[1.01] cursor-pointer"
                    style={{ background: tool.bg, border: `1px solid ${tool.border}` }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${tool.color}20` }}>
                      <tool.Icon size={20} style={{ color: tool.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white">{tool.title}</div>
                      <div className="text-[11px] text-slate-500">{tool.desc}</div>
                    </div>
                    <ArrowRight size={14} style={{ color: tool.color }} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Resources + Extension CTA */}
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="space-y-4">
            {resources.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-2xl p-5 transition-all hover:bg-white/[0.02] cursor-pointer"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)" }}>
                  <r.Icon size={20} style={{ color: PURPLE }} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white mb-1">{r.title}</div>
                  <div className="text-[11px] text-slate-500 mb-2">{r.desc}</div>
                  <Link href="/auth" className="inline-flex items-center gap-1.5 text-xs font-medium transition-all hover:gap-2.5" style={{ color: PURPLE }}>
                    See more <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}

            {/* Chrome extension banner */}
            <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(8,145,178,0.2))", border: "1px solid rgba(124,58,237,0.3)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.1)" }}>
                <Globe size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white mb-0.5">Free Chrome Extension</div>
                <div className="text-[11px] text-slate-400">Find creators while browsing social media</div>
              </div>
              <Link href="/auth" className="shrink-0 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}>
                Download
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
