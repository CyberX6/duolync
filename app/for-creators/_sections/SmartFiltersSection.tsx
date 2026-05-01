"use client";

import { useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Filter, CheckCircle2, ArrowRight, SlidersHorizontal, Globe, DollarSign, Users } from "lucide-react";

const fadeUp: Variants = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const PINK = "#f472b6";
const VIOLET = "#c084fc";

const allNiches = [
  { label: "Beauty", icon: "💄" }, { label: "Tech", icon: "💻" }, { label: "Gaming", icon: "🎮" },
  { label: "Fitness", icon: "💪" }, { label: "Travel", icon: "✈️" }, { label: "Food", icon: "🍕" },
  { label: "Finance", icon: "📈" }, { label: "Fashion", icon: "👗" }, { label: "Education", icon: "📚" },
];

const incomingDeals = [
  { brand: "Nike", niche: "Fitness", offer: "$1,200", match: 97, color: "from-orange-500 to-red-500" },
  { brand: "Glossier", niche: "Beauty", offer: "$850", match: 94, color: "from-pink-400 to-rose-500" },
  { brand: "Razer", niche: "Gaming", offer: "$2,100", match: 91, color: "from-emerald-500 to-teal-600" },
];

export function SmartFiltersSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState<string[]>(["Beauty", "Tech", "Gaming"]);

  function toggle(niche: string) {
    setSelected((prev) => prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]);
  }

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "var(--bg-page)" }}>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--glow-pink) 0%, transparent 70%)" }} />

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left: Visual */}
          <motion.div variants={fadeUp} transition={{ duration: 0.65 }}>
            <div className="rounded-3xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-card-strong)" }}>
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--bg-card-hover)", background: "rgba(255,255,255,0.02)" }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(244,114,182,0.15)", border: "1px solid rgba(244,114,182,0.3)" }}>
                  <SlidersHorizontal size={15} style={{ color: PINK }} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Deal Preferences</div>
                  <div className="text-[10px] text-slate-500">Customize what lands in your feed</div>
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* Niche selector */}
                <div>
                  <div className="text-xs font-medium text-slate-400 mb-2.5 flex items-center gap-1.5">
                    <Filter size={11} />
                    Filter by Niche
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allNiches.map((n) => {
                      const active = selected.includes(n.label);
                      return (
                        <button
                          key={n.label}
                          onClick={() => toggle(n.label)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200"
                          style={{
                            background: active ? `${PINK}20` : "var(--bg-card-hover)",
                            border: `1px solid ${active ? `${PINK}45` : "var(--border-card)"}`,
                            color: active ? PINK : "#64748b",
                          }}
                        >
                          <span>{n.icon}</span>
                          {n.label}
                          {active && <CheckCircle2 size={10} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sliders */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5"><DollarSign size={11} />Min. Offer</div>
                      <div className="text-xs font-bold" style={{ color: PINK }}>$500</div>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "var(--border-card-strong)" }}>
                      <div className="h-1.5 rounded-full w-2/5" style={{ background: `linear-gradient(90deg, ${PINK}, ${VIOLET})` }} />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-700 mt-1"><span>$0</span><span>$10K+</span></div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5"><Users size={11} />Min. Followers</div>
                      <div className="text-xs font-bold" style={{ color: VIOLET }}>10K</div>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "var(--border-card-strong)" }}>
                      <div className="h-1.5 rounded-full w-1/3" style={{ background: `linear-gradient(90deg, ${VIOLET}, #67e8f9)` }} />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-700 mt-1"><span>1K</span><span>5M+</span></div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <div className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5"><Globe size={11} />Location / Country</div>
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

              {/* Matched deals preview */}
              <div className="p-5">
                <div className="text-xs font-semibold text-slate-400 mb-3">
                  Matching deals right now — <span style={{ color: PINK }}>3 new</span>
                </div>
                <div className="space-y-2.5">
                  {incomingDeals.map((deal, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.5 + i * 0.12 }}
                      className="flex items-center gap-3 rounded-xl p-3"
                      style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)" }}
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${deal.color} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-200">{deal.brand}</div>
                        <div className="text-[10px] text-slate-500">{deal.niche} · {deal.offer}</div>
                      </div>
                      <div className="text-xs font-bold text-emerald-400">{deal.match}%</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <div>
            <motion.div variants={fadeUp} transition={{ duration: 0.65 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: "rgba(244,114,182,0.12)", border: "1px solid rgba(244,114,182,0.35)", color: PINK }}>
              <Filter size={11} />
              Smart Filters & Preferences
            </motion.div>
            <motion.h2 variants={fadeUp} transition={{ duration: 0.65 }} className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-5">
              Only the deals{" "}
              <span style={{ background: `linear-gradient(90deg, ${PINK}, ${VIOLET})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                worth your time.
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} transition={{ duration: 0.65 }} className="text-slate-400 text-lg leading-relaxed mb-8">
              No more sifting through irrelevant pitches. Set your filters once and only receive offers that match your niche, rates, and audience — perfectly aligned with your brand.
            </motion.p>

            <motion.ul variants={stagger} className="space-y-4 mb-8">
              {[
                { icon: Filter, text: "Filter by niche, platform, and audience demographics" },
                { icon: DollarSign, text: "Set a minimum offer amount — no lowball offers ever reach you" },
                { icon: Globe, text: "Choose your preferred regions and brand markets" },
                { icon: CheckCircle2, text: "AI re-ranks deals daily based on what performs for your audience" },
              ].map((item, i) => (
                <motion.li key={i} variants={fadeUp} transition={{ duration: 0.5 }} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(244,114,182,0.12)", border: "1px solid rgba(244,114,182,0.25)" }}>
                    <item.icon size={15} style={{ color: PINK }} />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">{item.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.button
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ background: "rgba(244,114,182,0.15)", border: "1px solid rgba(244,114,182,0.4)", color: PINK }}
            >
              Set your preferences
              <ArrowRight size={15} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
