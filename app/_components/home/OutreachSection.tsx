"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import {
  Mail,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
  Send,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import summerKickoff from "@/assets/Summer Kick-off .png";
import novaBeautyImg from "@/assets/nova.beauty.png";
import techguruImg from "@/assets/techguru.jpg";
import fitlifeImg from "@/assets/fitlife.jpg";
import styleWorldImg from "@/assets/style.world.jpg";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const CYAN = "#67e8f9";
const NOTE_TEXT = "Hey, love your content!";

type DemoPhase = "idle" | "running" | "done";

type OutreachItem = {
  name: string;
  status: string;
  color: string;
  img: StaticImageData;
};

const initialItems: OutreachItem[] = [
  {
    name: "@nova.beauty",
    status: "Opened",
    color: "#fcd34d",
    img: novaBeautyImg,
  },
  { name: "@techguru", status: "Replied", color: "#34d399", img: techguruImg },
  { name: "@fitlife.co", status: "Sent", color: CYAN, img: fitlifeImg },
  {
    name: "@style.world",
    status: "Pending",
    color: "#475569",
    img: styleWorldImg,
  },
];

const demoItems: OutreachItem[] = [
  {
    name: "@nova.beauty",
    status: "Replied",
    color: "#34d399",
    img: novaBeautyImg,
  },
  { name: "@techguru", status: "Replied", color: "#34d399", img: techguruImg },
  { name: "@fitlife.co", status: "Opened", color: "#fcd34d", img: fitlifeImg },
  { name: "@style.world", status: "Sent", color: CYAN, img: styleWorldImg },
];

