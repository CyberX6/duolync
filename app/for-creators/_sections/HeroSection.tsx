"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, TrendingUp, DollarSign, Shield, Star, Loader2, CheckCircle2 } from "lucide-react";

const avatarGradients = [
  "from-pink-500 to-rose-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-600",
];

const stats = [
  { value: "50K+", label: "Brand deals posted", icon: DollarSign },
  { value: "Zero", label: "Spam. Ever.", icon: Shield },
  { value: "AI", label: "Matched to you", icon: Zap },
  { value: "4.9★", label: "Creator rating", icon: Star },
];

export function HeroSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "var(--bg-page-alt)" }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-1/4 w-[700px] h-[700px] rounded-full blur-[160px]"
          style={{ background: "radial-gradient(circle, var(--glow-pink) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ background: "radial-gradient(circle, var(--glow-cyan) 0%, transparent 70%)" }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, var(--bg-card-hover) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-8 backdrop-blur-sm"
            style={{ borderColor: "rgba(236,72,153,0.4)", background: "var(--glow-pink)", color: "#f9a8d4" }}
          >
            <Zap size={13} />
            Built for Creators, by Creators
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-bold text-white leading-[1.08] tracking-tight mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            Stop the Noise.{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #f472b6, #c084fc, #67e8f9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Start the Growth.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Tired of fake offers and exhausting DMs? Get curated, high-quality brand deals tailored to your niche — and manage your entire creator career from one place.
          </motion.p>

          {/* Email CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-md mx-auto mb-8"
          >
            {submitted ? (
              <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)" }}>
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                <div className="text-left">
                  <div className="text-white font-semibold text-sm">You&apos;re on the list! 🎉</div>
                  <div className="text-emerald-400 text-xs">We&apos;ll reach out as soon as we launch.</div>
                </div>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    required
                    className="flex-1 px-4 py-3 rounded-xl text-white placeholder:text-slate-600 focus:outline-none transition-all"
                    style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-card-strong)" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(236,72,153,0.5)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-card-strong)"; }}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 shrink-0 transition-all duration-300 hover:opacity-90 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                    style={{ background: "linear-gradient(135deg, #db2777, #9333ea)" }}
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    {isLoading ? "Joining..." : "Join the Waitlist"}
                  </button>
                </form>
                {error && (
                  <p className="mt-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>
                )}
              </>
            )}
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-3 text-sm text-slate-500"
          >
            <div className="flex -space-x-2">
              {avatarGradients.map((g, i) => (
                <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${g} border-2`} style={{ borderColor: "var(--bg-page-alt)" }} />
              ))}
            </div>
            <span>
              <strong className="text-slate-300">8,200+</strong> creators already joined
            </span>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mt-20"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-5 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.03]"
              style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--bg-card-hover)" }}
            >
              <div
                className="text-2xl font-bold font-display mb-1"
                style={{
                  background: "linear-gradient(90deg, #f9a8d4, #c4b5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Problem → Solution visual strip */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14 max-w-2xl mx-auto"
        >
          {/* Before */}
          <div className="flex-1 rounded-2xl px-5 py-4 text-center" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <div className="text-xs font-semibold text-red-500/70 uppercase tracking-widest mb-2">Before</div>
            <div className="space-y-1 text-xs text-slate-500">
              <div className="flex items-center gap-2 justify-center"><span className="text-red-500">✕</span> Spam DMs from random brands</div>
              <div className="flex items-center gap-2 justify-center"><span className="text-red-500">✕</span> Lost emails &amp; missed deals</div>
              <div className="flex items-center gap-2 justify-center"><span className="text-red-500">✕</span> Manual follow-ups everywhere</div>
            </div>
          </div>

          {/* Arrow */}
          <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #db2777, #9333ea)" }}>
            <ArrowRight size={14} className="text-white" />
          </div>

          {/* After */}
          <div className="flex-1 rounded-2xl px-5 py-4 text-center" style={{ background: "var(--glow-emerald)", border: "1px solid rgba(52,211,153,0.15)" }}>
            <div className="text-xs font-semibold text-emerald-500/70 uppercase tracking-widest mb-2">After</div>
            <div className="space-y-1 text-xs text-slate-400">
              <div className="flex items-center gap-2 justify-center"><span className="text-emerald-400">✓</span> Curated deals matching your niche</div>
              <div className="flex items-center gap-2 justify-center"><span className="text-emerald-400">✓</span> One inbox for everything</div>
              <div className="flex items-center gap-2 justify-center"><span className="text-emerald-400">✓</span> AI handles the follow-ups</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
