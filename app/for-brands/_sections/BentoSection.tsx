"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Brain,
  Globe,
  Database,
  Search,
  CheckCircle2,
  Star,
  Mail,
  TrendingUp,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return { ref, isInView };
}

function GlassCard({
  children,
  className = "",
  borderColor = "var(--border-card)",
  glowColor,
}: {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  glowColor?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.6 }}
      className={`rounded-3xl p-6 overflow-hidden relative group transition-all duration-500 ${className}`}
      style={{
        background: "var(--bg-card)",
        border: `1px solid ${borderColor}`,
        backdropFilter: "blur(12px)",
      }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
    >
      {glowColor && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%, ${glowColor} 0%, transparent 70%)` }}
        />
      )}
      {children}
    </motion.div>
  );
}

function FeatureBadge({ color, Icon, label }: { color: string; Icon: React.ElementType; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3" style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
      <Icon size={11} />
      {label}
    </div>
  );
}

export function BentoSection() {
  const { ref, isInView } = useReveal();

  return (
    <section className="py-28 bg-[var(--bg-page)] relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none" style={{ background: "rgba(124,58,237,0.04)" }} />

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: "var(--glow-purple)", border: "1px solid rgba(124,58,237,0.3)", color: "#c4b5fd" }}>
            <Sparkles size={11} />
            Platform Overview
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-display font-bold text-white text-4xl md:text-5xl mb-4">
            Six tools. One platform.{" "}
            <span style={{ background: "linear-gradient(90deg, #a78bfa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Infinite scale.
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 max-w-lg mx-auto">
            Everything a modern brand needs to dominate influencer marketing — powered by AI.
          </motion.p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          style={{ gridAutoRows: "minmax(260px, auto)" }}
        >
          {/* 1 — AI Matching: spans 2 cols */}
          <GlassCard
            className="lg:col-span-2"
            borderColor="rgba(124,58,237,0.25)"
            glowColor="var(--glow-purple)"
          >
            <FeatureBadge color="#a78bfa" Icon={Sparkles} label="AI Smart Matching" />
            <h3 className="font-display font-bold text-white text-xl mb-1">Find your perfect creator in seconds</h3>
            <p className="text-slate-500 text-sm mb-5">AI analyzes 200+ data points — audience demographics, engagement quality, brand affinity — to predict sales success before you commit.</p>

            {/* Creator cards mockup */}
            <div className="flex gap-3 flex-wrap">
              {[
                { match: 96, niche: "Beauty", followers: "2.4M", color: "from-pink-500 to-rose-500", eng: "4.8%" },
                { match: 91, niche: "Lifestyle", followers: "1.1M", color: "from-violet-500 to-purple-600", eng: "6.2%" },
                { match: 88, niche: "Tech", followers: "890K", color: "from-blue-500 to-cyan-500", eng: "5.1%" },
              ].map((c, i) => (
                <div
                  key={i}
                  className="flex-1 min-w-[120px] rounded-2xl p-3 backdrop-blur-sm transition-all duration-300 hover:scale-[1.03]"
                  style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-card-strong)" }}
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${c.color} shrink-0`} />
                    <div className="min-w-0">
                      <div className="h-2 rounded mb-1" style={{ background: "rgba(255,255,255,0.15)", width: "60px" }} />
                      <div className="text-[10px] text-slate-500">{c.followers}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: "rgba(124,58,237,0.2)", color: "#c4b5fd" }}>{c.niche}</span>
                    <span className="text-xs font-bold text-emerald-400">{c.match}%</span>
                  </div>
                  <div className="mt-1.5 text-[10px] text-slate-600">Eng: {c.eng}</div>
                </div>
              ))}
            </div>

            {/* Search bar mockup */}
            <div className="mt-4 flex items-center gap-2 rounded-xl px-3 py-2 text-sm" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-card-strong)" }}>
              <Search size={14} className="text-slate-600 shrink-0" />
              <span className="text-slate-600 text-xs flex-1">Search creators by niche, audience, or platform...</span>
              <div className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded text-[9px]" style={{ background: "rgba(124,58,237,0.2)", color: "#a78bfa" }}>AI</span>
              </div>
            </div>
          </GlassCard>

          {/* 2 — Campaign Calendar */}
          <GlassCard borderColor="rgba(6,182,212,0.25)" glowColor="rgba(6,182,212,0.06)">
            <FeatureBadge color="#67e8f9" Icon={Calendar} label="Campaign Calendar" />
            <h3 className="font-display font-bold text-white text-lg mb-1">Plan at scale</h3>
            <p className="text-slate-500 text-xs mb-3">Multi-creator scheduling, deadline tracking, and "What & When" for every post.</p>

            {/* Mini calendar */}
            <div className="rounded-xl p-3" style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--bg-card-hover)" }}>
              <div className="grid grid-cols-7 gap-0.5 mb-1.5">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div key={i} className="text-[8px] text-slate-700 text-center py-0.5">{d}</div>
                ))}
                {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                  <div
                    key={d}
                    className="text-[8px] text-center py-1 rounded-md transition-all"
                    style={{
                      background: [3, 7, 14, 21].includes(d)
                        ? "rgba(124,58,237,0.5)"
                        : [5, 12, 19].includes(d)
                        ? "rgba(6,182,212,0.4)"
                        : "transparent",
                      color: [3, 7, 14, 21, 5, 12, 19].includes(d) ? "var(--text-base)" : "rgba(100,116,139,0.8)",
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 mt-2">
                {[
                  { color: "#a78bfa", text: "Unboxing — @nova.style" },
                  { color: "#67e8f9", text: "Story collab — @fitlife.co" },
                  { color: "#34d399", text: "Review post — @techguru" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.color }} />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* 3 — AI Ad Strategy */}
          <GlassCard borderColor="rgba(52,211,153,0.25)" glowColor="var(--glow-emerald)">
            <FeatureBadge color="#6ee7b7" Icon={Brain} label="AI Ad Consultant" />
            <h3 className="font-display font-bold text-white text-lg mb-1">AI-crafted ad strategies</h3>
            <p className="text-slate-500 text-xs mb-3">Receive recommendations on the best ad types for maximum ROI.</p>

            {/* Chat mockup */}
            <div className="space-y-2">
              <div
                className="rounded-xl px-3 py-2 text-xs text-slate-300 max-w-[90%]"
                style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-card-strong)" }}
              >
                Best format for a skincare launch on TikTok?
              </div>
              <div
                className="rounded-xl px-3 py-2 text-xs text-white ml-auto max-w-[92%]"
                style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(6,182,212,0.2))", border: "1px solid rgba(52,211,153,0.25)" }}
              >
                <div className="flex items-center gap-1 mb-1">
                  <Sparkles size={9} className="text-emerald-400" />
                  <span className="text-emerald-400 font-semibold text-[10px]">AI Recommendation</span>
                </div>
                <strong>Storytelling (60s reel)</strong> — 3.2× avg ROI. Show before/after with authentic testimonial.
              </div>
              <div
                className="rounded-xl px-3 py-2 text-xs ml-auto max-w-[88%]"
                style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--bg-card-hover)", color: "#94a3b8" }}
              >
                <span className="text-amber-400 font-medium">Also try:</span> Comparison, Unboxing
              </div>
            </div>
          </GlassCard>

          {/* 4 — Chrome Extension */}
          <GlassCard borderColor="rgba(251,191,36,0.22)" glowColor="rgba(251,191,36,0.05)">
            <FeatureBadge color="#fcd34d" Icon={Globe} label="Chrome Extension" />
            <h3 className="font-display font-bold text-white text-lg mb-1">Scout creators anywhere</h3>
            <p className="text-slate-500 text-xs mb-3">Save creators from TikTok, Instagram & YouTube with one click.</p>

            {/* Browser window mockup */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-page-alt)", border: "1px solid var(--border-card-strong)" }}>
              <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: "#080810", borderBottom: "1px solid var(--bg-card-hover)" }}>
                <div className="w-2 h-2 rounded-full bg-red-500/70" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
                <div className="w-2 h-2 rounded-full bg-green-500/70" />
                <div className="flex-1 mx-2 rounded-md px-2 py-0.5 text-[8px] text-slate-600" style={{ background: "var(--bg-card-hover)" }}>
                  tiktok.com/@nova.style
                </div>
              </div>
              <div className="p-3 flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 shrink-0" />
                <div>
                  <div className="h-1.5 rounded mb-1" style={{ background: "rgba(255,255,255,0.18)", width: 56 }} />
                  <div className="text-[9px] text-slate-600">1.8M followers · Beauty</div>
                </div>
                <button
                  className="ml-auto px-2.5 py-1 rounded-lg text-[10px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}
                >
                  + Save
                </button>
              </div>
              {/* Extension popup overlay */}
              <div className="mx-3 mb-3 rounded-xl p-2" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
                <div className="flex items-center gap-1.5 text-[9px] text-violet-300">
                  <CheckCircle2 size={9} />
                  Saved to CRM · View profile →
                </div>
              </div>
            </div>
          </GlassCard>

          {/* 5 — CRM: spans 2 cols */}
          <GlassCard
            className="lg:col-span-2"
            borderColor="rgba(56,189,248,0.22)"
            glowColor="rgba(56,189,248,0.06)"
          >
            <FeatureBadge color="#7dd3fc" Icon={Database} label="CRM & Bulk Outreach" />
            <h3 className="font-display font-bold text-white text-xl mb-1">Mass reach. Zero chaos.</h3>
            <p className="text-slate-500 text-sm mb-5">Centralized creator database with automated outreach, deal tracking, and full campaign history.</p>

            {/* CRM table mockup */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--border-card)" }}>
              {/* Table header */}
              <div className="grid grid-cols-4 gap-2 px-4 py-2 text-[10px] font-medium text-slate-600" style={{ borderBottom: "1px solid var(--bg-card-hover)" }}>
                <span>Creator</span>
                <span>Platform</span>
                <span>Status</span>
                <span>Last Contact</span>
              </div>
              {[
                { name: "@nova.style", platform: "TikTok", status: "Active", statusColor: "#34d399", days: "Today", avatarColor: "from-pink-500 to-rose-500" },
                { name: "@fitlife.co", platform: "Instagram", status: "Negotiating", statusColor: "#fcd34d", days: "2d ago", avatarColor: "from-amber-500 to-orange-500" },
                { name: "@techguru", platform: "YouTube", status: "Pending", statusColor: "#7dd3fc", days: "5d ago", avatarColor: "from-blue-500 to-cyan-500" },
                { name: "@travel.joe", platform: "TikTok", status: "Completed", statusColor: "#a78bfa", days: "1w ago", avatarColor: "from-violet-500 to-purple-600" },
              ].map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 gap-2 px-4 py-2.5 items-center transition-all duration-200 hover:bg-white/[0.02]"
                  style={{ borderBottom: i < 3 ? "1px solid var(--bg-card-hover)" : "none" }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${row.avatarColor} shrink-0`} />
                    <span className="text-xs text-slate-300 truncate">{row.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{row.platform}</span>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full w-fit"
                    style={{ background: `${row.statusColor}18`, color: row.statusColor }}
                  >
                    {row.status}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-600">{row.days}</span>
                    <Mail size={10} className="text-slate-700" />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom action bar */}
            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] text-slate-600">128 creators in database</span>
              <button
                className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ background: "rgba(56,189,248,0.15)", color: "#7dd3fc", border: "1px solid rgba(56,189,248,0.25)" }}
              >
                <Mail size={11} />
                Bulk Email (128)
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
