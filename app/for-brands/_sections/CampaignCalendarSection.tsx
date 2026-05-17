"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  Calendar, Clock, CheckCircle2, Bell, ArrowRight, Users,
} from "lucide-react";

const fadeUp: Variants = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

type DemoPhase = "idle" | "running" | "done";

const tasks = [
  { creator: "@nova.beauty", type: "Unboxing Reel",    date: "May 3",  platform: "TikTok",    color: "#a78bfa", done: true  },
  { creator: "@style.world", type: "Story Series",     date: "May 7",  platform: "Instagram", color: "#38bdf8", done: true  },
  { creator: "@fitlife.co",  type: "Review Post",      date: "May 14", platform: "YouTube",   color: "#34d399", done: false },
  { creator: "@techguru",    type: "Comparison Video", date: "May 19", platform: "TikTok",    color: "#fcd34d", done: false },
  { creator: "@travel.joe",  type: "Storytelling",     date: "May 21", platform: "Instagram", color: "#f87171", done: false },
];

const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

const eventDays: Record<number, string> = {
  3: "#a78bfa", 7: "#38bdf8", 14: "#34d399",
  19: "#fcd34d", 21: "#f87171", 28: "#a78bfa",
};

const eventDayToCreator: Record<number, string> = {
  3:  "@nova.beauty", 7:  "@style.world", 14: "@fitlife.co",
  19: "@techguru",    21: "@travel.joe",  28: "@nova.beauty",
};

// Order in which calendar events pop in during the demo
const REVEAL_SEQUENCE = [3, 7, 14, 19, 21, 28];

