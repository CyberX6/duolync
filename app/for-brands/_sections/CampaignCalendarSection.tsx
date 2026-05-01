"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Calendar, Clock, CheckCircle2, Bell, ArrowRight, BarChart3, Users } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const tasks = [
  { creator: "@nova.beauty", type: "Unboxing Reel", date: "May 3", platform: "TikTok", color: "#a78bfa", done: true },
  { creator: "@style.world", type: "Story Series", date: "May 7", platform: "Instagram", color: "#38bdf8", done: true },
  { creator: "@fitlife.co", type: "Review Post", date: "May 14", platform: "YouTube", color: "#34d399", done: false },
  { creator: "@techguru", type: "Comparison Video", date: "May 19", platform: "TikTok", color: "#fcd34d", done: false },
  { creator: "@travel.joe", type: "Storytelling", date: "May 21", platform: "Instagram", color: "#f87171", done: false },
];

const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
const eventDays: Record<number, string> = {
  3: "#a78bfa", 7: "#38bdf8", 14: "#34d399",
  19: "#fcd34d", 21: "#f87171", 28: "#a78bfa",
};

export function CampaignCalendarSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "var(--bg-page)" }}>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--glow-cyan) 0%, transparent 70%)" }} />

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left: Dashboard visual */}
          <motion.div variants={fadeUp} className="order-2 lg:order-1">
            {/* Month header */}
            <div className="rounded-3xl overflow-hidden" style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card-strong)" }}>
              {/* Top bar */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--bg-card-hover)" }}>
                <div className="flex items-center gap-2">
                  <Calendar size={16} style={{ color: "#67e8f9" }} />
                  <span className="text-white font-semibold text-sm">May 2026 — Campaign Timeline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <div className="w-2 h-2 rounded-full bg-violet-500" />
                    TikTok
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    Instagram
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    YouTube
                  </div>
                </div>
              </div>

              {/* Calendar grid */}
              <div className="p-5">
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                    <div key={d} className="text-[9px] text-slate-600 text-center py-1 font-medium">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty first day offset (May 2026 starts on Friday) */}
                  {[0, 1, 2, 3].map((i) => <div key={`e${i}`} />)}
                  {calendarDays.map((d) => (
                    <div
                      key={d}
                      className="relative text-center py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200"
                      style={{
                        background: eventDays[d] ? `${eventDays[d]}22` : d === 1 ? "var(--bg-card-hover)" : "transparent",
                        color: eventDays[d] ? eventDays[d] : d === 1 ? "var(--text-base)" : "rgba(100,116,139,0.7)",
                        border: eventDays[d] ? `1px solid ${eventDays[d]}50` : "1px solid transparent",
                      }}
                    >
                      {d}
                      {eventDays[d] && (
                        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: eventDays[d] }} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Task list */}
                <div className="mt-4 space-y-2" style={{ borderTop: "1px solid var(--bg-card-hover)", paddingTop: "1rem" }}>
                  {tasks.slice(0, 4).map((task, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-3 py-2 px-3 rounded-xl transition-all hover:bg-white/[0.02]"
                    >
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: task.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-300 truncate font-medium">{task.creator}</span>
                          <span className="text-[10px] text-slate-600">·</span>
                          <span className="text-[10px] text-slate-500 truncate">{task.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1 text-[10px] text-slate-600">
                          <Clock size={9} />
                          {task.date}
                        </div>
                        {task.done ? (
                          <CheckCircle2 size={13} className="text-emerald-400" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-px" style={{ background: "var(--bg-card-hover)", borderTop: "1px solid var(--bg-card-hover)" }}>
                {[
                  { icon: Users, value: "12", label: "Creators" },
                  { icon: CheckCircle2, value: "8/20", label: "Posts done" },
                  { icon: Bell, value: "3", label: "Reminders" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-3" style={{ background: "rgba(255,255,255,0.015)" }}>
                    <s.icon size={13} className="text-slate-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-300">{s.value}</div>
                      <div className="text-[9px] text-slate-600">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: content */}
          <div className="order-1 lg:order-2">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.35)", color: "#67e8f9" }}>
              <Calendar size={11} />
              Campaign Planner & Marketing Calendar
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-5">
              Plan{" "}
              <span style={{ background: "linear-gradient(90deg, #67e8f9, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                every post,
              </span>{" "}
              across every creator.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed mb-8">
              Coordinate campaigns across dozens of creators simultaneously. Set deadlines, track "What & When" for every post, and never miss a launch window again.
            </motion.p>

            <motion.ul variants={stagger} className="space-y-4 mb-8">
              {[
                { text: "Visual timeline across all creators and platforms" },
                { text: "Automated reminders sent to creators before deadlines" },
                { text: "Real-time status tracking: drafts, approvals, published" },
                { text: "Export campaign briefs and content calendars as PDF" },
              ].map((item, i) => (
                <motion.li key={i} variants={fadeUp} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{item.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.button
              variants={fadeUp}
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.35)", color: "#67e8f9" }}
            >
              Explore the calendar
              <ArrowRight size={15} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
