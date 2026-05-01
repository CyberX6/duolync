"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Mail, CheckCircle2, ArrowRight, Send, Star, Clock, Paperclip, ChevronRight, Bell } from "lucide-react";

const fadeUp: Variants = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

const CYAN = "#67e8f9";

const emails = [
  { brand: "Nike", subject: "Partnership Opportunity — Q3 Campaign", preview: "Hi! We'd love to collaborate on our upcoming summer...", time: "2m ago", unread: true, tag: "New Deal", tagColor: "#34d399", color: "from-orange-500 to-red-500" },
  { brand: "Glossier", subject: "✓ Contract Signed — Welcome aboard!", preview: "Your partnership agreement has been confirmed. Here's...", time: "1h ago", unread: true, tag: "Active", tagColor: "#67e8f9", color: "from-pink-400 to-rose-500" },
  { brand: "Notion", subject: "Re: Content brief feedback", preview: "Thanks for the revision! The brief looks great. We'll...", time: "3h ago", unread: false, tag: "Follow-up", tagColor: "#fcd34d", color: "from-slate-500 to-slate-700" },
  { brand: "Razer", subject: "Payment processed — $2,100", preview: "Your invoice for the gaming peripheral review has been...", time: "1d ago", unread: false, tag: "Paid", tagColor: "#a78bfa", color: "from-emerald-500 to-teal-600" },
];

const dealPipeline = [
  { label: "Negotiating", count: 3, color: "#fcd34d" },
  { label: "Contract", count: 2, color: "#67e8f9" },
  { label: "In Progress", count: 4, color: "#34d399" },
  { label: "Completed", count: 12, color: "#a78bfa" },
];

export function MailCRMSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "var(--bg-page)" }}>
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(103,232,249,0.07) 0%, transparent 70%)" }} />

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left: Inbox visual */}
          <motion.div variants={fadeUp} transition={{ duration: 0.65 }} className="order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-card-strong)" }}>
              {/* Toolbar */}
              <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid var(--bg-card-hover)" }}>
                <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl text-xs" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-card)" }}>
                  <Mail size={12} className="text-slate-600" />
                  <span className="text-slate-600">Search conversations...</span>
                </div>
                <div className="relative">
                  <Bell size={18} className="text-slate-600" />
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: "#f472b6" }}>2</div>
                </div>
              </div>

              {/* Pipeline bar */}
              <div className="grid grid-cols-4 gap-px px-5 py-3" style={{ borderBottom: "1px solid var(--bg-card-hover)" }}>
                {dealPipeline.map((stage) => (
                  <div key={stage.label} className="text-center">
                    <div className="text-sm font-bold font-display" style={{ color: stage.color }}>{stage.count}</div>
                    <div className="text-[9px] text-slate-600">{stage.label}</div>
                  </div>
                ))}
              </div>

              {/* Email list */}
              <div className="divide-y" style={{ borderColor: "var(--bg-card-hover)" }}>
                {emails.map((email, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex gap-3 px-5 py-3.5 cursor-pointer transition-all hover:bg-white/[0.02] group"
                  >
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${email.color} shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-semibold ${email.unread ? "text-white" : "text-slate-400"}`}>{email.brand}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium shrink-0" style={{ background: `${email.tagColor}18`, color: email.tagColor }}>{email.tag}</span>
                        <span className="text-[9px] text-slate-700 ml-auto shrink-0">{email.time}</span>
                      </div>
                      <div className={`text-xs mb-0.5 ${email.unread ? "text-slate-300 font-medium" : "text-slate-500"}`}>{email.subject}</div>
                      <div className="text-[10px] text-slate-600 truncate">{email.preview}</div>
                    </div>
                    {email.unread && <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: CYAN }} />}
                  </motion.div>
                ))}
              </div>

              {/* Compose bar */}
              <div className="px-5 py-3" style={{ borderTop: "1px solid var(--bg-card-hover)", background: "rgba(255,255,255,0.01)" }}>
                <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "var(--bg-card-hover)", border: "1px solid var(--border-card)" }}>
                  <input placeholder="Reply to Nike..." className="flex-1 bg-transparent text-xs text-slate-400 placeholder:text-slate-600 focus:outline-none" readOnly />
                  <Paperclip size={12} className="text-slate-600" />
                  <button className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #db2777, #9333ea)" }}>
                    <Send size={10} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: content */}
          <div className="order-1 lg:order-2">
            <motion.div variants={fadeUp} transition={{ duration: 0.65 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: "rgba(103,232,249,0.12)", border: "1px solid rgba(103,232,249,0.35)", color: CYAN }}>
              <Mail size={11} />
              Integrated Mail & CRM
            </motion.div>
            <motion.h2 variants={fadeUp} transition={{ duration: 0.65 }} className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-5">
              All your deals.{" "}
              <span style={{ background: `linear-gradient(90deg, ${CYAN}, #c084fc)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                One inbox.
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} transition={{ duration: 0.65 }} className="text-slate-400 text-lg leading-relaxed mb-8">
              No more lost emails. No more missed follow-ups. Every brand conversation, contract, and payment — organized and searchable in one place.
            </motion.p>

            <motion.ul variants={stagger} className="space-y-4 mb-8">
              {[
                { icon: Mail, text: "Unified inbox for all brand communications — across every platform" },
                { icon: Star, text: "Auto-tags deals by stage: Negotiating, Active, Paid, and Completed" },
                { icon: Bell, text: "Smart reminders when brands go quiet — so you never lose a deal" },
                { icon: CheckCircle2, text: "Full partnership history and payment tracking in one timeline" },
              ].map((item, i) => (
                <motion.li key={i} variants={fadeUp} transition={{ duration: 0.5 }} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(103,232,249,0.12)", border: "1px solid rgba(103,232,249,0.25)" }}>
                    <item.icon size={15} style={{ color: CYAN }} />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">{item.text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.button
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:scale-[1.02]"
              style={{ background: "rgba(103,232,249,0.15)", border: "1px solid rgba(103,232,249,0.35)", color: CYAN }}
            >
              See it in action
              <ArrowRight size={15} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
