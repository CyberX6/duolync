"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Mail, Zap, Clock, CheckCircle2, ArrowRight, Send } from "lucide-react";
import Image from "next/image";
import novaBeautyImg from "@/assets/nova.beauty.png";
import techguruImg from "@/assets/techguru.jpg";
import fitlifeImg from "@/assets/fitlife.jpg";
import styleWorldImg from "@/assets/style.world.jpg";

const fadeUp: Variants = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const CYAN = "#67e8f9";

export function OutreachSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "var(--bg-page-alt)" }}>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--glow-cyan) 0%, transparent 70%)" }} />

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left: Email mockup */}
          <motion.div variants={fadeUp} transition={{ duration: 0.65 }} className="order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-card-strong)" }}>
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--bg-card-hover)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}>
                  <Mail size={17} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">New Collaboration Invite</div>
                  <div className="text-[11px] text-slate-500">from: partnerships@yourbrand.com</div>
                </div>
                <div className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ background: "rgba(52,211,153,0.3)", color: "#34d399" }}>Sent ✓</div>
              </div>

              {/* Campaign brief card */}
              <div className="p-5">
                <div className="rounded-2xl p-4 mb-4 flex items-start gap-4" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-card)" }}>
                  <div
                    className="w-14 h-14 rounded-xl shrink-0 flex flex-col items-center justify-center relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #1e1a2e, #2a1a3e)", border: "1px solid rgba(251,191,36,0.25)" }}
                  >
                    {/* Subtle glow */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 30%, rgba(251,191,36,0.18) 0%, transparent 70%)" }} />
                    {/* Sun icon */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mb-1 relative z-10">
                      <defs>
                        <linearGradient id="sun-grad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#fcd34d" />
                          <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                      </defs>
                      <circle cx="12" cy="12" r="4" fill="url(#sun-grad)" />
                      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="url(#sun-grad)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className="text-[6px] font-black tracking-widest leading-none uppercase relative z-10" style={{ color: "#fcd34d" }}>SUMMER</span>
                    <span className="text-[5px] font-semibold tracking-widest leading-none mt-0.5 uppercase relative z-10" style={{ color: "rgba(251,191,36,0.5)" }}>'26</span>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 mb-0.5">Campaign Brief</div>
                    <div className="text-sm font-bold text-white">Summer Kick-off '26</div>
                    <div className="text-[11px] text-slate-500 mt-1">1× Instagram Reel · 2× Stories · $800 budget</div>
                  </div>
                </div>

                {/* Response buttons */}
                <div className="flex gap-3 mb-5">
                  <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}>
                    Accept Deal
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-card-strong)", color: "#94a3b8" }}>
                    View Profile
                  </button>
                </div>

                {/* Bulk send preview */}
                <div style={{ borderTop: "1px solid var(--bg-card-hover)", paddingTop: "1rem" }}>
                  <div className="text-[11px] font-semibold text-slate-500 mb-2.5">Bulk outreach — 48 creators queued</div>
                  <div className="space-y-2">
                    {[
                      { name: "@nova.beauty", status: "Opened", color: "#fcd34d", img: novaBeautyImg },
                      { name: "@techguru", status: "Replied", color: "#34d399", img: techguruImg },
                      { name: "@fitlife.co", status: "Sent", color: CYAN, img: fitlifeImg },
                      { name: "@style.world", status: "Pending", color: "#475569", img: styleWorldImg },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-center gap-2.5"
                      >
                        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                          <Image src={item.img} alt={item.name} width={24} height={24} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[11px] text-slate-300 flex-1">{item.name}</span>
                        <div className="flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${item.color}15`, color: item.color }}>
                          {item.status}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-3 rounded-xl px-3 py-2" style={{ background: "var(--bg-card-subtle)", border: "1px solid var(--bg-card-hover)" }}>
                    <input placeholder="Add a note..." className="flex-1 bg-transparent text-[11px] text-slate-600 placeholder:text-slate-700 focus:outline-none" readOnly />
                    <Send size={11} style={{ color: CYAN }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: content */}
          <div className="order-1 lg:order-2">
            <motion.div variants={fadeUp} transition={{ duration: 0.65 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.35)", color: CYAN }}>
              <Mail size={11} />
              One-Click Outreach
            </motion.div>
            <motion.h2 variants={fadeUp} transition={{ duration: 0.65 }} className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-5">
              One-click hellos,{" "}
              <span style={{ background: `linear-gradient(90deg, ${CYAN}, #a78bfa)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                no more hurdles.
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} transition={{ duration: 0.65 }} className="text-slate-400 text-lg leading-relaxed mb-8">
              Contact hundreds of creators in one click. Our AI personalizes every message with creator-specific context, so your outreach never feels generic.
            </motion.p>

            <motion.ul variants={stagger} className="space-y-4 mb-8">
              {[
                { icon: Zap, text: "Personalized AI-written emails for every creator — at bulk scale" },
                { icon: Clock, text: "Auto-follow-up sequences until they reply — you never miss a deal" },
                { icon: CheckCircle2, text: "Track opens, replies, and negotiations in your unified inbox" },
                { icon: Send, text: "One-click accept flow for creators — fewer drop-offs, faster deals" },
              ].map((item, i) => (
                <motion.li key={i} variants={fadeUp} transition={{ duration: 0.5 }} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)" }}>
                    <item.icon size={15} style={{ color: CYAN }} />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">{item.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.a
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              href="/for-brands"
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02]"
              style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.35)", color: CYAN }}
            >
              Learn about direct contact
              <ArrowRight size={15} />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