export function OutreachSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [demoPhase, setDemoPhase] = useState<DemoPhase>("idle");
  const [dealAccepted, setDealAccepted] = useState(false);
  const [acceptPulsing, setAcceptPulsing] = useState(false);
  const [updatedItems, setUpdatedItems] = useState<number[]>([]);
  const [noteText, setNoteText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  // Blinking cursor while typing
  useEffect(() => {
    if (demoPhase !== "running" || noteText.length === 0) {
      setShowCursor(true);
      return;
    }
    const id = setInterval(() => setShowCursor((p) => !p), 530);
    return () => clearInterval(id);
  }, [demoPhase, noteText.length]);

  const resetDemo = useCallback(() => {
    clearTimers();
    setDemoPhase("idle");
    setDealAccepted(false);
    setAcceptPulsing(false);
    setUpdatedItems([]);
    setNoteText("");
    setShowCursor(true);
  }, [clearTimers]);

  const triggerDemo = useCallback(() => {
    if (demoPhase !== "idle") return;

    clearTimers();
    setDemoPhase("running");
    setDealAccepted(false);
    setUpdatedItems([]);
    setNoteText("");

    // Auto-reset after 10 seconds from click
    const tReset = setTimeout(() => resetDemo(), 10000);
    timeoutsRef.current.push(tReset);

    // Step 1: Simulate clicking "Accept Deal" — brief pulse then flip to Accepted
    const tPulse = setTimeout(() => {
      setAcceptPulsing(true);
      const tPulseOff = setTimeout(() => setAcceptPulsing(false), 450);
      timeoutsRef.current.push(tPulseOff);
    }, 250);
    timeoutsRef.current.push(tPulse);

    const tAccept = setTimeout(() => {
      setDealAccepted(true);

      // Step 2: Status badges update one by one with stagger
      [0, 1, 2, 3].forEach((i) => {
        const t = setTimeout(
          () => {
            setUpdatedItems((prev) => [...prev, i]);
          },
          200 + i * 380,
        );
        timeoutsRef.current.push(t);
      });

      // Step 3: Start typing the note after all statuses have updated
      const typingDelay = 200 + 4 * 380 + 300;
      const tType = setTimeout(() => {
        let charIndex = 0;
        intervalRef.current = setInterval(() => {
          charIndex++;
          setNoteText(NOTE_TEXT.slice(0, charIndex));
          if (charIndex >= NOTE_TEXT.length) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            setDemoPhase("done");
          }
        }, 68);
      }, typingDelay);
      timeoutsRef.current.push(tType);
    }, 700);
    timeoutsRef.current.push(tAccept);
  }, [demoPhase, clearTimers, resetDemo]);

  const isDemoActive = demoPhase === "running";
  const isDemoLocked = demoPhase !== "idle";
  const isDemo = demoPhase !== "idle";

  const noteValue =
    demoPhase === "idle"
      ? ""
      : noteText +
        (isDemoActive && noteText.length > 0 && showCursor ? "|" : "");

  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{ background: "var(--bg-page-alt)" }}
    >
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--glow-cyan) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left: Email mockup */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.65 }}
            className="order-2 lg:order-1"
          >
            <div
              className="rounded-3xl overflow-hidden transition-all duration-500"
              style={{
                background: "var(--bg-card)",
                border: isDemo
                  ? "1px solid rgba(6,182,212,0.4)"
                  : "1px solid var(--border-card-strong)",
                boxShadow: isDemo ? "0 0 48px rgba(6,182,212,0.08)" : "none",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center gap-3 px-5 py-4"
                style={{ borderBottom: "1px solid var(--bg-card-hover)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #0891b2)",
                  }}
                >
                  <Mail size={17} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    New Collaboration Invite
                  </div>
                  <div className="text-[11px] text-slate-500">
                    from: partnerships@yourbrand.com
                  </div>
                </div>
                <div
                  className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold"
                  style={{
                    background: "rgba(52,211,153,0.3)",
                    color: "#34d399",
                  }}
                >
                  Sent ✓
                </div>
              </div>

              {/* Campaign brief card */}
              <div className="p-5">
                <div
                  className="rounded-2xl p-4 mb-4 flex items-start gap-4"
                  style={{
                    background: "var(--bg-card-hover)",
                    border: "1px solid var(--border-card)",
                  }}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={summerKickoff}
                      alt="Summer Kick-off"
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 mb-0.5">
                      Campaign Brief
                    </div>
                    <div className="text-sm font-bold text-white">
                      Summer Kick-off &apos;26
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      1× Instagram Reel · 2× Stories · $800 budget
                    </div>
                  </div>
                </div>

                {/* Response buttons */}
                <div className="flex gap-3 mb-5">
                  <motion.button
                    animate={
                      acceptPulsing
                        ? { scale: [1, 0.92, 1.04, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white overflow-hidden"
                    style={{
                      background: dealAccepted
                        ? "linear-gradient(135deg, #059669, #34d399)"
                        : "linear-gradient(135deg, #7c3aed, #0891b2)",
                      transition: "background 0.5s ease",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {dealAccepted ? (
                        <motion.span
                          key="accepted"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.22 }}
                          className="flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 size={14} />
                          Accepted ✓
                        </motion.span>
                      ) : (
                        <motion.span
                          key="accept"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.22 }}
                        >
                          Accept Deal
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  <button
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: "var(--bg-card-hover)",
                      border: "1px solid var(--border-card-strong)",
                      color: "#94a3b8",
                    }}
                  >
                    View Profile
                  </button>
                </div>

                {/* Bulk send preview */}
                <div
                  style={{
                    borderTop: "1px solid var(--bg-card-hover)",
                    paddingTop: "1rem",
                  }}
                >
                  <div className="text-[11px] font-semibold text-slate-500 mb-2.5">
                    Bulk outreach — 48 creators queued
                  </div>
                  <div className="space-y-2">
                    {initialItems.map((item, i) => {
                      const updated = updatedItems.includes(i);
                      const display = updated ? demoItems[i] : item;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="flex items-center gap-2.5"
                        >
                          <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                            <Image
                              src={item.img}
                              alt={item.name}
                              width={24}
                              height={24}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-[11px] text-slate-300 flex-1">
                            {item.name}
                          </span>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={`badge-${i}-${updated ? "updated" : "initial"}`}
                              initial={{ opacity: 0, scale: 0.75 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.75 }}
                              transition={{
                                duration: 0.28,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full"
                              style={{
                                background: `${display.color}15`,
                                color: display.color,
                              }}
                            >
                              {display.status}
                            </motion.div>
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Note input */}
                  <div
                    className="flex items-center gap-2 mt-3 rounded-xl px-3 py-2 transition-all duration-300"
                    style={{
                      background: "var(--bg-card-subtle)",
                      border:
                        isDemoActive && noteText.length > 0
                          ? "1px solid rgba(6,182,212,0.3)"
                          : "1px solid var(--bg-card-hover)",
                    }}
                  >
                    <input
                      value={noteValue}
                      readOnly
                      placeholder="Add a note..."
                      className="flex-1 bg-transparent text-[11px] focus:outline-none placeholder:text-slate-700"
                      style={{ color: noteText ? "#e2e8f0" : undefined }}
                    />
                    <Send
                      size={11}
                      className="transition-colors duration-300"
                      style={{
                        color:
                          isDemoActive && noteText.length > 0
                            ? CYAN
                            : "#475569",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: content */}
          <div className="order-1 lg:order-2">
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.65 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5"
              style={{
                background: "rgba(6,182,212,0.12)",
                border: "1px solid rgba(6,182,212,0.35)",
                color: CYAN,
              }}
            >
              <Mail size={11} />
              One-Click Outreach
            </motion.div>
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.65 }}
              className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-5"
            >
              One-click hellos,{" "}
              <span
                style={{
                  background: `linear-gradient(90deg, ${CYAN}, #a78bfa)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                no more hurdles.
              </span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.65 }}
              className="text-slate-400 text-lg leading-relaxed mb-8"
            >
              Contact hundreds of creators in one click. Our AI personalizes
              every message with creator-specific context, so your outreach
              never feels generic.
            </motion.p>

            <motion.ul variants={stagger} className="space-y-4 mb-8">
              {[
                {
                  icon: Zap,
                  text: "Personalized AI-written emails for every creator — at bulk scale",
                },
                {
                  icon: Clock,
                  text: "Auto-follow-up sequences until they reply — you never miss a deal",
                },
                {
                  icon: CheckCircle2,
                  text: "Track opens, replies, and negotiations in your unified inbox",
                },
                {
                  icon: Send,
                  text: "One-click accept flow for creators — fewer drop-offs, faster deals",
                },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  variants={fadeUp}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(6,182,212,0.12)",
                      border: "1px solid rgba(6,182,212,0.25)",
                    }}
                  >
                    <item.icon size={15} style={{ color: CYAN }} />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">
                    {item.text}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            {/* Desktop button — hidden on mobile */}
            <motion.button
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              onClick={triggerDemo}
              disabled={isDemoLocked}
              className="hidden lg:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed"
              style={{
                background: isDemoLocked
                  ? "rgba(6,182,212,0.25)"
                  : "rgba(6,182,212,0.15)",
                border: isDemoLocked
                  ? "1px solid rgba(6,182,212,0.5)"
                  : "1px solid rgba(6,182,212,0.35)",
                color: CYAN,
                opacity: isDemoLocked ? 0.6 : 1,
              }}
            >
              {isDemoActive ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Running demo...
                </>
              ) : (
                <>
                  Learn about direct contact
                  <ArrowRight size={15} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile-only button — appears below the email mockup */}
        <div className="flex lg:hidden mt-6">
          <button
            onClick={triggerDemo}
            disabled={isDemoLocked}
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed"
            style={{
              background: isDemoLocked
                ? "rgba(6,182,212,0.25)"
                : "rgba(6,182,212,0.15)",
              border: isDemoLocked
                ? "1px solid rgba(6,182,212,0.5)"
                : "1px solid rgba(6,182,212,0.35)",
              color: CYAN,
              opacity: isDemoLocked ? 0.6 : 1,
            }}
          >
            {isDemoActive ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Running demo...
              </>
            ) : (
              <>
                Learn about direct contact
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
