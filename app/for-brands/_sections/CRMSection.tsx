"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  Database,
  Mail,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  Send,
  Users,
  BarChart3,
  Bell,
  Clock,
  Star,
  ChevronRight,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const creators = [
  { name: "@nova.beauty", platform: "TikTok", followers: "1.8M", status: "Active", statusColor: "#34d399", deals: 3, color: "from-pink-500 to-rose-600" },
  { name: "@style.world", platform: "Instagram", followers: "2.1M", status: "Negotiating", statusColor: "#fcd34d", deals: 1, color: "from-violet-500 to-purple-600" },
  { name: "@fitlife.co", platform: "YouTube", followers: "980K", status: "Pending", statusColor: "#7dd3fc", deals: 0, color: "from-emerald-500 to-teal-600" },
  { name: "@techguru", platform: "TikTok", followers: "560K", status: "Completed", statusColor: "#a78bfa", deals: 5, color: "from-blue-500 to-cyan-500" },
  { name: "@travel.joe", platform: "Instagram", followers: "1.3M", status: "Active", statusColor: "#34d399", deals: 2, color: "from-amber-500 to-orange-500" },
];

const emailTemplate = {
  subject: "Collab opportunity with [BrandName] 🚀",
  body: "Hi {{creator_name}},\n\nWe love your content on {{platform}}! We'd love to collaborate on our upcoming {{campaign_name}} campaign.\n\nYour audience engagement rate of {{eng_rate}} makes you a perfect fit for our brand.\n\nLet's connect →",
};

export function CRMSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "var(--bg-page-alt)" }}>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)" }} />

      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.35)", color: "#7dd3fc" }}>
            <Database size={11} />
            Integrated CRM & Bulk Mailing
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-4">
            One database.{" "}
            <span style={{ background: "linear-gradient(90deg, #7dd3fc, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Infinite reach.
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 max-w-xl mx-auto text-lg">
            Centralize every creator relationship, automate outreach at scale, and track every deal from first contact to payment.
          </motion.p>
        </motion.div>

        {/* Main dashboard mockup */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid lg:grid-cols-3 gap-4"
        >
          {/* CRM Table — 2 cols */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-2 rounded-3xl overflow-hidden"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-card-strong)" }}
          >
            {/* Table toolbar */}
            <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--bg-card-hover)" }}>
              <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl text-xs" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--bg-card-hover)" }}>
                <Search size={12} className="text-slate-600" />
                <span className="text-slate-600">Search creators...</span>
              </div>
              <button className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-xl" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--bg-card-hover)", color: "#64748b" }}>
                <Filter size={11} />
                Filters
              </button>
              <button className="flex items-center gap-1.5 text-[11px] px-3 py-2 rounded-xl font-semibold" style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", color: "#7dd3fc" }}>
                <Mail size={11} />
                Bulk Email
              </button>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-5 gap-2 px-5 py-2 text-[10px] font-medium text-slate-600" style={{ borderBottom: "1px solid var(--bg-card-hover)" }}>
              <span className="col-span-2">Creator</span>
              <span>Platform</span>
              <span>Status</span>
              <span>Deals</span>
            </div>

            {/* Rows */}
            <div className="divide-y" style={{ borderColor: "var(--bg-card-hover)" }}>
              {creators.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="grid grid-cols-5 gap-2 items-center px-5 py-3 transition-all hover:bg-white/[0.02] cursor-pointer group"
                >
                  <div className="col-span-2 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.color} shrink-0`} />
                    <div>
                      <div className="text-sm text-slate-200 font-medium group-hover:text-white transition-colors">{c.name}</div>
                      <div className="text-[10px] text-slate-600">{c.followers}</div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{c.platform}</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full w-fit" style={{ background: `${c.statusColor}18`, color: c.statusColor }}>
                    {c.status}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{c.deals} deals</span>
                    <ChevronRight size={12} className="text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid var(--bg-card-hover)", background: "rgba(255,255,255,0.01)" }}>
              <span className="text-[11px] text-slate-600">128 creators · 24 active campaigns</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  8 Active
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  5 Negotiating
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column: Email + Stats */}
          <div className="space-y-4">
            {/* Bulk email composer */}
            <motion.div
              variants={fadeUp}
              className="rounded-3xl p-5"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-card-strong)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.25)" }}>
                  <Send size={13} style={{ color: "#7dd3fc" }} />
                </div>
                <span className="text-sm font-semibold text-white">Bulk Outreach</span>
              </div>

              {/* Recipients */}
              <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                <span className="text-[10px] text-slate-600">To:</span>
                {["128 creators", "Beauty niche"].map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(56,189,248,0.12)", color: "#7dd3fc", border: "1px solid rgba(56,189,248,0.2)" }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Subject */}
              <div className="text-[11px] text-slate-400 mb-2 px-2 py-1.5 rounded-lg" style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--bg-card-hover)" }}>
                <span className="text-slate-600 text-[9px]">Subject: </span>
                {emailTemplate.subject}
              </div>

              {/* Body preview */}
              <div className="text-[10px] text-slate-500 whitespace-pre-line leading-relaxed mb-3 px-2 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--bg-card-hover)" }}>
                {emailTemplate.body.split("\n").slice(0, 4).join("\n")}
                <span className="text-slate-700">...</span>
              </div>

              {/* Personalization tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {["{{creator_name}}", "{{platform}}", "{{eng_rate}}"].map((tag) => (
                  <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>
                    {tag}
                  </span>
                ))}
                <span className="text-[9px] text-slate-600">auto-filled</span>
              </div>

              <button
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #0891b2, #7c3aed)" }}
              >
                <Send size={12} />
                Send to 128 creators
              </button>
            </motion.div>

            {/* Stats cards */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
              {[
                { icon: Users, value: "128", label: "In database", color: "#a78bfa" },
                { icon: Mail, value: "94%", label: "Open rate", color: "#34d399" },
                { icon: BarChart3, value: "3.8×", label: "Avg. ROI", color: "#38bdf8" },
                { icon: Clock, value: "2.1d", label: "Avg. response", color: "#fcd34d" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 transition-all hover:scale-[1.03]"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)" }}
                >
                  <stat.icon size={14} style={{ color: stat.color }} className="mb-2" />
                  <div className="font-bold text-white text-lg font-display">{stat.value}</div>
                  <div className="text-[10px] text-slate-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Features list below */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
        >
          {[
            { icon: Database, title: "Auto data collection", desc: "AI gathers creator stats, contact info, and history automatically." },
            { icon: Mail, title: "Smart bulk mailing", desc: "Personalized at scale with dynamic variables and A/B testing." },
            { icon: Star, title: "Partnership history", desc: "Track every collaboration, payment, and result in one place." },
            { icon: Bell, title: "Deal pipeline", desc: "Kanban-style deal tracking from first contact to signed agreement." },
          ].map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="p-5 rounded-2xl transition-all hover:scale-[1.02]"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)" }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.2)" }}>
                <f.icon size={16} style={{ color: "#7dd3fc" }} />
              </div>
              <div className="text-sm font-semibold text-white mb-1">{f.title}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
