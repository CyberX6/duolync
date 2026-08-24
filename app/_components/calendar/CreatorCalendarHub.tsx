"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Brain,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  Film,
  Lightbulb,
  Loader2,
  Maximize2,
  Pencil,
  Plus,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Design tokens ─────────────────────────────────────────────────────────────
const VIOLET = "#c084fc";
const EMERALD = "#34d399";

// ── Types ─────────────────────────────────────────────────────────────────────

type ContentStatus = "IDEA" | "SCRIPTING" | "FILMING" | "READY" | "PUBLISHED";
type EventType = "POST" | "STORY" | "MEETING" | "DEADLINE" | "CUSTOM";
type Platform = "youtube" | "instagram" | "tiktok" | "twitter" | "linkedin";
type DotColor = "red" | "blue" | "yellow" | "green" | "purple";

interface LocalEvent {
  id: string;
  calendarId: string;
  title: string;
  description: string;
  type: EventType;
  platform: Platform | "";
  status: ContentStatus;
  color: DotColor;
  date: string;
  time: string;
  notes: string;
}

interface UserCalendar {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DOT_COLOR_MAP: Record<DotColor, string> = {
  red: "#f87171",
  blue: "#60a5fa",
  yellow: "#fbbf24",
  green: "#34d399",
  purple: "#c084fc",
};

const CONTENT_STATUSES: {
  id: ContentStatus;
  label: string;
  emoji: string;
  color: string;
  bg: string;
}[] = [
  { id: "IDEA", label: "Idea", emoji: "💡", color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  { id: "SCRIPTING", label: "Scripting", emoji: "📝", color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  { id: "FILMING", label: "Filming", emoji: "🎬", color: "#f472b6", bg: "rgba(244,114,182,0.12)" },
  { id: "READY", label: "Ready", emoji: "⏳", color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  { id: "PUBLISHED", label: "Published", emoji: "✅", color: "#34d399", bg: "rgba(52,211,153,0.12)" },
];

const EVENT_TYPES: { id: EventType; label: string; icon: string }[] = [
  { id: "POST", label: "Post", icon: "🖼️" },
  { id: "STORY", label: "Story", icon: "⚡" },
  { id: "MEETING", label: "Meeting", icon: "🤝" },
  { id: "DEADLINE", label: "Deadline", icon: "🔔" },
  { id: "CUSTOM", label: "Custom", icon: "✨" },
];

const PLATFORMS: { id: Platform; label: string; color: string }[] = [
  { id: "youtube", label: "YouTube", color: "#f87171" },
  { id: "instagram", label: "Instagram", color: "#c084fc" },
  { id: "tiktok", label: "TikTok", color: "#f472b6" },
  { id: "twitter", label: "X / Twitter", color: "#60a5fa" },
  { id: "linkedin", label: "LinkedIn", color: "#0ea5e9" },
];

const DOT_COLORS: { id: DotColor; label: string }[] = [
  { id: "purple", label: "Purple" },
  { id: "blue", label: "Blue" },
  { id: "green", label: "Green" },
  { id: "yellow", label: "Yellow" },
  { id: "red", label: "Red" },
];

const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const MAX_CALENDARS = 5;

const DEFAULT_CALENDARS: UserCalendar[] = [
  { id: "cal-1", name: "Content Hub", color: "#c084fc", emoji: "✨" },
];

const AI_INSIGHTS: Record<Platform, { time: string; reason: string }> = {
  tiktok: { time: "Tuesday 7:00 PM", reason: "Peak engagement for short-form video content" },
  instagram: { time: "Wednesday 11:00 AM", reason: "Highest story views mid-week mornings" },
  youtube: { time: "Saturday 2:00 PM", reason: "Weekend afternoon drives 3x more watch time" },
  twitter: { time: "Thursday 9:00 AM", reason: "Professional audience peaks before lunch" },
  linkedin: { time: "Tuesday 10:00 AM", reason: "B2B audience most active early week" },
};

const GENERIC_INSIGHTS = [
  "🔥 TikTok: Best to post Tue–Thu between 6–9 PM for maximum reach.",
  "📸 Instagram Reels get 2x more engagement when posted Wed–Fri at 11 AM.",
  "🎬 YouTube Shorts perform best on Saturday afternoons (2–4 PM).",
  "🐦 Twitter/X sees peak brand interaction at 9 AM weekdays.",
  "💼 LinkedIn posts scheduled for Tues/Wed mornings outperform by 40%.",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;
  return { startOffset, daysInMonth };
}

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initial;
    } catch {
      return initial;
    }
  });

