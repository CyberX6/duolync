"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Search, Mail, Database, Brain, Globe, BarChart3, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";

const fadeUp: Variants = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const PURPLE = "#a78bfa";
const CYAN = "#67e8f9";
const PINK = "#f472b6";
const EMERALD = "#34d399";
const AMBER = "#fcd34d";

function GlassCard({ children, className = "", borderColor = "rgba(255,255,255,0.07)", glowColor }: { children: React.ReactNode; className?: string; borderColor?: string; glowColor?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.55 }}
      className={`rounded-3xl p-6 overflow-hidden relative group transition-all duration-500 ${className}`}
      style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${borderColor}`, backdropFilter: "blur(12px)" }}
      whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
    >
      {glowColor && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 0%, ${glowColor} 0%, transparent 65%)` }} />
      )}
      {children}
    </motion.div>
  );
}

export function BentoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "#07080f" }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[160px] pointer-events-none" style={{ background: "rgba(124,58,237,0.05)" }} />

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.55 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", color: PURPLE }}>
            <Sparkles size={11} />
            Platform Capabilities
          </motion.div>
          <motion.h2 variants={fadeUp} transition={{ duration: 0.55 }} className="font-display font-bold text-white text-4xl md:text-5xl mb-4">
            Everything under{" "}
            <span style={{ background: `linear-gradient(90deg, ${PURPLE}, ${CYAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              one roof.
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} transition={{ duration: 0.55 }} className="text-slate-400 max-w-lg mx-auto">
            AI-powered tools for brands and creators — from discovery to deal, all in one seamless platform.
          </motion.p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          style={{ gridAutoRows: "minmax(250px, auto)" }}
        >
          {/* 1: AI Search — wide */}
          <GlassCard className="lg:col-span-2" borderColor={`${PURPLE}28`} glowColor={`${PURPLE}08`}>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3" style={{ background: `${PURPLE}18`, color: PURPLE, border: `1px solid ${PURPLE}30` }}>
              <Search size={11} />AI Influencer Search
            </div>
            <h3 className="font-display font-bold text-white text-xl mb-1">Find creators that actually convert</h3>
            <p className="text-slate-500 text-sm mb-5">Search 10M+ verified creators by niche, platform, engagement rate, and audience demographics.</p>
            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Search size={13} className="text-slate-600" />
              <span className="text-slate-600 text-xs flex-1">Search by niche, hashtag, or platform...</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-medium" style={{ background: `${PURPLE}25`, color: PURPLE }}>AI</span>
            </div>
            <div className="flex gap-3">
              {[
                { label: "Beauty", followers: "2.4M", match: 96, color: "from-pink-500 to-rose-500" },
                { label: "Tech", followers: "1.1M", match: 91, color: "from-violet-500 to-purple-600" },
                { label: "Gaming", followers: "890K", match: 88, color: "from-blue-500 to-cyan-500" },
              ].map((c, i) => (
                <div key={i} className="flex-1 rounded-2xl p-3 transition-all hover:scale-[1.02]" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.color} mb-2`} />
                  <div className="h-1.5 rounded mb-1" style={{ background: "rgba(255,255,255,0.12)", width: "60%" }} />
                  <div className="text-[10px] text-slate-500">{c.followers}</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10px]" style={{ color: PURPLE }}>{c.label}</span>
                    <span className="text-xs font-bold text-emerald-400">{c.match}%</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* 2: Outreach */}
          <GlassCard borderColor={`${CYAN}28`} glowColor={`${CYAN}06`}>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3" style={{ background: `${CYAN}18`, color: CYAN, border: `1px solid ${CYAN}30` }}>
              <Mail size={11} />One-Click Outreach
            </div>
            <h3 className="font-display font-bold text-white text-lg mb-1">Contact at scale</h3>
            <p className="text-slate-500 text-xs mb-4">Personalized bulk emails with AI-generated templates. Auto-follow-up until you get a reply.</p>
            <div className="rounded-xl p-3 space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              {[
                { brand: "Nike Collab", status: "Replied", color: EMERALD },
                { brand: "Glossier", status: "Sent", color: CYAN },
                { brand: "Razer", status: "Pending", color: AMBER },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 shrink-0" />
                  <span className="text-[11px] text-slate-300 flex-1">{item.brand}</span>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: `${item.color}18`, color: item.color }}>{item.status}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* 3: CRM */}
          <GlassCard borderColor={`${EMERALD}28`} glowColor={`${EMERALD}06`}>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3" style={{ background: `${EMERALD}18`, color: EMERALD, border: `1px solid ${EMERALD}30` }}>
              <Database size={11} />Campaign CRM
            </div>
            <h3 className="font-display font-bold text-white text-lg mb-1">Ditch the spreadsheet</h3>
            <p className="text-slate-500 text-xs mb-3">Track every deal, campaign, and payment in one place.</p>
            <div className="space-y-2">
              {[
                { name: "Summer Launch", creators: 8, status: "Active", color: EMERALD },
                { name: "Tech Unboxing", creators: 5, status: "Review", color: CYAN },
                { name: "Spring Collab", creators: 11, status: "Done", color: PURPLE },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="text-[11px] text-slate-300 flex-1 truncate">{c.name}</span>
                  <span className="text-[9px] text-slate-600">{c.creators} creators</span>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: `${c.color}18`, color: c.color }}>{c.status}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* 4: AI Growth — wide */}
          <GlassCard className="lg:col-span-2" borderColor={`${PINK}28`} glowColor={`${PINK}06`}>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3" style={{ background: `${PINK}18`, color: PINK, border: `1px solid ${PINK}30` }}>
              <Brain size={11} />AI Growth Tools
            </div>
            <h3 className="font-display font-bold text-white text-xl mb-1">AI that works for both sides</h3>
            <p className="text-slate-500 text-sm mb-4">Brands get AI campaign strategy. Creators get a personalized growth mentor. Everyone wins.</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-4" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
                <div className="text-[10px] font-semibold mb-2" style={{ color: PURPLE }}>FOR BRANDS</div>
                <div className="space-y-1.5">
                  {["Best ad format for your product", "Top creator matches by ROI", "Campaign calendar automation"].map((t) => (
                    <div key={t} className="flex items-start gap-1.5 text-[10px] text-slate-400">
                      <CheckCircle2 size={9} className="text-violet-400 mt-0.5 shrink-0" />{t}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl p-4" style={{ background: "rgba(244,114,182,0.1)", border: "1px solid rgba(244,114,182,0.2)" }}>
                <div className="text-[10px] font-semibold mb-2" style={{ color: PINK }}>FOR CREATORS</div>
                <div className="space-y-1.5">
                  {["Weekly content optimization tips", "Best post times for your audience", "Deal recommendations by niche"].map((t) => (
                    <div key={t} className="flex items-start gap-1.5 text-[10px] text-slate-400">
                      <CheckCircle2 size={9} className="text-pink-400 mt-0.5 shrink-0" />{t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* 5: Chrome Extension */}
          <GlassCard borderColor={`${AMBER}28`} glowColor={`${AMBER}06`}>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3" style={{ background: `${AMBER}18`, color: AMBER, border: `1px solid ${AMBER}30` }}>
              <Globe size={11} />Chrome Extension
            </div>
            <h3 className="font-display font-bold text-white text-lg mb-1">Scout from anywhere</h3>
            <p className="text-slate-500 text-xs mb-3">Save creators directly from TikTok, Instagram & YouTube — one click, instantly to CRM.</p>
            <div className="rounded-xl overflow-hidden" style={{ background: "#0d0d18", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-1 px-2.5 py-1.5" style={{ background: "#08080e", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
                <div className="flex-1 mx-2 rounded text-[8px] text-slate-600 px-1.5 py-0.5" style={{ background: "rgba(255,255,255,0.04)" }}>tiktok.com/@nova.style</div>
              </div>
              <div className="p-2.5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-1.5 rounded mb-0.5" style={{ background: "rgba(255,255,255,0.15)", width: 50 }} />
                  <div className="text-[8px] text-slate-600">1.8M followers</div>
                </div>
                <button className="px-2 py-1 rounded-lg text-[9px] font-bold text-white" style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}>+Save</button>
              </div>
            </div>
          </GlassCard>

          {/* 6: Analytics */}
          <GlassCard borderColor={`rgba(96,165,250,0.28)`} glowColor={`rgba(96,165,250,0.06)`}>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3" style={{ background: "rgba(96,165,250,0.15)", color: "#93c5fd", border: "1px solid rgba(96,165,250,0.3)" }}>
              <BarChart3 size={11} />Real-Time Analytics
            </div>
            <h3 className="font-display font-bold text-white text-lg mb-1">Performance at a glance</h3>
            <p className="text-slate-500 text-xs mb-3">Live campaign ROI, engagement tracking, and creator performance across all platforms.</p>
            <div className="space-y-2">
              {[
                { label: "Campaign ROI", value: "3.8×", color: EMERALD },
                { label: "Engagement Rate", value: "5.2%", color: "#93c5fd" },
                { label: "Reach", value: "2.8M", color: PURPLE },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-600">{s.label}</div>
                    <div className="h-1.5 rounded-full mt-0.5" style={{ background: "rgba(255,255,255,0.06)", width: 100 }}>
                      <div className="h-1.5 rounded-full" style={{ width: "70%", background: s.color }} />
                    </div>
                  </div>
                  <div className="text-sm font-bold font-display" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
