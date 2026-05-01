"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { LayoutDashboard, CheckCircle2, ArrowRight, Bell, BarChart3, Clock, Play, Image } from "lucide-react";

const fadeUp: Variants = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const VIOLET = "#c084fc";
const PINK = "#f472b6";
const CYAN = "#67e8f9";

const platforms = [
  { name: "TikTok", color: "#f472b6", bg: "rgba(244,114,182,0.15)", border: "rgba(244,114,182,0.3)", posts: 8 },
  { name: "Instagram", color: "#c084fc", bg: "rgba(192,132,252,0.15)", border: "rgba(192,132,252,0.3)", posts: 12 },
  { name: "YouTube", color: "#f87171", bg: "rgba(248,113,113,0.15)", border: "rgba(248,113,113,0.3)", posts: 3 },
];

const scheduledPosts = [
  { platform: "TikTok", type: "Collab Reel", brand: "Nike", time: "Today 7PM", color: "#f472b6", icon: Play },
  { platform: "Instagram", type: "Story Set", brand: "Glossier", time: "Thu 8PM", color: "#c084fc", icon: Image },
  { platform: "YouTube", type: "Review Video", brand: "Razer", time: "Fri 3PM", color: "#f87171", icon: Play },
  { platform: "TikTok", type: "Organic", brand: "Personal", time: "Sat 6PM", color: "#f472b6", icon: Image },
];

const calendarEvents: Record<number, string> = { 3: "#f472b6", 7: "#c084fc", 11: "#f87171", 14: "#f472b6", 18: "#c084fc", 21: "#67e8f9", 25: "#f472b6" };

export function OmniDashboardSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "var(--bg-page-alt)" }}>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(192,132,252,0.08) 0%, transparent 70%)" }} />

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
            <motion.div variants={fadeUp} transition={{ duration: 0.65 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: "rgba(192,132,252,0.12)", border: "1px solid rgba(192,132,252,0.35)", color: VIOLET }}>
              <LayoutDashboard size={11} />
              Omni-Channel Dashboard
            </motion.div>
            <motion.h2 variants={fadeUp} transition={{ duration: 0.65 }} className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-5">
              Every platform.{" "}
              <span style={{ background: `linear-gradient(90deg, ${VIOLET}, ${CYAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                One command center.
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} transition={{ duration: 0.65 }} className="text-slate-400 text-lg leading-relaxed mb-8">
              Stop jumping between apps. Plan, schedule, and track your content across TikTok, Instagram, and YouTube from a single, beautiful dashboard.
            </motion.p>

            <motion.ul variants={stagger} className="space-y-4 mb-8">
              {[
                { icon: LayoutDashboard, text: "Unified content calendar across all connected platforms" },
                { icon: Clock, text: "AI-suggested post times based on your audience activity" },
                { icon: Bell, text: "Deadline alerts for brand campaign deliverables" },
                { icon: BarChart3, text: "Real-time cross-platform analytics in one view" },
              ].map((item, i) => (
                <motion.li key={i} variants={fadeUp} transition={{ duration: 0.5 }} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(192,132,252,0.12)", border: "1px solid rgba(192,132,252,0.25)" }}>
                    <item.icon size={15} style={{ color: VIOLET }} />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">{item.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.button
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02]"
              style={{ background: "rgba(192,132,252,0.15)", border: "1px solid rgba(192,132,252,0.4)", color: VIOLET }}
            >
              Explore the dashboard
              <ArrowRight size={15} />
            </motion.button>
          </div>

          {/* Right: Dashboard visual */}
          <motion.div variants={fadeUp} transition={{ duration: 0.65 }}>
            <div className="rounded-3xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-card-strong)" }}>
              {/* Top bar */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--bg-card-hover)" }}>
                <span className="text-sm font-semibold text-white">Content Calendar — May 2026</span>
                <div className="flex items-center gap-1.5">
                  {platforms.map((p) => (
                    <div key={p.name} className="px-2 py-0.5 rounded-md text-[10px] font-medium" style={{ background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>
                      {p.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform summary */}
              <div className="grid grid-cols-3 gap-px" style={{ background: "var(--bg-card-hover)" }}>
                {platforms.map((p) => (
                  <div key={p.name} className="p-3 text-center" style={{ background: "var(--bg-page-alt)" }}>
                    <div className="text-lg font-bold font-display" style={{ color: p.color }}>{p.posts}</div>
                    <div className="text-[9px] text-slate-600">posts this month</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{p.name}</div>
                  </div>
                ))}
              </div>

              {/* Mini calendar */}
              <div className="p-5">
                <div className="grid grid-cols-7 gap-0.5 mb-1">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                    <div key={d} className="text-[9px] text-slate-600 text-center py-0.5 font-medium">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5 mb-4">
                  {[0, 1, 2, 3].map((i) => <div key={`e${i}`} />)}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <div
                      key={d}
                      className="text-center py-1.5 rounded-lg text-[9px] font-medium relative"
                      style={{
                        background: calendarEvents[d] ? `${calendarEvents[d]}22` : "transparent",
                        color: calendarEvents[d] ? calendarEvents[d] : "rgba(100,116,139,0.7)",
                        border: calendarEvents[d] ? `1px solid ${calendarEvents[d]}40` : "1px solid transparent",
                      }}
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Upcoming posts */}
                <div style={{ borderTop: "1px solid var(--bg-card-hover)", paddingTop: "1rem" }}>
                  <div className="text-[11px] font-semibold text-slate-500 mb-2.5">Upcoming posts</div>
                  <div className="space-y-2">
                    {scheduledPosts.map((post, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-center gap-3 rounded-xl p-2.5 transition-all hover:bg-white/[0.02]"
                      >
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${post.color}20`, border: `1px solid ${post.color}35` }}>
                          <post.icon size={12} style={{ color: post.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-slate-200 font-medium">{post.type}</div>
                          <div className="text-[10px] text-slate-500">{post.brand} · {post.platform}</div>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-600 shrink-0">
                          <Clock size={9} />
                          {post.time}
                        </div>
                      </motion.div>
                    ))}
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