  const setAndPersist = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
        try { window.localStorage.setItem(key, JSON.stringify(next)); } catch { /* noop */ }
        return next;
      });
    },
    [key],
  );

  return [state, setAndPersist];
}

// ── Day Event Modal ───────────────────────────────────────────────────────────

interface DayModalProps {
  date: string;
  calendarId: string;
  events: LocalEvent[];
  onClose: () => void;
  onSave: (event: LocalEvent) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ContentStatus) => void;
  editingEvent?: LocalEvent | null;
}

function DayModal({
  date,
  calendarId,
  events,
  onClose,
  onSave,
  onDelete,
  onStatusChange,
  editingEvent,
}: DayModalProps) {
  const [mode, setMode] = useState<"list" | "form">(editingEvent ? "form" : "list");
  const [draft, setDraft] = useState<LocalEvent>(
    editingEvent ?? {
      id: genId(),
      calendarId,
      title: "",
      description: "",
      type: "POST",
      platform: "instagram",
      status: "IDEA",
      color: "purple",
      date,
      time: "12:00",
      notes: "",
    },
  );
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const displayDate = useMemo(() => {
    const [y, m, d] = date.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, [date]);

  const getAiInsight = () => {
    setAiLoading(true);
    setAiSuggestion(null);
    setTimeout(() => {
      const platform = draft.platform as Platform;
      const insight = platform && AI_INSIGHTS[platform]
        ? `Best time for ${PLATFORMS.find((p) => p.id === platform)?.label}: ${AI_INSIGHTS[platform].time}. ${AI_INSIGHTS[platform].reason}.`
        : GENERIC_INSIGHTS[Math.floor(Math.random() * GENERIC_INSIGHTS.length)];
      setAiSuggestion(insight);
      setAiLoading(false);
    }, 1400);
  };

  const handleSave = () => {
    if (!draft.title.trim()) return;
    onSave({ ...draft });
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-lg rounded-3xl overflow-hidden flex flex-col"
        style={{
          background: "linear-gradient(160deg, rgba(18,18,30,0.98) 0%, rgba(9,9,15,0.99) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(192,132,252,0.08)",
          maxHeight: "90svh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div
          className="px-6 pt-5 pb-4 flex items-start justify-between"
          style={{
            background: "linear-gradient(160deg, rgba(192,132,252,0.08) 0%, transparent 70%)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold mb-2"
              style={{
                background: "rgba(192,132,252,0.12)",
                color: VIOLET,
                border: "1px solid rgba(192,132,252,0.25)",
              }}
            >
              <CalendarDays className="w-3 h-3" />
              {displayDate}
            </div>
            <h2 className="text-lg font-bold text-white">
              {mode === "form" ? (editingEvent ? "Edit Event" : "New Event") : "Day Events"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {mode === "list" && (
              <button
                type="button"
                onClick={() => {
                  setDraft({
                    id: genId(),
                    calendarId,
                    title: "",
                    description: "",
                    type: "POST",
                    platform: "instagram",
                    status: "IDEA",
                    color: "purple",
                    date,
                    time: "12:00",
                    notes: "",
                  });
                  setMode("form");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                style={{ background: VIOLET }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-y-auto">
          {mode === "list" ? (
            <div className="p-5 space-y-2">
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: "rgba(192,132,252,0.08)", border: "1px solid rgba(192,132,252,0.15)" }}
                  >
                    <CalendarDays className="w-5 h-5" style={{ color: VIOLET }} />
                  </div>
                  <p className="text-sm text-zinc-400">Nothing scheduled yet.</p>
                  <p className="text-xs text-zinc-600 mt-1">Tap Add to create your first event.</p>
                </div>
              ) : (
                events.map((ev) => {
                  const dotColor = DOT_COLOR_MAP[ev.color];
                  const statusInfo = CONTENT_STATUSES.find((s) => s.id === ev.status);
                  const platformInfo = PLATFORMS.find((p) => p.id === ev.platform);
                  return (
                    <div
                      key={ev.id}
                      className="rounded-2xl p-4 flex items-start gap-3"
                      style={{
                        background: `${dotColor}08`,
                        border: `1px solid ${dotColor}25`,
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full mt-1 shrink-0"
                        style={{ background: dotColor, boxShadow: `0 0 6px ${dotColor}80` }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{ev.title}</p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {statusInfo && (
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: statusInfo.bg, color: statusInfo.color }}
                            >
                              {statusInfo.emoji} {statusInfo.label}
                            </span>
                          )}
                          {platformInfo && (
                            <span
                              className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                              style={{ background: `${platformInfo.color}15`, color: platformInfo.color }}
                            >
                              {platformInfo.label}
                            </span>
                          )}
                          {ev.time && (
                            <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {ev.time}
                            </span>
                          )}
                        </div>
                        {/* Quick status change */}
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          {CONTENT_STATUSES.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => onStatusChange(ev.id, s.id)}
                              className={cn(
                                "text-[8px] px-1.5 py-0.5 rounded-full transition-all",
                                ev.status === s.id ? "font-bold" : "opacity-40 hover:opacity-70",
                              )}
                              style={{
                                background: ev.status === s.id ? s.bg : "transparent",
                                color: s.color,
                                border: `1px solid ${s.color}30`,
                              }}
                            >
                              {s.emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setDraft(ev);
                            setMode("form");
                          }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(ev.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="p-5 space-y-5">
              {/* Event type */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Event Type
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {EVENT_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, type: t.id }))}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl p-2 transition-all border text-center",
                        draft.type === t.id
                          ? "border-violet-500/50 bg-violet-500/10"
                          : "border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02]",
                      )}
                    >
                      <span className="text-lg leading-none">{t.icon}</span>
                      <span
                        className="text-[9px] font-semibold"
                        style={{ color: draft.type === t.id ? VIOLET : "rgba(161,161,170,0.8)" }}
                      >
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  placeholder="e.g. Summer skincare routine..."
                  className="w-full h-10 rounded-xl px-3 text-sm text-white placeholder:text-zinc-700 outline-none transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  maxLength={120}
                />
              </div>

              {/* Platform + Time row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Platform
                  </label>
                  <select
                    value={draft.platform}
                    onChange={(e) => setDraft((d) => ({ ...d, platform: e.target.value as Platform }))}
                    className="w-full h-10 rounded-xl px-3 text-sm text-white outline-none transition-colors appearance-none"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <option value="">None</option>
                    {PLATFORMS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Time
                  </label>
                  <input
                    type="time"
                    value={draft.time}
                    onChange={(e) => setDraft((d) => ({ ...d, time: e.target.value }))}
                    className="w-full h-10 rounded-xl px-3 text-sm text-white outline-none transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  />
                </div>
              </div>

              {/* Content Pipeline Status */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Pipeline Status
                </label>
                <div className="flex gap-2 flex-wrap">
                  {CONTENT_STATUSES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, status: s.id }))}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border"
                      style={{
                        background: draft.status === s.id ? s.bg : "rgba(255,255,255,0.02)",
                        color: draft.status === s.id ? s.color : "rgba(161,161,170,0.6)",
                        border: draft.status === s.id
                          ? `1px solid ${s.color}40`
                          : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {s.emoji} {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color / Priority */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Priority Color
                </label>
                <div className="flex gap-2">
                  {DOT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, color: c.id }))}
                      title={c.label}
                      className="w-7 h-7 rounded-full transition-all"
                      style={{
                        background: DOT_COLOR_MAP[c.id],
                        boxShadow:
                          draft.color === c.id
                            ? `0 0 0 2px rgba(0,0,0,0.5), 0 0 0 4px ${DOT_COLOR_MAP[c.id]}`
                            : "none",
                        transform: draft.color === c.id ? "scale(1.2)" : "scale(1)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Description / Notes
                </label>
                <textarea
                  value={draft.notes}
                  onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                  placeholder="Script draft, ideas, links, notes..."
                  rows={3}
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-700 outline-none transition-colors resize-none"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
              </div>

              {/* Lync AI Insights */}
              <div
                className="rounded-2xl p-4 space-y-3"
                style={{
                  background: "linear-gradient(135deg, rgba(52,211,153,0.06), rgba(192,132,252,0.06))",
                  border: "1px solid rgba(52,211,153,0.2)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(52,211,153,0.12)" }}
                    >
                      <Brain className="w-3.5 h-3.5" style={{ color: EMERALD }} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: EMERALD }}>
                      Lync AI Insights
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={getAiInsight}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all disabled:opacity-60"
                    style={{
                      background: "rgba(52,211,153,0.12)",
                      color: EMERALD,
                      border: "1px solid rgba(52,211,153,0.25)",
                    }}
                  >
                    {aiLoading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    {aiLoading ? "Analyzing..." : "Optimize Time"}
                  </button>
                </div>

                {aiSuggestion ? (
                  <div
                    className="rounded-xl p-3 text-xs text-zinc-300 leading-relaxed"
                    style={{
                      background: "rgba(52,211,153,0.06)",
                      border: "1px solid rgba(52,211,153,0.15)",
                    }}
                  >
                    <TrendingUp className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" style={{ color: EMERALD }} />
                    {aiSuggestion}
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-600">
                    Get AI-powered optimal posting times based on platform engagement patterns.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div
          className="px-5 py-4 flex gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {mode === "form" ? (
            <>
              <button
                type="button"
                onClick={() => (editingEvent ? onClose() : setMode("list"))}
                className="flex-1 h-10 rounded-xl text-sm font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {editingEvent ? "Cancel" : "Back"}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!draft.title.trim()}
                className="flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                style={{ background: VIOLET }}
              >
                <Sparkles className="w-3.5 h-3.5 inline mr-1.5 mb-0.5" />
                {editingEvent ? "Save Changes" : "Create Event"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl text-sm font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Calendar Management Modal ─────────────────────────────────────────────────

function CalendarManagerModal({
  calendars,
  onAdd,
  onRename,
  onDelete,
  onClose,
}: {
  calendars: UserCalendar[];
  onAdd: (cal: UserCalendar) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  const CALENDAR_EMOJIS = ["📅", "🎬", "📸", "🎵", "🌟", "🔥", "💡", "🚀"];
  const CALENDAR_COLORS = ["#c084fc", "#f472b6", "#60a5fa", "#34d399", "#fbbf24"];

  const handleAdd = () => {
    if (!newName.trim() || calendars.length >= MAX_CALENDARS) return;
    const idx = calendars.length % CALENDAR_COLORS.length;
    onAdd({
      id: genId(),
      name: newName.trim(),
      color: CALENDAR_COLORS[idx],
      emoji: CALENDAR_EMOJIS[idx],
    });
    setNewName("");
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: "#09090f",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.7)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 pt-5 pb-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <h2 className="text-base font-bold text-white">My Calendars</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{calendars.length}/{MAX_CALENDARS} calendars</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Calendars list */}
        <div className="p-5 space-y-2 max-h-64 overflow-y-auto">
          {calendars.map((cal) => (
            <div
              key={cal.id}
              className="flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-base">{cal.emoji}</span>
              {editingId === cal.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onRename(cal.id, editName.trim() || cal.name);
                      setEditingId(null);
                    }
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                  className="flex-1 bg-transparent text-sm text-white outline-none border-b border-violet-500/60 pb-0.5"
                />
              ) : (
                <span className="flex-1 text-sm font-medium text-zinc-200 truncate">{cal.name}</span>
              )}
              <div className="flex gap-1">
                {editingId === cal.id ? (
                  <button
                    type="button"
                    onClick={() => {
                      onRename(cal.id, editName.trim() || cal.name);
                      setEditingId(null);
                    }}
                    className="text-[10px] px-2 py-1 rounded-lg text-emerald-400 hover:bg-emerald-500/15 transition-colors"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setEditingId(cal.id); setEditName(cal.name); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
                {calendars.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onDelete(cal.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add new calendar */}
        <div
          className="px-5 pb-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {calendars.length >= MAX_CALENDARS ? (
            <div
              className="mt-4 rounded-2xl p-3 text-center text-xs"
              style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24" }}
            >
              ⚠️ Maximum of {MAX_CALENDARS} calendars reached. Delete one to add a new calendar.
            </div>
          ) : (
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
                placeholder='e.g. "TikTok Reels"'
                className="flex-1 h-10 rounded-xl px-3 text-sm text-white placeholder:text-zinc-700 outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                maxLength={40}
              />
              <button
                type="button"
                onClick={handleAdd}
                disabled={!newName.trim()}
                className="h-10 px-4 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
                style={{ background: VIOLET }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function CreatorCalendarHub() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [calendars, setCalendars] = useLocalStorage<UserCalendar[]>(
    "nexly:calendars",
    DEFAULT_CALENDARS,
  );
  const [events, setEvents] = useLocalStorage<LocalEvent[]>("nexly:calendar-events", []);
  const [scratchpad, setScratchpad] = useLocalStorage<string>("nexly:scratchpad", "");
  const [activeCalendarId, setActiveCalendarId] = useState<string>(calendars[0]?.id ?? "cal-1");
  const [dayModalDate, setDayModalDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<LocalEvent | null>(null);
  const [showCalManager, setShowCalManager] = useState(false);
  const [scratchpadExpanded, setScratchpadExpanded] = useState(false);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const { startOffset, daysInMonth } = getMonthGrid(year, month);
  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Keep activeCalendarId in sync if the active calendar gets deleted
  useEffect(() => {
    if (!calendars.find((c) => c.id === activeCalendarId)) {
      setActiveCalendarId(calendars[0]?.id ?? "");
    }
  }, [calendars, activeCalendarId]);

  // ── Derived ────────────────────────────────────────────────────────────────

  const activeCalendar = calendars.find((c) => c.id === activeCalendarId);

  const monthEvents = useMemo(() => {
    return events.filter((e) => {
      if (e.calendarId !== activeCalendarId) return false;
      const [ey, em] = e.date.split("-").map(Number);
      return em - 1 === month && ey === year;
    });
  }, [events, activeCalendarId, month, year]);

  const eventsByDay = useMemo(() => {
    const map: Record<number, LocalEvent[]> = {};
    for (const ev of monthEvents) {
      const day = parseInt(ev.date.split("-")[2], 10);
      if (!map[day]) map[day] = [];
      map[day].push(ev);
    }
    return map;
  }, [monthEvents]);

  const pipelineCounts = useMemo(() => {
    const counts: Record<ContentStatus, number> = {
      IDEA: 0, SCRIPTING: 0, FILMING: 0, READY: 0, PUBLISHED: 0,
    };
    for (const ev of monthEvents) counts[ev.status]++;
    return counts;
  }, [monthEvents]);

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setEditingEvent(null);
    setDayModalDate(dateStr);
  };

  const handleSaveEvent = (event: LocalEvent) => {
    setEvents((prev) => {
      const existing = prev.findIndex((e) => e.id === event.id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = event;
        return next;
      }
      return [...prev, event];
    });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleStatusChange = (id: string, status: ContentStatus) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const handleAddCalendar = (cal: UserCalendar) => {
    setCalendars((prev) => [...prev, cal]);
    setActiveCalendarId(cal.id);
  };

  const handleRenameCalendar = (id: string, name: string) => {
    setCalendars((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  };

  const handleDeleteCalendar = (id: string) => {
    setCalendars((prev) => prev.filter((c) => c.id !== id));
    setEvents((prev) => prev.filter((e) => e.calendarId !== id));
    if (activeCalendarId === id) {
      const remaining = calendars.filter((c) => c.id !== id);
      setActiveCalendarId(remaining[0]?.id ?? "");
    }
  };

  const dayModalEvents = dayModalDate
    ? events.filter(
        (e) => e.calendarId === activeCalendarId && e.date === dayModalDate,
      )
    : [];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <div
        className="rounded-3xl overflow-hidden flex flex-col"
        style={{
          background: "linear-gradient(160deg, rgba(18,18,28,0.98) 0%, rgba(9,9,15,0.99) 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 0 0 1px rgba(192,132,252,0.04), 0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* ── Calendar Tabs ─────────────────────────────────────────────── */}
        <div
          className="flex items-center gap-0 overflow-x-auto"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-1 px-3 py-2.5 flex-1 min-w-0 overflow-x-auto">
            {calendars.map((cal) => (
              <button
                key={cal.id}
                type="button"
                onClick={() => setActiveCalendarId(cal.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0"
                style={{
                  background: activeCalendarId === cal.id
                    ? `${cal.color}18`
                    : "transparent",
                  color: activeCalendarId === cal.id ? cal.color : "rgba(161,161,170,0.6)",
                  border: activeCalendarId === cal.id
                    ? `1px solid ${cal.color}35`
                    : "1px solid transparent",
                }}
              >
                <span>{cal.emoji}</span>
                <span className="max-w-24 truncate">{cal.name}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 px-2 py-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowCalManager(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-colors"
              title="Manage calendars"
            >
              <Plus className="w-3 h-3" />
              <span className="hidden sm:inline">Manage</span>
            </button>
          </div>
        </div>

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${activeCalendar?.color ?? VIOLET}15` }}
            >
              <CalendarDays className="w-3.5 h-3.5" style={{ color: activeCalendar?.color ?? VIOLET }} />
            </div>
            <span className="text-sm font-bold text-white truncate">{monthLabel}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Legend */}
            <div className="hidden md:flex items-center gap-3 mr-2">
              {(["POST", "MEETING", "DEADLINE"] as const).map((t) => {
                const info = EVENT_TYPES.find((e) => e.id === t);
                return (
                  <span key={t} className="flex items-center gap-1 text-[10px] text-zinc-500">
                    <span>{info?.icon}</span>
                    {info?.label}
                  </span>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="p-1.5 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="p-1.5 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Pipeline KPI strip ────────────────────────────────────────── */}
        <div
          className="grid grid-cols-5 divide-x"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            borderColor: "rgba(255,255,255,0.04)",
          }}
        >
          {CONTENT_STATUSES.map((s) => (
            <div
              key={s.id}
              className="flex flex-col items-center py-2.5 px-1"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              <span className="text-base leading-none mb-1">{s.emoji}</span>
              <span className="text-sm font-bold" style={{ color: s.color }}>
                {pipelineCounts[s.id]}
              </span>
              <span className="text-[8px] text-zinc-600 mt-0.5 text-center leading-tight hidden sm:block">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Calendar Grid ──────────────────────────────────────────────── */}
        <div className="p-4 sm:p-5">
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-0.5 mb-1.5">
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                className="text-[9px] sm:text-[10px] text-zinc-600 text-center py-0.5 font-medium"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dayEvents = eventsByDay[day] ?? [];
              const todayCell = isToday(day);
              const hasEvents = dayEvents.length > 0;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "relative flex flex-col items-center justify-start pt-1.5 pb-1.5 rounded-xl transition-all group",
                    "hover:bg-zinc-800/60 hover:scale-[1.03] hover:z-10",
                    todayCell && "ring-1 ring-amber-400/60",
                  )}
                  style={{ minHeight: 56 }}
                >
                  {/* Day number */}
                  <span
                    className={cn(
                      "text-[11px] sm:text-xs font-semibold leading-none mb-1.5 w-6 h-6 flex items-center justify-center rounded-full transition-colors",
                      todayCell
                        ? "bg-amber-400 text-black font-bold"
                        : "text-zinc-400 group-hover:text-zinc-200",
                    )}
                  >
                    {day}
                  </span>

                  {/* Dot indicators */}
                  {hasEvents && (
                    <div className="flex items-center gap-0.5 flex-wrap justify-center px-0.5">
                      {dayEvents.slice(0, 4).map((ev) => (
                        <span
                          key={ev.id}
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{
                            background: DOT_COLOR_MAP[ev.color],
                            boxShadow: `0 0 4px ${DOT_COLOR_MAP[ev.color]}80`,
                          }}
                        />
                      ))}
                      {dayEvents.length > 4 && (
                        <span className="text-[7px] text-zinc-500 font-bold">+{dayEvents.length - 4}</span>
                      )}
                    </div>
                  )}

                  {/* Hover add indicator */}
                  {!hasEvents && (
                    <Plus className="w-2.5 h-2.5 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Upcoming events list ───────────────────────────────────────── */}
        {monthEvents.length > 0 && (
          <div
            className="px-5 pb-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <div className="flex items-center gap-2 pt-4 mb-3">
              <Zap className="w-3 h-3" style={{ color: VIOLET }} />
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                This Month · {monthEvents.length} Events
              </span>
            </div>
            <div className="space-y-1.5">
              {monthEvents
                .sort((a, b) => a.date.localeCompare(b.date))
                .slice(0, 6)
                .map((ev) => {
                  const dotColor = DOT_COLOR_MAP[ev.color];
                  const statusInfo = CONTENT_STATUSES.find((s) => s.id === ev.status);
                  const platformInfo = PLATFORMS.find((p) => p.id === ev.platform);
                  const [, , dayStr] = ev.date.split("-");
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => {
                        setEditingEvent(ev);
                        setDayModalDate(ev.date);
                      }}
                      className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left transition-all hover:bg-zinc-800/50 group"
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: `${dotColor}18`, border: `1px solid ${dotColor}30` }}
                      >
                        {dayStr}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">{ev.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {statusInfo && (
                            <span className="text-[9px]">{statusInfo.emoji}</span>
                          )}
                          {platformInfo && (
                            <span className="text-[10px]" style={{ color: platformInfo.color }}>
                              {platformInfo.label}
                            </span>
                          )}
                          {ev.time && (
                            <span className="text-[10px] text-zinc-600 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {ev.time}
                            </span>
                          )}
                        </div>
                      </div>
                      {statusInfo && (
                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                          style={{ background: statusInfo.bg, color: statusInfo.color }}
                        >
                          {statusInfo.emoji} {statusInfo.label}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* ── AI Insights Panel ─────────────────────────────────────────── */}
        <div
          className="px-5 py-4"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            background: "linear-gradient(135deg, rgba(52,211,153,0.03), rgba(192,132,252,0.03))",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-3.5 h-3.5" style={{ color: EMERALD }} />
            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Lync AI Insights
            </span>
            <span
              className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: "rgba(52,211,153,0.12)", color: EMERALD, border: "1px solid rgba(52,211,153,0.25)" }}
            >
              BETA
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {GENERIC_INSIGHTS.slice(0, 4).map((insight, i) => (
              <div
                key={i}
                className="rounded-xl px-3 py-2.5 text-[11px] text-zinc-400 leading-relaxed"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                {insight}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Free Blank Scratchpad ─────────────────────────────────────────────── */}
      <div
        className="mt-6 rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(18,18,28,0.95) 0%, rgba(9,9,15,0.98) 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 0 0 1px rgba(192,132,252,0.03)",
        }}
      >
        {/* Scratchpad header */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(192,132,252,0.08)" }}
            >
              <Film className="w-3.5 h-3.5" style={{ color: VIOLET }} />
            </div>
            <div>
              <span className="text-sm font-semibold text-white">Free Blank</span>
              <span className="text-zinc-600 text-xs ml-2">Ideas, to-dos, rough drafts</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="hidden sm:flex items-center gap-1.5 text-[10px] text-zinc-600"
            >
              <Lightbulb className="w-3 h-3 text-yellow-500/60" />
              <span>Your personal creative scratchpad</span>
            </div>
            <button
              type="button"
              onClick={() => setScratchpadExpanded((v) => !v)}
              className="p-1.5 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-zinc-300"
              title={scratchpadExpanded ? "Collapse" : "Expand"}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick idea chips */}
        <div className="px-5 pt-3 flex flex-wrap gap-1.5">
          {[
            "💡 New idea",
            "📋 To-do list",
            "🎬 Script draft",
            "🔗 Link dump",
            "📝 Brainstorm",
          ].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() =>
                setScratchpad((prev) =>
                  prev
                    ? `${prev}\n\n${chip}: `
                    : `${chip}: `,
                )
              }
              className="text-[10px] font-medium px-2.5 py-1 rounded-full text-zinc-500 hover:text-zinc-300 transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <div className="p-5">
          <textarea
            value={scratchpad}
            onChange={(e) => setScratchpad(e.target.value)}
            placeholder={`✨ Your free creative space for ${monthLabel}...\n\nDump ideas, outlines, random thoughts, to-do lists, content hooks, collab ideas — anything goes here.\n\nNo structure required.`}
            className="w-full rounded-2xl px-4 py-4 text-sm text-zinc-300 placeholder:text-zinc-700 outline-none resize-none transition-colors leading-relaxed font-mono"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              minHeight: scratchpadExpanded ? 400 : 200,
              caretColor: VIOLET,
            }}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-700">
              <Target className="w-3 h-3" />
              {scratchpad.split("\n").filter(Boolean).length} lines · {scratchpad.length} chars
            </div>
            {scratchpad && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Clear the scratchpad?")) setScratchpad("");
                }}
                className="text-[10px] text-zinc-700 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-2.5 h-2.5" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Day Modal ─────────────────────────────────────────────────────────── */}
      {dayModalDate && (
        <DayModal
          date={dayModalDate}
          calendarId={activeCalendarId}
          events={dayModalEvents}
          editingEvent={editingEvent}
          onClose={() => {
            setDayModalDate(null);
            setEditingEvent(null);
          }}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* ── Calendar Manager ──────────────────────────────────────────────────── */}
      {showCalManager && (
        <CalendarManagerModal
          calendars={calendars}
          onAdd={handleAddCalendar}
          onRename={handleRenameCalendar}
          onDelete={handleDeleteCalendar}
          onClose={() => setShowCalManager(false)}
        />
      )}
    </>
  );
}
