"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  useInView,
  animate,
  AnimatePresence,
  type Variants,
  type AnimationPlaybackControls,
} from "framer-motion";
import {
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
  Bell,
  BarChart3,
  Clock,
  Play,
  Image,
  Loader2,
} from "lucide-react";

const fadeUp: Variants = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const VIOLET = "#c084fc";
const CYAN   = "#67e8f9";

const platforms = [
  { name: "TikTok",    color: "#f472b6", bg: "rgba(244,114,182,0.15)", border: "rgba(244,114,182,0.3)", posts: 8  },
  { name: "Instagram", color: "#c084fc", bg: "rgba(192,132,252,0.15)", border: "rgba(192,132,252,0.3)", posts: 12 },
  { name: "YouTube",   color: "#f87171", bg: "rgba(248,113,113,0.15)", border: "rgba(248,113,113,0.3)", posts: 3  },
];

const scheduledPosts = [
  { platform: "TikTok",    type: "Collab Reel",  brand: "Nike",     time: "Today 7PM", color: "#f472b6", icon: Play  },
  { platform: "Instagram", type: "Story Set",     brand: "Glossier", time: "Thu 8PM",   color: "#c084fc", icon: Image },
  { platform: "YouTube",   type: "Review Video",  brand: "Razer",    time: "Fri 3PM",   color: "#f87171", icon: Play  },
  { platform: "TikTok",    type: "Organic",       brand: "Personal", time: "Sat 6PM",   color: "#f472b6", icon: Image },
];

const calendarEvents: Record<number, string> = {
  3: "#f472b6", 7: "#c084fc", 11: "#f87171",
  14: "#f472b6", 18: "#c084fc", 21: "#67e8f9", 25: "#f472b6",
};
const EVENT_DAYS = Object.keys(calendarEvents).map(Number);

type StatusKey = "Scheduled" | "Going Live" | "Queued" | "Synced" | "Pending";
const STATUS_STYLE: Record<StatusKey, { color: string; bg: string }> = {
  "Scheduled":  { color: "#475569", bg: "rgba(71,85,105,0.2)"    },
  "Going Live": { color: "#fcd34d", bg: "rgba(252,211,77,0.18)"  },
  "Queued":     { color: "#67e8f9", bg: "rgba(103,232,249,0.18)" },
  "Synced":     { color: "#34d399", bg: "rgba(52,211,153,0.18)"  },
  "Pending":    { color: "#c084fc", bg: "rgba(192,132,252,0.18)" },
};

type DemoPhase = "idle" | "running" | "done";

