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
  Filter,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  Globe,
  DollarSign,
  Users,
  Loader2,
} from "lucide-react";

const fadeUp: Variants = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const PINK = "#f472b6";
const VIOLET = "#c084fc";

const allNiches = [
  { label: "Beauty",    icon: "💄" },
  { label: "Tech",      icon: "💻" },
  { label: "Gaming",    icon: "🎮" },
  { label: "Fitness",   icon: "💪" },
  { label: "Travel",    icon: "✈️" },
  { label: "Food",      icon: "🍕" },
  { label: "Finance",   icon: "📈" },
  { label: "Fashion",   icon: "👗" },
  { label: "Education", icon: "📚" },
];

type Deal = {
  id: string;
  brand: string;
  niche: string;
  offer: string;
  match: number;
  avatarBg: string;
  avatarColor: string;
  initial: string;
};

const incomingDeals: Deal[] = [
  { id: "gymshark-0", brand: "Gymshark",     niche: "Fitness", offer: "$1,200", match: 97, avatarBg: "#000000", avatarColor: "#ffffff", initial: "G" },
  { id: "charlotte-0", brand: "Charlotte T.", niche: "Beauty",  offer: "$850",   match: 94, avatarBg: "#e8c4d0", avatarColor: "#9b2f4e", initial: "C" },
  { id: "razer-0",    brand: "Razer",         niche: "Gaming",  offer: "$2,100", match: 91, avatarBg: "#1a1a1a", avatarColor: "#44ff00", initial: "R" },
];

const demoDeals: Deal[] = [
  { id: "gymshark-d", brand: "Gymshark",      niche: "Fitness", offer: "$1,200", match: 98, avatarBg: "#000000", avatarColor: "#ffffff", initial: "G" },
  { id: "razer-d",    brand: "Razer",          niche: "Gaming",  offer: "$2,100", match: 96, avatarBg: "#1a1a1a", avatarColor: "#44ff00", initial: "R" },
  { id: "nike-d",     brand: "Nike Training",  niche: "Fitness", offer: "$1,800", match: 93, avatarBg: "#ff6b35", avatarColor: "#ffffff", initial: "N" },
];

type DemoPhase = "idle" | "running" | "done";

// Slider mapping: $500 → 40%, $1,200 → 62%
const SLIDER_FROM = 40;
const SLIDER_TO   = 62;
const OFFER_FROM  = 500;
const OFFER_TO    = 1200;