export function CampaignCalendarSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [demoPhase, setDemoPhase]           = useState<DemoPhase>("idle");
  const [revealedDays, setRevealedDays]     = useState<Set<number>>(new Set());
  const [hoveredCreator, setHoveredCreator] = useState<string | null>(null);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => () => clearAll(), [clearAll]);

  const triggerDemo = useCallback(() => {
    if (demoPhase === "running") return;
    clearAll();
    setDemoPhase("running");
    setRevealedDays(new Set());

    REVEAL_SEQUENCE.forEach((day, i) => {
      const t = setTimeout(() => {
        setRevealedDays((prev) => new Set([...prev, day]));
      }, 350 + i * 360);
      timeoutsRef.current.push(t);
    });

    const doneT = setTimeout(
      () => setDemoPhase("done"),
      350 + REVEAL_SEQUENCE.length * 360 + 250,
    );
    timeoutsRef.current.push(doneT);
  }, [demoPhase, clearAll]);

  const isDemo = demoPhase !== "idle";

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "var(--bg-page)" }}>
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--glow-cyan) 0%, transparent 70%)" }}
      />

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* ── Left: Dashboard visual ── */}
          <motion.div variants={fadeUp} className="order-2 lg:order-1">
            <div
              className="rounded-3xl overflow-hidden"
              style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card-strong)" }}
            >
              {/* Top bar */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid var(--bg-card-hover)" }}
              >
                <div className="flex items-center gap-2">
                  <Calendar size={16} style={{ color: "#67e8f9" }} />
                  <span className="text-white font-semibold text-sm">May 2026 — Campaign Timeline</span>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { label: "TikTok",    cls: "bg-violet-500" },
                    { label: "Instagram", cls: "bg-cyan-500"   },
                    { label: "YouTube",   cls: "bg-emerald-500"},
                  ].map((p) => (
                    <div key={p.label} className="flex items-center gap-1 text-[10px] text-slate-500">
                      <div className={`w-2 h-2 rounded-full ${p.cls}`} />
                      {p.label}
                    </div>
                  ))}
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
                  {/* May 2026 starts on Friday — 4 blank cells */}
                  {[0, 1, 2, 3].map((i) => <div key={`e${i}`} />)}

                  {calendarDays.map((d) => {
                    const hasEvent = !!eventDays[d];
                    const isHidden  = isDemo && hasEvent && !revealedDays.has(d);
                    const isDimmed  = !!hoveredCreator && hasEvent && eventDayToCreator[d] !== hoveredCreator;

                    return (
                      <motion.div
                        key={d}
                        animate={{
                          opacity: isHidden ? 0 : isDimmed ? 0.15 : 1,
                          scale:   isHidden ? 0.3 : 1,
                        }}
                        transition={{
                          opacity: { duration: 0.18 },
                          scale:   { type: "spring", stiffness: 500, damping: 24 },
                        }}
                        className="relative text-center py-1.5 rounded-lg text-[10px] font-medium"
                        style={{
                          background: hasEvent
                            ? `${eventDays[d]}22`
                            : d === 1 ? "var(--bg-card-hover)" : "transparent",
                          color: hasEvent
                            ? eventDays[d]
                            : d === 1 ? "var(--text-base)" : "rgba(100,116,139,0.7)",
                          border: hasEvent
                            ? `1px solid ${eventDays[d]}50`
                            : "1px solid transparent",
                        }}
                      >
                        {d}
                        {hasEvent && (
                          <div
                            className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                            style={{ background: eventDays[d] }}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Task list */}
                <div
                  className="mt-4 space-y-1"
                  style={{ borderTop: "1px solid var(--bg-card-hover)", paddingTop: "1rem" }}
                >
                  {tasks.slice(0, 4).map((task, i) => {
                    const isActive    = hoveredCreator === task.creator;
                    const isDimmedRow = !!hoveredCreator && !isActive;

                    return (
                      /* Outer motion.div handles the scroll entrance only */
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        onMouseEnter={() => setHoveredCreator(task.creator)}
                        onMouseLeave={() => setHoveredCreator(null)}
                        className="cursor-default"
                      >
                        {/* Inner div handles hover-dimming via CSS (independent of entrance anim) */}
                        <div
                          className="flex items-center gap-3 py-2 px-3 rounded-xl"
                          style={{
                            opacity:    isDimmedRow ? 0.2 : 1,
                            background: isActive ? `${task.color}12` : "transparent",
                            border:     isActive ? `1px solid ${task.color}30` : "1px solid transparent",
                            transition: "opacity 0.18s ease, background 0.18s ease, border-color 0.18s ease",
                          }}
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
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Stats row */}
              <div
                className="grid grid-cols-3 gap-px"
                style={{ background: "var(--bg-card-hover)", borderTop: "1px solid var(--bg-card-hover)" }}
              >
                {[
                  { icon: Users,        value: "12",   label: "Creators"   },
                  { icon: CheckCircle2, value: "8/20", label: "Posts done" },
                  { icon: Bell,         value: "3",    label: "Reminders"  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-3"
                    style={{ background: "rgba(255,255,255,0.015)" }}
                  >
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

          {/* ── Right: copy ── */}
          <div className="order-1 lg:order-2">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5"
              style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.35)", color: "#67e8f9" }}
            >
              <Calendar size={11} />
              Campaign Planner &amp; Marketing Calendar
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-5"
            >
              Plan{" "}
              <span style={{ background: "linear-gradient(90deg, #67e8f9, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                every post,
              </span>{" "}
              across every creator.
            </motion.h2>

            <motion.p variants={fadeUp} className="text-slate-400 text-lg leading-relaxed mb-8">
              Coordinate campaigns across dozens of creators simultaneously. Set deadlines,
              track &ldquo;What &amp; When&rdquo; for every post, and never miss a launch window again.
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

            {/* Desktop button — hidden on mobile */}
            <motion.button
              variants={fadeUp}
              onClick={triggerDemo}
              disabled={demoPhase === "running"}
              className="hidden lg:flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.35)", color: "#67e8f9" }}
            >
              {demoPhase === "running" ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  Explore the calendar
                  <ArrowRight size={15} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile-only button — appears below the calendar */}
        <div className="flex lg:hidden mt-6">
          <button
            onClick={triggerDemo}
            disabled={demoPhase === "running"}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.35)", color: "#67e8f9" }}
          >
            {demoPhase === "running" ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                Explore the calendar
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
