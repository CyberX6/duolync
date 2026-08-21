"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  LayoutGrid,
  List,
  Loader2,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type CalendarEventData,
  getCreatorCalendarEventsAction,
  getCampaignEventsAction,
  getBrandCalendarEventsAction,
} from "@/app/actions/calendar-events";
import {
  EVENT_TYPE_LABELS,
  PLATFORM_LABELS,
  STATUS_STYLES,
  formatEventTime,
  getEventColor,
  getMonthGrid,
  type CalendarEventStatus,
} from "@/lib/calendar/constants";
import { EventDetailSheet } from "./EventDetailSheet";

// ── Constants ─────────────────────────────────────────────────────────────────
const VIOLET = "var(--accent-violet-text)";
const VIOLET_T = "var(--accent-violet-text)";
const PLATFORM_COLORS: Record<string, string> = {
  tiktok: "var(--accent-pink-text)",
  instagram: "var(--accent-violet-text)",
  youtube: "var(--accent-red-text)",
};
const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface SmartCalendarWidgetProps {
  campaignId?: string;
  isBrand?: boolean;
  canEdit?: boolean;
  className?: string;
  refreshKey?: number;
  onEventsChange?: (events: CalendarEventData[]) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SmartCalendarWidget({
  campaignId,
  isBrand = false,
  canEdit = false,
  className,
  refreshKey = 0,
  onEventsChange,
}: SmartCalendarWidgetProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [events, setEvents] = useState<CalendarEventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");
  const [, startRefresh] = useTransition();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const { startOffset, daysInMonth } = getMonthGrid(year, month);
  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // ── Data loading ────────────────────────────────────────────────────────

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const result = campaignId
        ? await getCampaignEventsAction(campaignId)
        : isBrand
          ? await getBrandCalendarEventsAction(month, year)
          : await getCreatorCalendarEventsAction(month, year);

      if (!result.error) {
        setEvents(result.data);
        onEventsChange?.(result.data);
      }
    } catch {
      // Network / server restart error — keep existing events, silently retry on next navigation
    } finally {
      setLoading(false);
    }
  }, [campaignId, isBrand, month, year, onEventsChange]);

  useEffect(() => { loadEvents(); }, [loadEvents, refreshKey]);

  // ── Derived data ─────────────────────────────────────────────────────────

  const eventsByDay = useMemo(() => {
    const map: Record<number, CalendarEventData[]> = {};
    for (const event of events) {
      const d = new Date(event.scheduledAt);
      if (d.getMonth() !== month || d.getFullYear() !== year) continue;
      const day = d.getDate();
      if (!map[day]) map[day] = [];
      map[day].push(event);
    }
    return map;
  }, [events, month, year]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => new Date(e.scheduledAt) >= now && e.status !== "DONE")
      .slice(0, 8);
  }, [events]);

  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = { tiktok: 0, instagram: 0, youtube: 0 };
    for (const e of events) {
      if (e.platform && e.platform in counts) counts[e.platform]++;
    }
    return counts;
  }, [events]);

  const doneCount = events.filter((e) => e.status === "DONE").length;
  const totalPosts = events.filter((e) => e.type === "POST" || e.type === "STORY").length;
  const campaignSet = new Set(events.map((e) => e.campaignId)).size;

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleEventClick = (event: CalendarEventData) => {
    setSelectedEvent(event);
    setSheetOpen(true);
  };

  const handleEventUpdated = (updated: CalendarEventData) => {
    const next = events.map((e) => (e.id === updated.id ? updated : e));
    setEvents(next);
    setSelectedEvent(updated);
    onEventsChange?.(next);
  };

  const handleEventDeleted = (id: string) => {
    const next = events.filter((e) => e.id !== id);
    setEvents(next);
    setSheetOpen(false);
    setSelectedEvent(null);
    onEventsChange?.(next);
  };

  const refreshEvents = () => {
    startRefresh(() => { void loadEvents(); });
  };

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div
        className={cn(
          "rounded-3xl overflow-hidden",
          "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm",
          "border border-zinc-200/60 dark:border-white/[0.06]",
          "shadow-sm",
          className,
        )}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <CalendarDays className="w-4 h-4 shrink-0" style={{ color: VIOLET }} />
            <span className="text-sm font-semibold truncate">
              {monthLabel} — Campaign Timeline
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Legend — desktop */}
            <div className="hidden sm:flex items-center gap-3 mr-2">
              {(["MEETING", "POST", "DEADLINE"] as const).map((type) => (
                <span key={type} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ background: getEventColor(type) }} />
                  {EVENT_TYPE_LABELS[type]}
                </span>
              ))}
            </div>

            {/* Mobile view toggle */}
            <div className="flex sm:hidden rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              {(["grid", "timeline"] as const).map((mode) => {
                const Icon = mode === "grid" ? LayoutGrid : List;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "p-1.5 transition-colors",
                      viewMode === mode
                        ? "bg-violet-500/20 text-violet-400"
                        : "text-muted-foreground hover:text-zinc-300",
                    )}
                    aria-label={mode === "grid" ? "Grid view" : "Timeline view"}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Platform KPI strip ───────────────────────────────────────── */}
        {!campaignId && (
          <div className="grid grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.04)" }}>
            {(["tiktok", "instagram", "youtube"] as const).map((p) => (
              <div
                key={p}
                data-fixed-dark
                className="p-3 text-center"
                style={{ background: "rgba(9,9,15,0.95)" }}
              >
                <div
                  className="text-lg font-bold font-display tabular-nums"
                  style={{ color: PLATFORM_COLORS[p] }}
                >
                  {platformCounts[p]}
                </div>
                <div className="text-[9px] text-muted-foreground">posts this month</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 capitalize">
                  {PLATFORM_LABELS[p]}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 sm:p-5">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: VIOLET }} />
            </div>
          ) : (
            <>
              {/* ── Grid view ─────────────────────────────────────────── */}
              <div className={cn(viewMode === "timeline" ? "hidden sm:block" : "block", "mb-4")}>
                {/* Day labels */}
                <div className="grid grid-cols-7 gap-0.5 mb-1">
                  {DAY_LABELS.map((d) => (
                    <div
                      key={d}
                      className="text-[9px] sm:text-[10px] text-muted-foreground text-center py-0.5 font-medium"
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

                    const primary = dayEvents[0];
                    const primaryColor = primary
                      ? getEventColor(primary.type as "POST", primary.platform)
                      : undefined;

                    const hasPending = dayEvents.some((e) => e.hasPendingUpdate);

                    const getEventLabel = (e: CalendarEventData) => {
                      if (e.partner) {
                        return e.partner.role === "BRAND"
                          ? (e.partner.companyName ?? e.partner.name)
                          : e.partner.name;
                      }
                      return EVENT_TYPE_LABELS[e.type as keyof typeof EVENT_TYPE_LABELS] ?? e.type;
                    };

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          if (dayEvents.length > 0) handleEventClick(dayEvents[0]);
                        }}
                        disabled={!hasEvents}
                        className={cn(
                          "relative flex flex-col items-start justify-start pt-1 pb-1.5 px-0.5 rounded-xl transition-all",
                          "text-[10px] sm:text-[11px] font-medium",
                          hasEvents
                            ? "cursor-pointer hover:scale-[1.03] hover:z-10"
                            : "cursor-default",
                          !hasEvents && "text-muted-foreground",
                        )}
                        style={{
                          background: primaryColor ? `color-mix(in srgb, ${primaryColor} 12%, transparent)` : "transparent",
                          border: todayCell
                            ? "1px solid rgba(234,179,8,0.6)"
                            : hasEvents
                              ? `1px solid color-mix(in srgb, ${primaryColor} 30%, transparent)`
                              : "1px solid transparent",
                          color: hasEvents ? primaryColor : undefined,
                          minHeight: 52,
                        }}
                      >
                        {/* Day number */}
                        <span className="self-center leading-none mb-1">{day}</span>

                        {/* Event pills */}
                        {hasEvents && (
                          <div className="w-full flex flex-col gap-0.5 min-w-0">
                            {/* First event pill */}
                            <div
                              className="rounded-sm px-1 py-0.5 text-[7px] sm:text-[8px] font-semibold leading-tight truncate w-full"
                              style={{
                                background: `color-mix(in srgb, ${primaryColor} 22%, transparent)`,
                                color: primaryColor,
                                border: `1px solid color-mix(in srgb, ${primaryColor} 30%, transparent)`,
                              }}
                            >
                              {getEventLabel(primary)}
                            </div>

                            {/* +N more badge */}
                            {dayEvents.length > 1 && (
                              <div
                                className="rounded-sm px-1 py-0.5 text-[7px] sm:text-[8px] font-bold leading-tight"
                                style={{
                                  background: `color-mix(in srgb, ${VIOLET_T} 18%, transparent)`,
                                  color: VIOLET_T,
                                  border: `1px solid color-mix(in srgb, ${VIOLET_T} 28%, transparent)`,
                                }}
                              >
                                +{dayEvents.length - 1} more
                              </div>
                            )}
                          </div>
                        )}

                        {/* Pending change amber dot */}
                        {hasPending && (
                          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Mobile timeline view ───────────────────────────────── */}
              <div className={cn(viewMode === "timeline" ? "block sm:hidden" : "hidden", "mb-4")}>
                {(() => {
                  const monthEvents = events.filter((e) => {
                    const d = new Date(e.scheduledAt);
                    return d.getMonth() === month && d.getFullYear() === year;
                  });

                  if (monthEvents.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <CalendarDays className="w-8 h-8 mx-auto mb-2 text-zinc-700" />
                        <p className="text-sm text-muted-foreground">No events this month</p>
                      </div>
                    );
                  }

                  return (
                    <div>
                      {monthEvents.map((event, i, arr) => {
                        const color = getEventColor(event.type as "POST", event.platform);
                        const statusStyle = STATUS_STYLES[event.status as CalendarEventStatus];
                        const partnerName =
                          event.partner?.role === "BRAND"
                            ? (event.partner.companyName ?? event.partner.name)
                            : event.partner?.name;

                        return (
                          <button
                            key={event.id}
                            type="button"
                            onClick={() => handleEventClick(event)}
                            className="flex gap-3 w-full text-left group"
                          >
                            {/* Timeline spine */}
                            <div className="flex flex-col items-center shrink-0 w-5">
                              <div
                                className="w-3 h-3 rounded-full mt-3.5 ring-2 ring-offset-1 ring-offset-zinc-950 shrink-0 transition-transform group-hover:scale-110"
                                style={{ background: color, boxShadow: `0 0 0 2px color-mix(in srgb, ${color} 40%, transparent)` }}
                              />
                              {i < arr.length - 1 && (
                                <div className="w-px flex-1 bg-zinc-800/80 mt-1 min-h-6" />
                              )}
                            </div>

                            {/* Content */}
                            <div
                              className="flex-1 min-w-0 py-3 border-b last:border-0"
                              style={{ borderColor: "rgba(255,255,255,0.04)" }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-zinc-200 truncate">
                                    {event.campaignTitle}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {partnerName ? `${partnerName} · ` : ""}
                                    {event.title ?? EVENT_TYPE_LABELS[event.type as keyof typeof EVENT_TYPE_LABELS]}
                                    {event.platform ? ` · ${PLATFORM_LABELS[event.platform] ?? event.platform}` : ""}
                                  </p>
                                </div>
                                <span
                                  className="text-[9px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                                  style={{ background: statusStyle.bg, color: statusStyle.color }}
                                >
                                  {statusStyle.label}
                                </span>
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatEventTime(event.scheduledAt)}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* ── Upcoming posts ──────────────────────────────────────── */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-3 h-3" style={{ color: VIOLET }} />
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Upcoming Posts
                  </span>
                </div>

                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground">No upcoming events</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {upcomingEvents.map((event) => {
                      const color = getEventColor(event.type as "POST", event.platform);
                      const statusStyle = STATUS_STYLES[event.status as CalendarEventStatus];
                      const isLive = event.status === "GOING_LIVE";
                      const partnerName =
                        event.partner?.role === "BRAND"
                          ? (event.partner.companyName ?? event.partner.name)
                          : event.partner?.name;

                      return (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => handleEventClick(event)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 w-full text-left transition-all hover:bg-violet-500/5 group"
                        >
                          {/* Partner avatar or type icon */}
                          {event.partner ? (
                            <div
                              className="w-8 h-8 rounded-xl overflow-hidden shrink-0"
                              style={{ boxShadow: `0 0 0 1px color-mix(in srgb, ${color} 40%, transparent)` }}
                            >
                              {event.partner.image ? (
                                <img
                                  src={event.partner.image}
                                  alt={partnerName ?? ""}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div
                                  className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white"
                                  style={{
                                    background: `linear-gradient(135deg, ${color}cc, ${color}66)`,
                                  }}
                                >
                                  {initials(partnerName ?? "?")}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                              style={{ background: `color-mix(in srgb, ${color} 18%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 35%, transparent)` }}
                            >
                              <CalendarDays className="w-3.5 h-3.5" style={{ color }} />
                            </div>
                          )}

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <p className="text-xs font-medium text-zinc-200 truncate">
                                {event.campaignTitle}
                              </p>
                              {event.hasPendingUpdate && (
                                <span
                                  className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"
                                  title="Pending change request"
                                />
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                              {partnerName ? `${partnerName} · ` : ""}
                              {event.title ?? EVENT_TYPE_LABELS[event.type as keyof typeof EVENT_TYPE_LABELS]}
                              {event.platform ? ` · ${PLATFORM_LABELS[event.platform] ?? event.platform}` : ""}
                            </p>
                          </div>

                          {/* Right side */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="hidden xs:flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatEventTime(event.scheduledAt)}
                            </span>
                            <span
                              className="flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ background: statusStyle.bg, color: statusStyle.color }}
                            >
                              {isLive && (
                                <span
                                  className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
                                  style={{ background: statusStyle.color }}
                                />
                              )}
                              {statusStyle.label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Footer stats ─────────────────────────────────────────────── */}
        {!campaignId && !loading && (
          <div
            data-fixed-dark
            className="grid grid-cols-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            {[
              { icon: Users, label: `${campaignSet} Campaign${campaignSet !== 1 ? "s" : ""}` },
              { icon: CheckCircle2, label: `${doneCount}/${totalPosts || events.length} Posts done` },
              { icon: Bell, label: `${upcomingEvents.length} Reminders` },
            ].map(({ icon: Icon, label }, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1 py-3 text-[10px] text-muted-foreground"
                style={{
                  background: "rgba(9,9,15,0.6)",
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.04)" : undefined,
                }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: VIOLET }} />
                {label}
              </div>
            ))}
          </div>
        )}
      </div>

      <EventDetailSheet
        event={selectedEvent}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        canEdit={canEdit}
        onUpdated={handleEventUpdated}
        onDeleted={handleEventDeleted}
        onRefresh={refreshEvents}
      />
    </>
  );
}