export function SmartFiltersSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // User-controlled interactive niches
  const [selected, setSelected] = useState<string[]>(["Beauty", "Tech", "Gaming"]);

  // Demo-specific state
  const [demoPhase,    setDemoPhase]    = useState<DemoPhase>("idle");
  const [demoNiches,   setDemoNiches]   = useState<string[] | null>(null);
  const [sliderPct,    setSliderPct]    = useState(SLIDER_FROM);
  const [offerValue,   setOfferValue]   = useState(OFFER_FROM);
  const [showDemoDeals, setShowDemoDeals] = useState(false);

  const timeoutsRef   = useRef<ReturnType<typeof setTimeout>[]>([]);
  const animCtrlRef   = useRef<AnimationPlaybackControls | null>(null);

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    animCtrlRef.current?.stop();
    animCtrlRef.current = null;
  }, []);

  useEffect(() => () => clearAll(), [clearAll]);

  function toggle(niche: string) {
    if (demoPhase !== "idle") return;
    setSelected((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche],
    );
  }

  const resetDemo = useCallback(() => {
    clearAll();
    setDemoPhase("idle");
    setDemoNiches(null);
    setSliderPct(SLIDER_FROM);
    setOfferValue(OFFER_FROM);
    setShowDemoDeals(false);
  }, [clearAll]);

  const triggerDemo = useCallback(() => {
    if (demoPhase === "running") return;
    if (demoPhase === "done") { resetDemo(); return; }

    clearAll();
    setDemoPhase("running");
    setShowDemoDeals(false);

    // ── Step 1: Tag sequence ────────────────────────────────────────────────
    // t=0   → set initial snapshot so there's no visual jump
    setDemoNiches(["Beauty", "Tech", "Gaming"]);

    // t=500 → deactivate Beauty
    const t1 = setTimeout(() => setDemoNiches(["Tech", "Gaming"]), 500);
    timeoutsRef.current.push(t1);

    // t=950 → deactivate Tech, activate Fitness
    const t2 = setTimeout(() => setDemoNiches(["Gaming", "Fitness"]), 950);
    timeoutsRef.current.push(t2);

    // ── Step 2: Slider count-up ($500 → $1,200) at 1150ms ──────────────────
    const t3 = setTimeout(() => {
      animCtrlRef.current = animate(OFFER_FROM, OFFER_TO, {
        duration: 1.1,
        ease: "easeInOut",
        onUpdate: (v) => {
          const rounded = Math.round(v);
          setOfferValue(rounded);
          // Linear interpolation of slider width
          setSliderPct(
            SLIDER_FROM + ((rounded - OFFER_FROM) / (OFFER_TO - OFFER_FROM)) * (SLIDER_TO - SLIDER_FROM),
          );
        },
      });
    }, 1150);
    timeoutsRef.current.push(t3);

    // ── Step 3: Swap deal cards at 2400ms ───────────────────────────────────
    const t4 = setTimeout(() => setShowDemoDeals(true), 2400);
    timeoutsRef.current.push(t4);

    // ── Step 4: Mark done at 2900ms ─────────────────────────────────────────
    const t5 = setTimeout(() => setDemoPhase("done"), 2900);
    timeoutsRef.current.push(t5);
  }, [demoPhase, clearAll, resetDemo]);

  const isDemoActive = demoPhase === "running";
  const isDemoLocked = demoPhase !== "idle";
  const isDemo       = demoPhase !== "idle";

  const activeNiches  = demoNiches ?? selected;
  const currentDeals  = showDemoDeals ? demoDeals : incomingDeals;
  const dealsLabel    = showDemoDeals ? "3 matched" : "3 new";

  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{ background: "var(--bg-page)" }}
    >
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--glow-pink) 0%, transparent 70%)",
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
          {/* ── Left: Dashboard panel ────────────────────────────────────── */}
          <motion.div variants={fadeUp} transition={{ duration: 0.65 }} className="order-2 lg:order-1">
            <div
              className="rounded-3xl overflow-hidden transition-all duration-500"
              style={{
                background: "var(--bg-card)",
                border: isDemo
                  ? "1px solid rgba(244,114,182,0.35)"
                  : "1px solid var(--border-card-strong)",
                boxShadow: isDemo ? "0 0 48px rgba(244,114,182,0.07)" : "none",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center gap-3 px-5 py-4"
                style={{
                  borderBottom: "1px solid var(--bg-card-hover)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(244,114,182,0.15)",
                    border: "1px solid rgba(244,114,182,0.3)",
                  }}
                >
                  <SlidersHorizontal size={15} style={{ color: PINK }} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Deal Preferences</div>
                  <div className="text-[10px] text-slate-500">
                    Customize what lands in your feed
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* Niche tags */}
                <div>
                  <div className="text-xs font-medium text-slate-400 mb-2.5 flex items-center gap-1.5">
                    <Filter size={11} />
                    Filter by Niche
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allNiches.map((n) => {
                      const active = activeNiches.includes(n.label);
                      return (
                        <button
                          key={n.label}
                          onClick={() => toggle(n.label)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-250"
                          style={{
                            background: active ? `${PINK}20` : "var(--bg-card-hover)",
                            border: `1px solid ${active ? `${PINK}45` : "var(--border-card)"}`,
                            color: active ? PINK : "#64748b",
                            cursor: isDemoLocked ? "default" : "pointer",
                          }}
                        >
                          <span>{n.icon}</span>
                          {n.label}
                          <AnimatePresence>
                            {active && (
                              <motion.span
                                key="check"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="flex items-center"
                              >
                                <CheckCircle2 size={10} />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sliders */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Min. Offer — animated */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                        <DollarSign size={11} />
                        Min. Offer
                      </div>
                      <div
                        className="text-xs font-bold tabular-nums"
                        style={{ color: PINK }}
                      >
                        ${offerValue.toLocaleString()}
                      </div>
                    </div>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ background: "var(--border-card-strong)" }}
                    >
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${sliderPct}%`,
                          background: `linear-gradient(90deg, ${PINK}, ${VIOLET})`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-700 mt-1">
                      <span>$0</span>
                      <span>$10K+</span>
                    </div>
                  </div>

                  {/* Min. Followers — static */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                        <Users size={11} />
                        Min. Followers
                      </div>
                      <div className="text-xs font-bold" style={{ color: VIOLET }}>
                        10K
                      </div>
                    </div>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ background: "var(--border-card-strong)" }}
                    >
                      <div
                        className="h-1.5 rounded-full w-1/3"
                        style={{ background: `linear-gradient(90deg, ${VIOLET}, #67e8f9)` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-700 mt-1">
                      <span>1K</span>
                      <span>5M+</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <div className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                    <Globe size={11} />
                    Location / Country
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {["🇺🇸 US", "🇬🇧 UK", "🇩🇪 DE", "🇫🇷 FR", "🇦🇺 AU"].map((loc, i) => (
                      <div
                        key={loc}
                        className="px-2.5 py-1 rounded-lg text-[11px]"
                        style={{
                          background: i < 3 ? "rgba(103,232,249,0.12)" : "var(--bg-card-hover)",
                          border: `1px solid ${i < 3 ? "rgba(103,232,249,0.3)" : "var(--border-card)"}`,
                          color: i < 3 ? "#67e8f9" : "#475569",
                        }}
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid var(--bg-card-hover)" }} />

              {/* Matched deals */}
              <div className="p-5">
                <div className="text-xs font-semibold text-slate-400 mb-3">
                  Matching deals right now —{" "}
                  <span style={{ color: PINK }}>{dealsLabel}</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={showDemoDeals ? "demo-deals" : "initial-deals"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2.5"
                  >
                    {currentDeals.map((deal, i) => (
                      <motion.div
                        key={deal.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.09, duration: 0.28 }}
                        className="flex items-center gap-3 rounded-xl p-3"
                        style={{
                          background: "var(--bg-card-subtle)",
                          border: "1px solid var(--border-card)",
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold"
                          style={{ background: deal.avatarBg, color: deal.avatarColor }}
                        >
                          {deal.initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-slate-200">
                            {deal.brand}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {deal.niche} · {deal.offer}
                          </div>
                        </div>
                        <div className="text-xs font-bold text-emerald-400">
                          {deal.match}%
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Content ───────────────────────────────────────────── */}
          <div className="order-1 lg:order-2">
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.65 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5"
              style={{
                background: "rgba(244,114,182,0.12)",
                border: "1px solid rgba(244,114,182,0.35)",
                color: PINK,
              }}
            >
              <Filter size={11} />
              Smart Filters &amp; Preferences
            </motion.div>

            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.65 }}
              className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-5"
            >
              Only the deals{" "}
              <span
                style={{
                  background: `linear-gradient(90deg, ${PINK}, ${VIOLET})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                worth your time.
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.65 }}
              className="text-slate-400 text-lg leading-relaxed mb-8"
            >
              No more sifting through irrelevant pitches. Set your filters once
              and only receive offers that match your niche, rates, and audience
              — perfectly aligned with your brand.
            </motion.p>

            <motion.ul variants={stagger} className="space-y-4 mb-8">
              {[
                { icon: Filter,       text: "Filter by niche, platform, and audience demographics" },
                { icon: DollarSign,   text: "Set a minimum offer amount — no lowball offers ever reach you" },
                { icon: Globe,        text: "Choose your preferred regions and brand markets" },
                { icon: CheckCircle2, text: "AI re-ranks deals daily based on what performs for your audience" },
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
                      background: "rgba(244,114,182,0.12)",
                      border: "1px solid rgba(244,114,182,0.25)",
                    }}
                  >
                    <item.icon size={15} style={{ color: PINK }} />
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
                  ? "rgba(244,114,182,0.25)"
                  : "rgba(244,114,182,0.15)",
                border: isDemoLocked
                  ? "1px solid rgba(244,114,182,0.5)"
                  : "1px solid rgba(244,114,182,0.4)",
                color: PINK,
                opacity: isDemoActive ? 0.75 : 1,
              }}
            >
              {isDemoActive ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Applying filters...
                </>
              ) : (
                <>
                  Set your preferences
                  <ArrowRight size={15} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile-only button — appears below the dashboard panel */}
        <div className="flex lg:hidden mt-6">
          <button
            onClick={triggerDemo}
            disabled={isDemoActive}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed"
            style={{
              background: isDemoLocked
                ? "rgba(244,114,182,0.25)"
                : "rgba(244,114,182,0.15)",
              border: isDemoLocked
                ? "1px solid rgba(244,114,182,0.5)"
                : "1px solid rgba(244,114,182,0.4)",
              color: PINK,
              opacity: isDemoActive ? 0.75 : 1,
            }}
          >
            {isDemoActive ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Applying filters...
              </>
            ) : (
              <>
                Set your preferences
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
