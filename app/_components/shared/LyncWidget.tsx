"use client";

import {
  useState, useRef, useEffect, useCallback,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles, X, Send, Loader2, Zap, TrendingUp,
  Search, Target, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { lyncChatAction, type LyncMessage } from "@/app/actions/ai";

const GREETING_DISMISSED_KEY = "lync-greeting-dismissed";

// ─── Constants ───────────────────────────────────────────────────────────────

const VIOLET = "#c084fc";
const EMERALD = "#34d399";

const BRAND_CHIPS = [
  { label: "Find creators for my campaign", icon: Search },
  { label: "Best ad format for skincare?", icon: Target },
  { label: "How do I improve my match score?", icon: TrendingUp },
  { label: "Tips for my first campaign", icon: Zap },
];

const CREATOR_CHIPS = [
  { label: "How do I optimize my profile?", icon: Sparkles },
  { label: "Best posting time for TikTok?", icon: TrendingUp },
  { label: "How to land my first brand deal?", icon: Target },
  { label: "Grow from 1K to 10K followers", icon: Zap },
];

const LYNC_INTRO = "Hey! I'm Lync, your AI assistant on Duolync. Ask me anything — growth tips, campaign strategy, creator discovery, or anything else. How can I help?";

// ─── Sub-components ──────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: LyncMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      {!isUser && (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-2 mt-0.5"
          style={{ background: "linear-gradient(135deg, #7c3aed, #c084fc)", flexShrink: 0 }}
        >
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      )}
      <div
        className="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
        style={
          isUser
            ? {
                background: "linear-gradient(135deg, #7c3aed, #c084fc)",
                color: "#fff",
                borderBottomRightRadius: "4px",
              }
            : {
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.92)",
                borderBottomLeftRadius: "4px",
              }
        }
      >
        {msg.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-2">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-2 mt-0.5"
        style={{ background: "linear-gradient(135deg, #7c3aed, #c084fc)", flexShrink: 0 }}
      >
        <Sparkles className="w-3 h-3 text-white" />
      </div>
      <div
        className="rounded-2xl px-4 py-3 flex items-center gap-1"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderBottomLeftRadius: "4px",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{
              background: VIOLET,
              animationDelay: `${i * 0.15}s`,
              animationDuration: "0.9s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main widget ─────────────────────────────────────────────────────────────

export function LyncWidget() {
  const { profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<LyncMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Show greeting bubble once per session, auto-dismiss after 6s
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(GREETING_DISMISSED_KEY)) return;
    const showTimer = setTimeout(() => setShowGreeting(true), 1200);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showGreeting) return;
    const dismissTimer = setTimeout(() => dismissGreeting(), 6000);
    return () => clearTimeout(dismissTimer);
  }, [showGreeting]);

  function dismissGreeting() {
    setShowGreeting(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(GREETING_DISMISSED_KEY, "1");
    }
  }

  function openFromGreeting() {
    dismissGreeting();
    setIsOpen(true);
  }

  const isBrand = profile?.user_type === "brand";
  const chips = isBrand ? BRAND_CHIPS : CREATOR_CHIPS;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: LyncMessage = { role: "user", content: trimmed };
      const updatedMessages = [...messages, userMsg];

      setMessages(updatedMessages);
      setInput("");
      setLoading(true);
      setHasInteracted(true);

      const { reply, error } = await lyncChatAction(updatedMessages, {
        userType: profile?.user_type ?? null,
        userName: profile?.full_name?.split(" ")[0] ?? null,
      });

      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply ?? error ?? "Something went wrong. Please try again.",
        },
      ]);
    },
    [messages, loading, profile]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function clearChat() {
    setMessages([]);
    setHasInteracted(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const showChips = !hasInteracted && messages.length === 0;

  return (
    <div
      className="fixed right-4 lg:right-6 bottom-28 lg:bottom-6 z-50 flex flex-col items-end gap-3"
    >

      {/* ── Expanded panel ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: "rgba(12,10,18,0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(192,132,252,0.28)",
              boxShadow: "0 24px 64px rgba(109,40,217,0.35), 0 0 0 1px rgba(192,132,252,0.08) inset",
              maxHeight: "520px",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{ borderBottom: "1px solid rgba(192,132,252,0.12)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #c084fc)" }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Lync AI</span>
                    <span
                      className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{ background: "rgba(52,211,153,0.12)", color: EMERALD, border: `1px solid ${EMERALD}25` }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: EMERALD, boxShadow: `0 0 4px ${EMERALD}` }}
                      />
                      Active
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-none mt-0.5">
                    {isBrand ? "Brand strategy assistant" : "Creator growth assistant"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors text-[10px] font-medium"
                    title="Clear chat"
                  >
                    ↺
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-colors"
                  aria-label="Close Lync"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0" style={{ maxHeight: "320px" }}>
              {/* Intro message (always shown) */}
              {messages.length === 0 && (
                <MessageBubble msg={{ role: "assistant", content: LYNC_INTRO }} />
              )}

              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
              ))}

              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick action chips */}
            {showChips && (
              <div
                className="px-4 pb-3 shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
              >
                <p className="text-[10px] text-zinc-600 uppercase tracking-wide mb-2 pt-2">Quick actions</p>
                <div className="space-y-1.5">
                  {chips.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      onClick={() => sendMessage(label)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs transition-all group"
                      style={{
                        background: "rgba(192,132,252,0.06)",
                        border: "1px solid rgba(192,132,252,0.12)",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: VIOLET }} />
                      <span className="flex-1 truncate">{label}</span>
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" style={{ color: VIOLET }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input bar */}
            <div
              className="px-3 py-3 shrink-0"
              style={{ borderTop: "1px solid rgba(192,132,252,0.10)" }}
            >
              <div
                className="flex items-end gap-2 rounded-xl px-3 py-2"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(192,132,252,0.18)",
                }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Lync anything…"
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-zinc-600 outline-none leading-relaxed py-0.5"
                  style={{ maxHeight: "80px", minHeight: "22px" }}
                  disabled={loading}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all mb-0.5"
                  style={{
                    background: input.trim() && !loading
                      ? "linear-gradient(135deg, #7c3aed, #c084fc)"
                      : "rgba(255,255,255,0.05)",
                    opacity: input.trim() && !loading ? 1 : 0.4,
                  }}
                  aria-label="Send message"
                >
                  {loading
                    ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                    : <Send className="w-3.5 h-3.5 text-white" />
                  }
                </button>
              </div>
              <p className="text-[10px] text-zinc-700 text-center mt-1.5">↵ to send · Shift+↵ for new line</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Greeting bubble ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showGreeting && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="flex items-end gap-2 max-w-[220px]"
          >
            <div
              className="relative flex-1 rounded-2xl rounded-br-sm px-3.5 py-2.5 text-xs leading-snug font-medium cursor-pointer select-none"
              style={{
                background: "rgba(12,10,18,0.96)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(192,132,252,0.28)",
                boxShadow: "0 8px 32px rgba(109,40,217,0.28)",
                color: "rgba(255,255,255,0.9)",
              }}
              onClick={openFromGreeting}
            >
              <button
                onClick={(e) => { e.stopPropagation(); dismissGreeting(); }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "rgba(39,30,60,0.95)", border: "1px solid rgba(192,132,252,0.25)" }}
                aria-label="Dismiss"
              >
                <X className="w-2.5 h-2.5" style={{ color: "rgba(192,132,252,0.8)" }} />
              </button>
              <span style={{ color: VIOLET }}>👋</span>{" "}
              Hey! I&apos;m <span style={{ color: VIOLET }} className="font-bold">Lync</span> — need help with your{" "}
              {profile?.user_type === "brand" ? "campaign?" : "creator strategy?"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB button ────────────────────────────────────────────────────── */}
      <div className="relative">
        {/* Outer pulse ring — only when closed */}
        {!isOpen && (
          <>
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                background: "rgba(124,58,237,0.35)",
                animationDuration: "2.5s",
              }}
            />
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                background: "rgba(192,132,252,0.2)",
                animationDuration: "2.5s",
                animationDelay: "0.6s",
              }}
            />
          </>
        )}

        <motion.button
          onClick={() => { setIsOpen((v) => !v); dismissGreeting(); }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            background: isOpen
              ? "rgba(30,20,50,0.98)"
              : "linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)",
            border: isOpen
              ? "1.5px solid rgba(192,132,252,0.35)"
              : "1.5px solid rgba(255,255,255,0.15)",
            boxShadow: isOpen
              ? "0 4px 20px rgba(124,58,237,0.3)"
              : "0 8px 32px rgba(109,40,217,0.55), 0 0 0 1px rgba(192,132,252,0.1) inset",
          }}
          aria-label={isOpen ? "Close Lync AI assistant" : "Open Lync AI assistant"}
          aria-expanded={isOpen}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X className="w-5 h-5" style={{ color: VIOLET }} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* "Lync" label tooltip — shows on hover when closed */}
        {!isOpen && (
          <div
            className="absolute bottom-1/2 right-[calc(100%+10px)] translate-y-1/2 pointer-events-none"
            aria-hidden
          >
            <motion.div
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-white whitespace-nowrap"
              style={{
                background: "rgba(12,10,18,0.95)",
                border: "1px solid rgba(192,132,252,0.25)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: EMERALD, boxShadow: `0 0 4px ${EMERALD}` }}
              />
              Lync AI
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
