"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Database, FileText, Users, Rocket, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";

const fadeUp: Variants = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const EMERALD = "#34d399";

const campaigns = [
  { title: "Tech Unboxing Series", creators: 5, engagement: "6.2%", status: "In Progress", statusColor: "#fcd34d", color: "from-blue-500 to-cyan-500" },
  { title: "Spring Collection Lifestyle", creators: 8, engagement: "4.8%", status: "Review", statusColor: "#67e8f9", color: "from-pink-500 to-rose-600" },
  { title: "Videography Contest", creators: 11, engagement: "5.9%", status: "Completed", statusColor: "#34d399", color: "from-violet-500 to-purple-600" },
];

export function CRMSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "var(--bg-page)" }}>
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
              <Database size={11} />
              Campaign CRM
            </motion.div>
            <motion.h2 variants={fadeUp} transition={{ duration: 0.65 }} className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-5">
              Ditch the{" "}
              <span style={{ background: `linear-gradient(90deg, ${EMERALD}, #67e8f9)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                spreadsheet.
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} transition={{ duration: 0.65 }} className="text-slate-400 text-lg leading-relaxed mb-8">
              Enhance your productivity with built-in campaign management. Track every creator, deliverable, and payment — with data-driven insights at every step.
            </motion.p>

            <motion.ul variants={stagger} className="space-y-4 mb-8">
              {[
                { icon: Users, text: "Centralized CRM for your entire creator community" },
                { icon: FileText, text: "Full partnership history and campaign timeline in one place" },
                { icon: BarChart3, text: "Live analytics: reach, engagement, ROI across all campaigns" },
                { icon: Rocket, text: "Save time on admin — focus on scaling your campaigns" },
              ].map((item, i) => (
                <motion.li key={i} variants={fadeUp} transition={{ duration: 0.5 }} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)" }}>
                    <item.icon size={15} style={{ color: EMERALD }} />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">{item.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.a
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              href="/for-brands"
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02]"
              style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.35)", color: EMERALD }}
            >
              Explore the CRM
              <ArrowRight size={15} />
            </motion.a>
          </div>

          {/* Right: CRM Dashboard */}
          <motion.div variants={fadeUp} transition={{ duration: 0.65 }}>
            <div className="rounded-3xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-card-strong)" }}>
              {/* Dashboard header */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--bg-card-hover)" }}>
                <span className="text-sm font-semibold text-white">Campaign Dashboard</span>
                <div className="flex gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium" style={{ background: "rgba(52,211,153,0.2)", color: "#34d399" }}>Active</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] text-slate-500" style={{ background: "var(--bg-card-hover)" }}>3 Campaigns</span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-px" style={{ background: "var(--bg-card-hover)" }}>
                {[
                  { label: "Creators", value: "24", color: "#a78bfa" },
                  { label: "Budget", value: "$45K", color: "#34d399" },
                  { label: "Reach", value: "2.8M", color: "#67e8f9" },
                ].map((s) => (
                  <div key={s.label} className="p-4 text-center" style={{ background: "var(--bg-page)" }}>
                    <div className="text-xl font-bold font-display" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-[10px] text-slate-600">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Campaign rows */}
              <div className="p-5 space-y-3">
                {campaigns.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.12 }}
                    className="flex items-center gap-3 rounded-2xl p-3.5 transition-all hover:bg-white/[0.02] cursor-pointer"
                    style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)" }}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-200 truncate leading-tight">{c.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{c.creators} creators · Eng {c.engagement}</div>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0" style={{ background: `${c.statusColor}18`, color: c.statusColor }}>
                      {c.status}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 pb-4">
                <div className="flex items-center gap-2 rounded-xl px-4 py-3" style={{ background: "var(--glow-emerald)", border: "1px solid rgba(52,211,153,0.15)" }}>
                  <BarChart3 size={14} style={{ color: EMERALD }} />
                  <span className="text-xs text-slate-400 flex-1">Campaign performance up <strong style={{ color: EMERALD }}>+23%</strong> this month</span>
                  <CheckCircle2 size={13} style={{ color: EMERALD }} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
