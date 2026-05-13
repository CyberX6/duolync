"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, TrendingUp, Users, Zap, Clock } from "lucide-react";

const stats = [
  { value: "10M+", label: "Creators indexed", icon: Users },
  { value: "96%", label: "Match accuracy", icon: Sparkles },
  { value: "3.2x", label: "Avg. ROI increase", icon: TrendingUp },
  { value: "48h", label: "Campaign launch", icon: Clock },
];

const avatarGradients = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-orange-600",
];

export function HeroSection() {
  const [email, setEmail] = useState("");

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[var(--bg-page)]">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[700px] h-[700px] rounded-full blur-[140px]" style={{ background: "radial-gradient(circle, var(--glow-purple) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle, var(--glow-cyan) 0%, transparent 70%)" }} />
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
            style={{
              borderColor: "rgba(124,58,237,0.4)",
              background: "var(--glow-purple)",
              color: "#c4b5fd",
            }}
          >
            <Sparkles size={13} />
            AI-Powered Brand Intelligence Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-bold text-white leading-[1.08] tracking-tight mb-6"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            The Smartest Way to{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #a78bfa, #38bdf8, #34d399)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Scale Your Brand
            </span>{" "}
            via Content Creators.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Leverage AI to find your perfect match, manage massive campaigns, and dominate social media.
          </motion.p>

          {/* Email CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8"
          >
            <input
              type="email"
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-white placeholder:text-slate-600 focus:outline-none transition-all"
              style={{
                background: "var(--bg-card-hover)",
                border: "1px solid var(--border-card-strong)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-card-strong)"; }}
            />
            <button
              className="px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 shrink-0 transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}
            >
              Join the Waitlist
              <ArrowRight size={16} />
            </button>
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
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${g} border-2`}
                  style={{ borderColor: "var(--bg-page)" }}
                />
              ))}
            </div>
            <span>
              Join <strong className="text-slate-300">2,400+</strong> brands on the waitlist
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
              style={{
                background: "var(--bg-card-subtle)",
                border: "1px solid var(--bg-card-hover)",
              }}
            >
              <div
                className="text-2xl font-bold font-display mb-1"
                style={{
                  background: "linear-gradient(90deg, #a78bfa, #38bdf8)",
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

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center mt-16"
        >
          <div
            className="flex flex-col items-center gap-1 text-slate-700 animate-bounce"
          >
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-slate-700" />
            <Zap size={12} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
