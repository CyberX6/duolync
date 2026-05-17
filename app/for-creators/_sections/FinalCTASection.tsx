"use client";

import { useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, Zap, Star, Gift, Rocket, Loader2 } from "lucide-react";

const fadeUp: Variants = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const PINK = "#f472b6";
const VIOLET = "#c084fc";
const AMBER = "#fcd34d";
const EMERALD = "#34d399";

const perks = [
  { icon: Zap, text: "First access when we launch" },
  { icon: Star, text: "Free Pro membership for 6 months" },
  { icon: Gift, text: "Exclusive founding creator badge" },
  { icon: Rocket, text: "Priority matching for top brand deals" },
];

const avatarGradients = [
  "from-pink-500 to-rose-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-600",
];

const socialProof = [
  { value: "8,200+", label: "creators joined" },
  { value: "$50K+", label: "deals in the pipeline" },
  { value: "4.9★", label: "avg. creator rating" },
];

export function FinalCTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "creator" }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="py-32 relative overflow-hidden" style={{ background: "var(--bg-page-alt)" }}>
      {/* Dramatic ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full blur-[180px]"
          style={{ background: "radial-gradient(ellipse, rgba(236,72,153,0.15) 0%, rgba(147,51,234,0.08) 50%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle, var(--bg-card-hover) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24" style={{ background: "linear-gradient(to bottom, rgba(236,72,153,0.5), transparent)" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(236,72,153,0.5), transparent)" }} />

      <div className="relative container mx-auto px-4 text-center">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 backdrop-blur-sm" style={{ background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.4)", color: "#f9a8d4" }}>
            <Sparkles size={13} />
            Launching Soon · Limited Creator Spots
          </motion.div>

          {/* Headline */}
          <motion.h2 variants={fadeUp} transition={{ duration: 0.6 }} className="font-display font-bold text-white leading-[1.08] tracking-tight mb-6" style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}>
            Claim your spot in the{" "}
            <span style={{ background: `linear-gradient(90deg, ${PINK}, ${VIOLET}, #67e8f9)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              future of creator marketing.
            </span>
          </motion.h2>

          <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="text-slate-400 text-xl leading-relaxed mb-8 max-w-xl mx-auto">
            Join our exclusive waitlist and be among the first creators to access the platform. Launching very soon — spots are limited.
          </motion.p>

          {/* Social proof row */}
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="flex items-center justify-center gap-6 mb-10">
            {socialProof.map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display font-bold text-white text-lg" style={{ background: `linear-gradient(90deg, ${PINK}, ${VIOLET})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{s.value}</div>
                <div className="text-[10px] text-slate-600">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Perks grid */}
          <motion.div variants={stagger} className="grid sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-10">
            {perks.map((perk, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left"
                style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)" }}
              >
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(236,72,153,0.15)", border: "1px solid rgba(236,72,153,0.25)" }}>
                  <perk.icon size={13} style={{ color: PINK }} />
                </div>
                <span className="text-sm text-slate-300">{perk.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA form */}
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
            {!submitted ? (
              <>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  required
                  className="flex-1 px-5 py-3.5 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none text-sm transition-all"
                  style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-card-strong)" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(236,72,153,0.6)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-card-strong)"; }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="px-7 py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 text-sm transition-all duration-300 hover:opacity-90 hover:scale-[1.02] whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                  style={{ background: "linear-gradient(135deg, #db2777, #9333ea)" }}
                >
                  {isLoading ? <Loader2 size={15} className="animate-spin" /> : <ArrowRight size={16} />}
                  {isLoading ? "Joining..." : "Claim My Spot"}
                </button>
              </form>
              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2 max-w-md mx-auto mb-3">{error}</p>
              )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 max-w-md mx-auto mb-6 px-6 py-4 rounded-2xl"
                style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)" }}
              >
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                <div className="text-left">
                  <div className="text-white font-semibold text-sm">You're in! 🎉</div>
                  <div className="text-emerald-400 text-xs">We'll reach out as soon as we launch. Stay tuned.</div>
                </div>
              </motion.div>
            )}

            {/* Creator avatars */}
            <div className="flex items-center justify-center gap-3 text-sm text-slate-600">
              <div className="flex -space-x-2">
                {avatarGradients.map((g, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full bg-gradient-to-br ${g} border-2`} style={{ borderColor: "var(--bg-page-alt)" }} />
                ))}
              </div>
              <span>
                <strong className="text-slate-400">8,200+</strong> creators already on the list
              </span>
            </div>
          </motion.div>

          {/* Bottom separator */}
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="mt-20 flex items-center gap-4">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, var(--border-card))" }} />
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Sparkles size={12} className="text-pink-900" />
              Duolync — Built for Creators
            </div>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, var(--border-card))" }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
