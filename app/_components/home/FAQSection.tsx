"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { Plus, Minus, Sparkles } from "lucide-react";

const fadeUp: Variants = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };

const PURPLE = "#a78bfa";

const faqs = [
  { question: "What is Talent Trend Spot?", answer: "Talent Trend Spot is a dual-sided AI platform that connects content creators with brands for collaboration opportunities. Our platform uses AI-powered matching to help brands find perfect creators for their campaigns, while giving creators access to exclusive, curated partnership opportunities." },
  { question: "How do I get started as a creator?", answer: "Simply join the wishlist, create your profile, and connect your social accounts. Our AI will start matching you with relevant brand opportunities based on your niche, audience demographics, and engagement metrics — automatically." },
  { question: "Is Talent Trend Spot free to use?", answer: "We offer a free starter tier for both brands and creators with core features included. Premium plans unlock advanced AI tools, priority placement, bulk outreach, and detailed analytics. No credit card required to start." },
  { question: "How does the AI brand-creator matching work?", answer: "Our AI analyzes 200+ data points including audience demographics, engagement quality, content style, brand affinity, and past campaign performance to predict the best matches. It learns continuously from actual campaign results to improve accuracy over time." },
  { question: "What platforms are supported?", answer: "Talent Trend Spot supports all major social platforms: TikTok, YouTube, Instagram, Twitter/X, Twitch, and LinkedIn. You can connect multiple accounts to showcase your full creator portfolio or target creators across all platforms from one dashboard." },
  { question: "How do payments and deals work?", answer: "Brands post offers with budgets. Creators apply or are matched and can accept deals directly. Payments are facilitated securely through the platform — brands release funds from escrow when campaign deliverables are completed." },
  { question: "What kind of brands can use this platform?", answer: "Any brand looking to leverage creator marketing — from funded startups and e-commerce brands to global agencies and Fortune 500 companies. Our tools scale with your budget, whether you're running a $500 micro-campaign or a $500K influencer strategy." },
  { question: "How is my data protected?", answer: "Your personal information is encrypted end-to-end and never sold or shared without explicit consent. We comply with GDPR, CCPA, and all major privacy regulations. Platform security is audited regularly. See our Privacy Policy for full details." },
];

export function FAQSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "var(--bg-page-alt)" }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(124,58,237,0.4), transparent)" }} />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          {/* Left: title */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-4"
          >
            <div className="lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: "var(--glow-purple)", border: "1px solid rgba(124,58,237,0.3)", color: PURPLE }}>
                <Sparkles size={11} />
                FAQ
              </div>
              <h2 className="font-display font-bold text-white text-3xl md:text-4xl leading-tight mb-4">
                Frequently<br />
                <span style={{ background: `linear-gradient(90deg, ${PURPLE}, #67e8f9)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  asked questions
                </span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Can't find your answer? Reach out to our team and we'll get back to you within 24 hours.
              </p>
              <a
                href="/auth"
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium transition-all"
                style={{ color: PURPLE }}
              >
                Contact support →
              </a>
            </div>
          </motion.div>

          {/* Right: accordion */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={stagger}
            className="lg:col-span-8 space-y-2"
          >
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: open === i ? "var(--glow-purple)" : "var(--bg-card)",
                  border: `1px solid ${open === i ? "rgba(124,58,237,0.3)" : "var(--border-card)"}`,
                }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                >
                  <span className={`text-sm font-medium flex-1 transition-colors ${open === i ? "text-white" : "text-slate-300"}`}>
                    {faq.question}
                  </span>
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all"
                    style={{ background: open === i ? "rgba(124,58,237,0.25)" : "var(--bg-card-hover)", border: `1px solid ${open === i ? "rgba(124,58,237,0.4)" : "var(--border-card-strong)"}` }}
                  >
                    {open === i
                      ? <Minus size={12} style={{ color: PURPLE }} />
                      : <Plus size={12} className="text-slate-500" />
                    }
                  </div>
                </button>

                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed" style={{ borderTop: "1px solid var(--bg-card-hover)" }}>
                        <div className="pt-4">{faq.answer}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
