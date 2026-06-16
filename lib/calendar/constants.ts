export type CalendarEventType = "POST" | "STORY" | "MEETING" | "DEADLINE";
export type CalendarEventStatus =
  | "SCHEDULED"
  | "GOING_LIVE"
  | "QUEUED"
  | "SYNCED"
  | "PENDING"
  | "DONE";

export const EVENT_TYPE_COLORS: Record<CalendarEventType, string> = {
  POST: "#3b82f6",
  STORY: "#c084fc",
  MEETING: "#a855f7",
  DEADLINE: "#22c55e",
};

export const EVENT_TYPE_LABELS: Record<CalendarEventType, string> = {
  POST: "Post",
  STORY: "Story",
  MEETING: "Meeting",
  DEADLINE: "Deadline",
};

export const PLATFORM_COLORS: Record<string, string> = {
  tiktok: "#f472b6",
  instagram: "#c084fc",
  youtube: "#f87171",
  twitter: "#60a5fa",
  linkedin: "#0ea5e9",
};

export const PLATFORM_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube",
  twitter: "X / Twitter",
  linkedin: "LinkedIn",
};

export const STATUS_STYLES: Record<
  CalendarEventStatus,
  { label: string; color: string; bg: string }
> = {
  SCHEDULED: { label: "Scheduled", color: "#94a3b8", bg: "rgba(148,163,184,0.18)" },
  GOING_LIVE: { label: "Going Live", color: "#fcd34d", bg: "rgba(252,211,77,0.18)" },
  QUEUED: { label: "Queued", color: "#67e8f9", bg: "rgba(103,232,249,0.18)" },
  SYNCED: { label: "Synced", color: "#34d399", bg: "rgba(52,211,153,0.18)" },
  PENDING: { label: "Pending", color: "#c084fc", bg: "rgba(192,132,252,0.18)" },
  DONE: { label: "Done", color: "#22c55e", bg: "rgba(34,197,94,0.18)" },
};

export function getEventColor(type: CalendarEventType, platform?: string | null): string {
  if (type === "POST" || type === "STORY") {
    return platform ? (PLATFORM_COLORS[platform] ?? EVENT_TYPE_COLORS[type]) : EVENT_TYPE_COLORS[type];
  }
  return EVENT_TYPE_COLORS[type];
}

export function formatEventTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (isToday) return `Today ${time}`;
  if (isTomorrow) return `Tomorrow ${time}`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ` ${time}`;
}

export function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = lastDay.getDate();
  return { startOffset, daysInMonth };
}