export function OmniDashboardSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [demoPhase,    setDemoPhase]    = useState<DemoPhase>("idle");
  // null = use static values, array = animated counters
  const [metricValues, setMetricValues] = useState<number[] | null>(null);
  // null = show all calendarEvents, Set = show only revealed days
  const [revealedDays, setRevealedDays] = useState<Set<number> | null>(null);
  const [postStatuses, setPostStatuses] = useState<StatusKey[]>(
    scheduledPosts.map(() => "Scheduled"),
  );

  const timeoutsRef  = useRef<ReturnType<typeof setTimeout>[]>([]);
  const animCtrlsRef = useRef<AnimationPlaybackControls[]>([]);

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    animCtrlsRef.current.forEach((a) => a.stop());
    animCtrlsRef.current = [];
  }, []);

  useEffect(() => () => clearAll(), [clearAll]);

  const resetDemo = useCallback(() => {
    clearAll();
    setDemoPhase("idle");
    setMetricValues(null);
    setRevealedDays(null);
    setPostStatuses(scheduledPosts.map(() => "Scheduled"));
  }, [clearAll]);

  const triggerDemo = useCallback(() => {
    if (demoPhase === "running") return;
    if (demoPhase === "done") { resetDemo(); return; }

    clearAll();
    setDemoPhase("running");

    // ── Step 1: Count-up metrics from 0 ─────────────────────────────────────
    setMetricValues([0, 0, 0]);

    const ctrls = platforms.map(({ posts }, i) =>
      animate(0, posts, {
        duration: 1.3,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) =>
          setMetricValues((prev) => {
            if (!prev) return prev;
            const next = [...prev];
            next[i] = Math.round(v);
            return next;
          }),
      }),
    );
    animCtrlsRef.current = ctrls;

    // ── Step 2: Populate calendar entries one by one (starts at 1300ms) ─────
    setRevealedDays(new Set()); // clear all events first

    EVENT_DAYS.forEach((day, i) => {
      const t = setTimeout(() => {
        setRevealedDays((prev) => new Set([...(prev ?? []), day]));
      }, 1300 + i * 200);
      timeoutsRef.current.push(t);
    });

    // ── Step 3: Update pipeline status badges (staggered from 2500ms) ────────
    const pipelineStatuses: StatusKey[] = ["Going Live", "Queued", "Synced", "Pending"];
    pipelineStatuses.forEach((status, i) => {
      const t = setTimeout(
        () =>
          setPostStatuses((prev) => {
            const next = [...prev] as StatusKey[];
            next[i] = status;
            return next;
          }),
        2500 + i * 320,
      );
      timeoutsRef.current.push(t);
    });

    // ── Step 4: Mark done ────────────────────────────────────────────────────
    const tDone = setTimeout(() => setDemoPhase("done"), 3600);
    timeoutsRef.current.push(tDone);
  }, [demoPhase, clearAll, resetDemo]);

  const isDemoActive = demoPhase === "running";
  const isDemoLocked = demoPhase !== "idle";
  const isDemo       = demoPhase !== "idle";

  // Which calendar events are currently visible
  const visibleCalendar: Record<number, string> =
    revealedDays === null
      ? calendarEvents
      : Object.fromEntries(
          Object.entries(calendarEvents).filter(([d]) => revealedDays.has(Number(d))),
        );

  // Display values: use animated counters during demo, static otherwise
  const displayPosts = metricValues ?? platforms.map((p) => p.posts);

  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{ background: "var(--bg-page-alt)" }}
    >
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(192,132,252,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* ── Left: content ────────────────────────────────────────────── */}
          <div>
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.65 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5"
              style={{
                background: "rgba(192,132,252,0.12)",
                border: "1px solid rgba(192,132,252,0.35)",
                color: VIOLET,
              }}
            >
              <LayoutDashboard size={11} />
              Omni-Channel Dashboard
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.65 }}
              className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-5"
            >
              Every platform.{" "}
              <span
                style={{
                  background: `linear-gradient(90deg, ${VIOLET}, ${CYAN})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                One command center.
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.65 }}
              className="text-slate-400 text-lg leading-relaxed mb-8"
            >
              Stop jumping between apps. Plan, schedule, and track your content
              across TikTok, Instagram, and YouTube from a single, beautiful
              dashboard.
            </motion.p>

            <motion.ul variants={stagger} className="space-y-4 mb-8">
              {[
                { icon: LayoutDashboard, text: "Unified content calendar across all connected platforms" },
                { icon: Clock,           text: "AI-suggested post times based on your audience activity" },
                { icon: Bell,            text: "Deadline alerts for brand campaign deliverables" },
                { icon: BarChart3,       text: "Real-time cross-platform analytics in one view" },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  variants={fadeUp}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(192,132,252,0.12)",
                      border: "1px solid rgba(192,132,252,0.25)",
                    }}
                  >
                    <item.icon size={15} style={{ color: VIOLET }} />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">
                    {item.text}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            {/* Desktop button — hidden on mobile */}
            <motion.button
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              onClick={triggerDemo}
              disabled={isDemoActive}
              className="hidden lg:flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed"
              style={{
                background: isDemoLocked
                  ? "rgba(192,132,252,0.25)"
                  : "rgba(192,132,252,0.15)",
                border: isDemoLocked
                  ? "1px solid rgba(192,132,252,0.5)"
                  : "1px solid rgba(192,132,252,0.4)",
                color: VIOLET,
                opacity: isDemoActive ? 0.75 : 1,
              }}
            >
              {isDemoActive ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Syncing data...
                </>
              ) : (
                <>
                  Explore the dashboard
                  <ArrowRight size={15} />
                </>
              )}
            </motion.button>
          </div>

          {/* ── Right: Dashboard visual ───────────────────────────────────── */}
          <motion.div variants={fadeUp} transition={{ duration: 0.65 }}>
            <div
              className="rounded-3xl overflow-hidden transition-all duration-500"
              style={{
                background: "var(--bg-card)",
                border: isDemo
                  ? "1px solid rgba(192,132,252,0.35)"
                  : "1px solid var(--border-card-strong)",
                boxShadow: isDemo ? "0 0 48px rgba(192,132,252,0.07)" : "none",
              }}
            >
              {/* Top bar */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid var(--bg-card-hover)" }}
              >
                <span className="text-sm font-semibold text-white">
                  Content Calendar — May 2026
                </span>
                <div className="flex items-center gap-1.5">
                  {platforms.map((p) => (
                    <div
                      key={p.name}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                      style={{
                        background: p.bg,
                        color: p.color,
                        border: `1px solid ${p.border}`,
                      }}
                    >
                      {p.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform metric counters */}
              <div
                className="grid grid-cols-3 gap-px"
                style={{ background: "var(--bg-card-hover)" }}
              >
                {platforms.map((p, i) => (
                  <div
                    key={p.name}
                    className="p-3 text-center"
                    style={{ background: "var(--bg-page-alt)" }}
                  >
                    <div
                      className="text-lg font-bold font-display tabular-nums"
                      style={{ color: p.color }}
                    >
                      {displayPosts[i]}
                    </div>
                    <div className="text-[9px] text-slate-600">posts this month</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{p.name}</div>
                  </div>
                ))}
              </div>

              {/* Mini calendar */}
              <div className="p-5">
                <div className="grid grid-cols-7 gap-0.5 mb-1">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                    <div
                      key={d}
                      className="text-[9px] text-slate-600 text-center py-0.5 font-medium"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-0.5 mb-4">
                  {/* Offset: May 1 2026 is Thursday → 3 empty cells */}
                  {[0, 1, 2].map((i) => <div key={`e${i}`} />)}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                    const eventColor = visibleCalendar[d];
                    return (
                      <div
                        key={d}
                        className="text-center py-1.5 rounded-lg text-[9px] font-medium"
                        style={{
                          background: eventColor ? `${eventColor}22` : "transparent",
                          color: eventColor
                            ? eventColor
                            : "rgba(100,116,139,0.7)",
                          border: eventColor
                            ? `1px solid ${eventColor}40`
                            : "1px solid transparent",
                          transition: "background 0.3s ease, color 0.3s ease, border-color 0.3s ease",
                        }}
                      >
                        {d}
                      </div>
                    );
                  })}
                </div>

                {/* Upcoming posts pipeline */}
                <div
                  style={{
                    borderTop: "1px solid var(--bg-card-hover)",
                    paddingTop: "1rem",
                  }}
                >
                  <div className="text-[11px] font-semibold text-slate-500 mb-2.5">
                    Upcoming posts
                  </div>
                  <div className="space-y-2">
                    {scheduledPosts.map((post, i) => {
                      const status     = postStatuses[i];
                      const styleInfo  = STATUS_STYLE[status];
                      const isLive     = status === "Going Live";
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -12 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="flex items-center gap-3 rounded-xl p-2.5 transition-all hover:bg-white/[0.02]"
                        >
                          <div
                            className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                              background: `${post.color}20`,
                              border: `1px solid ${post.color}35`,
                            }}
                          >
                            <post.icon size={12} style={{ color: post.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-slate-200 font-medium">
                              {post.type}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {post.brand} · {post.platform}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1 text-[10px] text-slate-600">
                              <Clock size={9} />
                              {post.time}
                            </div>
                            {/* Status badge */}
                            <AnimatePresence mode="wait">
                              <motion.span
                                key={`${i}-${status}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.22 }}
                                className="flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full"
                                style={{
                                  background: styleInfo.bg,
                                  color: styleInfo.color,
                                }}
                              >
                                {isLive && (
                                  <span
                                    className="inline-block w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                                    style={{ background: styleInfo.color }}
                                  />
                                )}
                                {status}
                              </motion.span>
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile-only button — appears below the dashboard */}
        <div className="flex lg:hidden mt-6">
          <button
            onClick={triggerDemo}
            disabled={isDemoActive}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed"
            style={{
              background: isDemoLocked
                ? "rgba(192,132,252,0.25)"
                : "rgba(192,132,252,0.15)",
              border: isDemoLocked
                ? "1px solid rgba(192,132,252,0.5)"
                : "1px solid rgba(192,132,252,0.4)",
              color: VIOLET,
              opacity: isDemoActive ? 0.75 : 1,
            }}
          >
            {isDemoActive ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Syncing data...
              </>
            ) : (
              <>
                Explore the dashboard
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
