"use client";

import { useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  History,
  Loader2,
  MessageSquare,
  Pencil,
  Send,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  type CalendarEventData,
  type CalendarEventDetailData,
  getCalendarEventDetailAction,
  requestEventUpdateAction,
  approveEventUpdateAction,
  rejectEventUpdateAction,
  updateCampaignEventAction,
  deleteCampaignEventAction,
} from "@/app/actions/calendar-events";
import {
  type DBMessage,
  getConversationAction,
  sendMessageAction,
} from "@/app/actions/messages";
import {
  EVENT_TYPE_LABELS,
  PLATFORM_LABELS,
  STATUS_STYLES,
  formatEventTime,
  getEventColor,
  type CalendarEventStatus,
} from "@/lib/calendar/constants";

// ── Design tokens ─────────────────────────────────────────────────────────────
const VIOLET = "#c084fc";

// ── Helpers ───────────────────────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function formatChatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function Avatar({
  name,
  image,
  size = "md",
  color,
}: {
  name: string;
  image: string | null;
  size?: "sm" | "md" | "lg";
  color?: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses = { sm: "w-7 h-7 text-[9px]", md: "w-10 h-10 text-xs", lg: "w-14 h-14 text-sm" };

  return (
    <div
      className={cn("rounded-xl overflow-hidden ring-2 ring-violet-500/25 shrink-0", sizeClasses[size])}
    >
      {image ? (
        <img src={image} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-bold text-white"
          style={{
            background: color
              ? `linear-gradient(135deg, ${color}cc, ${color}66)`
              : "linear-gradient(135deg, #7c3aed, #4f46e5)",
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}

function SkeletonLine({ width = "full" }: { width?: string }) {
  return (
    <div
      className={cn("h-3 rounded-full bg-zinc-800 animate-pulse", `w-${width}`)}
    />
  );
}

// ── Inline Business Chat ───────────────────────────────────────────────────────

function BusinessChat({
  partnerUserId,
  partnerName,
  partnerImage,
  partnerColor,
  currentUserId,
}: {
  partnerUserId: string;
  partnerName: string;
  partnerImage: string | null;
  partnerColor: string;
  currentUserId: string;
}) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<DBMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getConversationAction(partnerUserId).then((msgs) => {
      setMessages(msgs);
      setLoading(false);
    });
  }, [partnerUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setText("");
    const result = await sendMessageAction(partnerUserId, trimmed);
    if (result.error) {
      toast({ variant: "destructive", title: result.error });
      setText(trimmed);
    } else {
      const optimistic: DBMessage = {
        id: `opt-${Date.now()}`,
        text: trimmed,
        senderId: currentUserId,
        receiverId: partnerUserId,
        createdAt: new Date().toISOString(),
        senderRole: "brand",
        senderName: "You",
        senderAvatarUrl: null,
      };
      setMessages((prev) => [...prev, optimistic]);
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ border: "1px solid rgba(192,132,252,0.15)", background: "rgba(192,132,252,0.03)" }}
    >
      {/* Chat header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <MessageSquare className="w-3.5 h-3.5" style={{ color: VIOLET }} />
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
          Business Chat
        </span>
        <span className="ml-auto text-[10px] text-zinc-600">with {partnerName}</span>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2 px-4 py-3 max-h-48 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-[11px] text-zinc-600">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={cn("flex gap-2 items-end", isMe ? "flex-row-reverse" : "flex-row")}>
                {!isMe && (
                  <div
                    className="w-6 h-6 rounded-lg overflow-hidden shrink-0"
                    style={{ boxShadow: `0 0 0 1px ${partnerColor}40` }}
                  >
                    {partnerImage ? (
                      <img src={partnerImage} alt={partnerName} className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-[8px] font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${partnerColor}cc, ${partnerColor}66)` }}
                      >
                        {partnerName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}
                <div className={cn("flex flex-col gap-0.5 max-w-[75%]", isMe ? "items-end" : "items-start")}>
                  <div
                    className="px-3 py-2 rounded-xl text-xs"
                    style={
                      isMe
                        ? { background: `${VIOLET}22`, color: "#e4d4fc", border: `1px solid ${VIOLET}30` }
                        : { background: "rgba(255,255,255,0.04)", color: "#d4d4d8", border: "1px solid rgba(255,255,255,0.07)" }
                    }
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-zinc-700">{formatChatTime(msg.createdAt)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="px-3 py-2.5 flex items-center gap-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          className="flex-1 bg-transparent text-xs text-zinc-200 placeholder:text-zinc-600 outline-none min-w-0"
        />
        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={!text.trim() || sending}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
          style={{ background: text.trim() ? `${VIOLET}30` : "transparent", border: `1px solid ${VIOLET}25` }}
        >
          {sending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: VIOLET }} />
          ) : (
            <Send className="w-3.5 h-3.5" style={{ color: VIOLET }} />
          )}
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface EventDetailSheetProps {
  event: CalendarEventData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canEdit?: boolean;
  onUpdated: (event: CalendarEventData) => void;
  onDeleted: (id: string) => void;
  onRefresh: () => void;
}

export function EventDetailSheet({
  event,
  open,
  onOpenChange,
  canEdit = false,
  onUpdated,
  onDeleted,
  onRefresh,
}: EventDetailSheetProps) {
  const { toast } = useToast();
  const { profile } = useAuth();
  const isMobile = useIsMobile();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [detail, setDetail] = useState<CalendarEventDetailData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const display = detail ?? event;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onOpenChange(false);
  };

  useEffect(() => {
    if (!open || !event || event.isSynthetic) {
      setDetail(null);
      setIsEditing(false);
      setShowHistory(false);
      return;
    }

    let cancelled = false;
    setLoadingDetail(true);

    getCalendarEventDetailAction(event.id).then((result) => {
      if (cancelled) return;
      if (result.data) setDetail(result.data);
      setLoadingDetail(false);
    });

    return () => { cancelled = true; };
  }, [open, event?.id, event?.isSynthetic]);

  if (!open || !display) return null;

  const color = getEventColor(display.type as "POST", display.platform);
  const statusStyle = STATUS_STYLES[display.status as CalendarEventStatus] ?? STATUS_STYLES.SCHEDULED;
  const isSynthetic = display.isSynthetic ?? false;
  const currentUserId = profile?.user_id;
  const pendingUpdate = detail?.pendingUpdate ?? null;
  const canReviewPending =
    !!pendingUpdate &&
    !!currentUserId &&
    pendingUpdate.requestedBy.userId !== currentUserId;

  const campaignPath = canEdit
    ? `/brand/campaigns/${display.campaignId}`
    : `/creator/campaigns/${display.campaignId}`;

  const partnerDisplayName =
    display.partner?.role === "BRAND"
      ? (display.partner.companyName ?? display.partner.name)
      : display.partner?.name ?? null;

  const partnerProfilePath = display.partner
    ? `/profile/${display.partner.userId}`
    : null;

  // ── Action handlers ──────────────────────────────────────────────────────

  const handleMarkDone = () => {
    if (isSynthetic) return;
    startTransition(async () => {
      const result = await updateCampaignEventAction({ id: display.id, status: "DONE" });
      if (result.error || !result.data) {
        toast({ variant: "destructive", title: result.error ?? "Failed to update" });
        return;
      }
      toast({ title: "Marked as done ✓" });
      onUpdated(result.data);
      onRefresh();
      const refreshed = await getCalendarEventDetailAction(display.id);
      if (refreshed.data) setDetail(refreshed.data);
    });
  };

  const handleRequestDateChange = () => {
    if (!editDate || isSynthetic) return;
    startTransition(async () => {
      const result = await requestEventUpdateAction({
        eventId: display.id,
        scheduledAt: new Date(editDate).toISOString(),
      });
      if (result.error || !result.data) {
        toast({ variant: "destructive", title: result.error ?? "Failed to submit" });
        return;
      }
      toast({ title: "Change request sent — awaiting partner approval" });
      setIsEditing(false);
      onRefresh();
      const refreshed = await getCalendarEventDetailAction(display.id);
      if (refreshed.data) { setDetail(refreshed.data); onUpdated(refreshed.data); }
    });
  };

  const handleApprove = () => {
    if (!pendingUpdate) return;
    startTransition(async () => {
      const result = await approveEventUpdateAction(pendingUpdate.id);
      if (result.error || !result.data) {
        toast({ variant: "destructive", title: result.error ?? "Failed to approve" });
        return;
      }
      toast({ title: "Change approved ✓" });
      setDetail(result.data);
      onUpdated(result.data);
      onRefresh();
    });
  };

  const handleReject = () => {
    if (!pendingUpdate) return;
    startTransition(async () => {
      const result = await rejectEventUpdateAction(pendingUpdate.id);
      if (result.error || !result.data) {
        toast({ variant: "destructive", title: result.error ?? "Failed to reject" });
        return;
      }
      toast({ title: "Change rejected" });
      setDetail(result.data);
      onRefresh();
    });
  };

  const handleDelete = () => {
    if (isSynthetic) return;
    startTransition(async () => {
      const result = await deleteCampaignEventAction(display.id);
      if (result.error) {
        toast({ variant: "destructive", title: result.error });
        return;
      }
      toast({ title: "Event deleted" });
      onDeleted(display.id);
      onRefresh();
    });
  };

  const startEdit = () => {
    const d = new Date(display.scheduledAt);
    setEditDate(
      new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16),
    );
    setIsEditing(true);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const campaignImageUrl = detail?.campaignImageUrl ?? null;

  const panelContent = (
    <div className="flex flex-col h-full">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        className="relative flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Campaign hero image */}
        {campaignImageUrl && (
          <div className="relative w-full h-28 overflow-hidden">
            <img
              src={campaignImageUrl}
              alt={display.campaignTitle}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to bottom, rgba(9,9,15,0.2) 0%, rgba(9,9,15,0.85) 100%)",
              }}
            />
          </div>
        )}

        <div
          className="relative px-5 pt-4 pb-4"
          style={{
            background: campaignImageUrl
              ? "transparent"
              : `linear-gradient(160deg, ${color}14 0%, transparent 60%)`,
            marginTop: campaignImageUrl ? "-3rem" : 0,
          }}
        >
          {/* Close */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-4 w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Drag handle — mobile only */}
          {isMobile && !campaignImageUrl && (
            <div className="flex justify-center mb-3">
              <div className="w-10 h-1 rounded-full bg-zinc-700" />
            </div>
          )}

          {/* Event type badge */}
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold mb-2"
            style={{ background: `${color}20`, color, border: `1px solid ${color}35` }}
          >
            <Calendar className="w-3 h-3" />
            {EVENT_TYPE_LABELS[display.type as keyof typeof EVENT_TYPE_LABELS] ?? display.type}
            {display.platform && ` · ${PLATFORM_LABELS[display.platform] ?? display.platform}`}
          </div>

          {/* Campaign title */}
          <h2 className="text-base font-bold text-white leading-tight pr-8 mb-0.5">
            {display.campaignTitle}
          </h2>
          {display.title && (
            <p className="text-xs text-zinc-400 mb-3">{display.title}</p>
          )}

          {/* Partner hero */}
          {display.partner && (
            <div
              className="flex items-center gap-3 mt-3 p-3 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <Avatar
                name={partnerDisplayName ?? display.partner.name}
                image={display.partner.image}
                size="md"
                color={color}
              />
              <div className="flex-1 min-w-0">
                {partnerProfilePath ? (
                  <Link
                    href={partnerProfilePath}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-1 group"
                  >
                    <span className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors truncate">
                      {partnerDisplayName ?? display.partner.name}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-violet-400 transition-colors shrink-0" />
                  </Link>
                ) : (
                  <p className="text-sm font-semibold text-white truncate">
                    {partnerDisplayName ?? display.partner.name}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-zinc-500">
                    {display.partner.role === "BRAND" ? "Brand" : "Creator"}
                  </span>
                  {display.partner.niche && (
                    <>
                      <span className="text-zinc-700">·</span>
                      <span className="text-[10px] text-zinc-500">{display.partner.niche}</span>
                    </>
                  )}
                  {display.partner.totalFollowers != null && display.partner.totalFollowers > 0 && (
                    <>
                      <span className="text-zinc-700">·</span>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-0.5">
                        <Users className="w-2.5 h-2.5" />
                        {formatFollowers(display.partner.totalFollowers)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {partnerProfilePath && (
                <Link
                  href={partnerProfilePath}
                  onClick={() => onOpenChange(false)}
                  className="shrink-0 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-violet-300 hover:bg-violet-500/15 transition-colors"
                  style={{ border: "1px solid rgba(192,132,252,0.3)" }}
                >
                  View Profile
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Scrollable body ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {loadingDetail && (
          <div className="space-y-3 pt-1">
            <SkeletonLine width="3/4" />
            <SkeletonLine width="1/2" />
            <SkeletonLine width="2/3" />
          </div>
        )}

        {/* Pending update banner */}
        {pendingUpdate && (
          <div
            className="rounded-2xl p-4 space-y-3"
            style={{
              background: "rgba(245,158,11,0.06)",
              border: "1px solid rgba(245,158,11,0.25)",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(245,158,11,0.15)" }}
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-sm font-semibold text-amber-300">Pending change request</p>
            </div>

            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              {pendingUpdate.scheduledAt && (
                <div className="flex items-center justify-between px-3 py-2 text-xs" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <span className="text-zinc-500">New date</span>
                  <span className="font-medium text-amber-200">{formatEventTime(pendingUpdate.scheduledAt)}</span>
                </div>
              )}
              {pendingUpdate.title && (
                <div className="flex items-center justify-between px-3 py-2 text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.02)" }}>
                  <span className="text-zinc-500">New title</span>
                  <span className="font-medium text-amber-200 truncate max-w-[60%] text-right">{pendingUpdate.title}</span>
                </div>
              )}
              {pendingUpdate.platform && (
                <div className="flex items-center justify-between px-3 py-2 text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.02)" }}>
                  <span className="text-zinc-500">New platform</span>
                  <span className="font-medium text-amber-200">{PLATFORM_LABELS[pendingUpdate.platform] ?? pendingUpdate.platform}</span>
                </div>
              )}
              <div className="px-3 py-2 flex items-center gap-2 text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)" }}>
                <Avatar
                  name={pendingUpdate.requestedBy.name}
                  image={pendingUpdate.requestedBy.image}
                  size="sm"
                />
                <span className="text-zinc-500">Requested by <span className="text-zinc-300">{pendingUpdate.requestedBy.name}</span></span>
              </div>
            </div>

            {canReviewPending ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 h-9 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white"
                  onClick={handleApprove}
                  disabled={isPending}
                >
                  {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />}
                  Approve
                </Button>
                <Button
                  size="sm"
                  className="flex-1 h-9 rounded-xl font-semibold bg-transparent hover:bg-red-950/40 text-red-400 border border-red-900/40"
                  onClick={handleReject}
                  disabled={isPending}
                >
                  Reject
                </Button>
              </div>
            ) : (
              <p className="text-xs text-amber-400/60 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Waiting for partner approval…
              </p>
            )}
          </div>
        )}

        {/* Event details card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Row label="Status">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
              style={{ background: statusStyle.bg, color: statusStyle.color }}
            >
              {display.status === "GOING_LIVE" && (
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: statusStyle.color }}
                />
              )}
              {statusStyle.label}
            </span>
          </Row>
          <RowDivider />
          <Row label="Scheduled">
            <span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              {formatEventTime(display.scheduledAt)}
            </span>
          </Row>
          {detail?.createdBy && (
            <>
              <RowDivider />
              <Row label="Created by">
                <div className="flex items-center gap-1.5">
                  <Avatar name={detail.createdBy.name} image={detail.createdBy.image} size="sm" />
                  <span className="text-xs text-zinc-300 truncate max-w-[120px]">{detail.createdBy.name}</span>
                </div>
              </Row>
            </>
          )}
        </div>

        {/* Date change form */}
        {isEditing && !isSynthetic && !pendingUpdate && (
          <div
            className="rounded-2xl p-4 space-y-3"
            style={{ background: "rgba(192,132,252,0.05)", border: "1px solid rgba(192,132,252,0.2)" }}
          >
            <div className="flex items-center gap-2">
              <Pencil className="w-3.5 h-3.5 text-violet-400" />
              <p className="text-sm font-semibold" style={{ color: VIOLET }}>Propose new date</p>
            </div>
            <Input
              type="datetime-local"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="bg-zinc-900/80 border-zinc-700 focus:border-violet-500 text-sm h-9 rounded-xl"
            />
            <p className="text-[11px] text-zinc-500">
              Your partner must approve this before the event is rescheduled.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 h-8 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                onClick={handleRequestDateChange}
                disabled={isPending || !editDate}
              >
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Submit Request"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 rounded-xl border-zinc-700"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Business Chat — only when we have a partner with a userId */}
        {display.partner && currentUserId && !isSynthetic && (
          <BusinessChat
            partnerUserId={display.partner.userId}
            partnerName={partnerDisplayName ?? display.partner.name}
            partnerImage={display.partner.image}
            partnerColor={color}
            currentUserId={currentUserId}
          />
        )}

        {/* Update history */}
        {detail?.updateHistory && detail.updateHistory.length > 0 && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <button
              type="button"
              className="flex items-center justify-between w-full px-4 py-3 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              onClick={() => setShowHistory((v) => !v)}
            >
              <span className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                Change history ({detail.updateHistory.length})
              </span>
              {showHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showHistory && (
              <div className="px-4 pb-3 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                {detail.updateHistory.map((u) => (
                  <div key={u.id} className="flex items-start gap-2 pt-2">
                    <Avatar name={u.requestedBy.name} image={u.requestedBy.image} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-zinc-400">
                        <span className="text-zinc-300 font-medium">{u.requestedBy.name}</span>{" "}
                        proposed a change
                      </p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">
                        {u.scheduledAt ? `→ ${formatEventTime(u.scheduledAt)}` : ""}
                        {u.title ? ` · "${u.title}"` : ""}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0",
                        u.status === "APPROVED" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400",
                      )}
                    >
                      {u.status === "APPROVED" ? "Approved" : "Rejected"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Footer actions ───────────────────────────────────────────────── */}
      <div
        className="px-5 py-4 flex-shrink-0 space-y-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Button
          asChild
          className="w-full h-10 rounded-xl justify-start gap-2 bg-transparent border border-zinc-700/80 hover:bg-zinc-800/60 text-zinc-300 hover:text-white"
        >
          <Link href={campaignPath} onClick={() => onOpenChange(false)}>
            <ExternalLink className="w-4 h-4" />
            View Campaign
          </Link>
        </Button>

        {!isSynthetic && !pendingUpdate && !isEditing && (
          <Button
            className="w-full h-10 rounded-xl justify-start gap-2 bg-transparent border border-zinc-700/80 hover:bg-zinc-800/60 text-zinc-300 hover:text-white"
            onClick={startEdit}
            disabled={isPending}
          >
            <Pencil className="w-4 h-4" />
            Request Date Change
          </Button>
        )}

        {display.status !== "DONE" && !isSynthetic && (
          <Button
            className="w-full h-10 rounded-xl justify-start gap-2 font-semibold"
            style={{ background: VIOLET, color: "#fff" }}
            onClick={handleMarkDone}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Mark as Done
          </Button>
        )}

        {display.status === "DONE" && (
          <div className="flex items-center justify-center gap-2 py-1 text-emerald-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Completed
          </div>
        )}

        {canEdit && !isSynthetic && (
          <Button
            className="w-full h-9 rounded-xl justify-start gap-2 bg-transparent border border-red-900/40 text-red-500 hover:bg-red-950/30 hover:text-red-400 text-sm"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Event
          </Button>
        )}
      </div>
    </div>
  );

  // Mobile: full-screen bottom sheet
  if (isMobile) {
    return (
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 flex flex-col justify-end"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        onClick={handleOverlayClick}
      >
        <div
          className="w-full rounded-t-3xl flex flex-col overflow-hidden"
          style={{
            background: "#09090f",
            border: "1px solid rgba(255,255,255,0.08)",
            maxHeight: "92svh",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {panelContent}
        </div>
      </div>
    );
  }

  // Desktop: right drawer
  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
      onClick={handleOverlayClick}
    >
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-[420px] flex flex-col overflow-hidden"
        style={{
          background: "#09090f",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "-24px 0 80px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {panelContent}
      </div>
    </div>
  );
}

// ── Small sub-components ──────────────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-xs text-zinc-500">{label}</span>
      {children}
    </div>
  );
}

function RowDivider() {
  return <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />;
}
