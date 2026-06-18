"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Users, DollarSign, Clock, Calendar, CheckCircle2,
  XCircle, Eye, Layers, TrendingUp, ChevronDown, MessageSquare,
  Send, Building2, BadgeCheck, Star, X, Loader2, FileText,
  ExternalLink, SlidersHorizontal, Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  getCampaignDetailAction,
  updateApplicationAction,
  type CampaignDetailData,
  type ApplicationDetail,
} from "@/app/actions/brand-applications";
import { updateCampaignStatusAction, startCampaignWorkflowAction } from "@/app/actions/campaigns";
import { CAMPAIGN_WORKFLOW_STATUSES, type WorkflowStatus } from "@/lib/campaign-workflow";
import { AddEventButton } from "@/components/calendar/AddEventModal";
import { SmartCalendarWidget } from "@/components/calendar/SmartCalendarWidget";
import type { CalendarEventData } from "@/app/actions/calendar-events";
import { CampaignBriefForm } from "@/app/_components/campaigns/CampaignBriefForm";

// ── Constants ─────────────────────────────────────────────────────────────────

const CONTENT_FORMATS = [
  { id: "story", label: "Story", emoji: "⏱️" },
  { id: "post", label: "Post", emoji: "🖼️" },
  { id: "reel", label: "Reel", emoji: "🎬" },
  { id: "tiktok_video", label: "TikTok Video", emoji: "🎵" },
  { id: "youtube_video", label: "YouTube Video", emoji: "▶️" },
  { id: "storytelling", label: "Storytelling", emoji: "📖" },
  { id: "live", label: "Live Stream", emoji: "🔴" },
  { id: "ugc", label: "UGC", emoji: "📱" },
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram", emoji: "📸" },
  { id: "tiktok", label: "TikTok", emoji: "🎵" },
  { id: "youtube", label: "YouTube", emoji: "▶️" },
  { id: "twitter", label: "X / Twitter", emoji: "🐦" },
  { id: "linkedin", label: "LinkedIn", emoji: "💼" },
  { id: "pinterest", label: "Pinterest", emoji: "📌" },
  { id: "twitch", label: "Twitch", emoji: "🎮" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  PENDING: { label: "Pending", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-700/40", icon: Clock },
  UNDER_REVIEW: { label: "In Review", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-700/40", icon: Eye },
  ACCEPTED: { label: "Accepted", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700/40", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-700/40", icon: XCircle },
  WITHDRAWN: { label: "Withdrawn", color: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700", icon: X },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBudget(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function getInitials(name: string | null) {
  return (name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ── Multi-select chip component ───────────────────────────────────────────────

function ChipSelector({
  options,
  value,
  onChange,
  columns = 4,
}: {
  options: { id: string; label: string; emoji: string }[];
  value: string[];
  onChange: (v: string[]) => void;
  columns?: number;
}) {
  const toggle = (id: string) =>
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);

  return (
    <div className={cn("grid gap-2", columns === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-3")}>
      {options.map((opt) => {
        const selected = value.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all text-left",
              selected
                ? "border-primary bg-primary/10 text-primary"
                : "border-zinc-200 dark:border-zinc-700 text-muted-foreground hover:border-zinc-300",
            )}
          >
            <span className="text-sm">{opt.emoji}</span>
            <span>{opt.label}</span>
            {selected && (
              <span className="ml-auto w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center shrink-0">
                <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Negotiation Modal ─────────────────────────────────────────────────────────

interface NegotiationModalProps {
  application: ApplicationDetail | null;
  campaignBudget: number;
  onClose: () => void;
  onUpdated: (applicationId: string, patch: Partial<ApplicationDetail>) => void;
}

type TabKey = "overview" | "negotiate" | "notes";

function NegotiationModal({ application, campaignBudget, onClose, onUpdated }: NegotiationModalProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<TabKey>("overview");

  const [status, setStatus] = useState<string>("PENDING");
  const [negotiatedRate, setNegotiatedRate] = useState("");
  const [contentFormats, setContentFormats] = useState<string[]>([]);
  const [brandNote, setBrandNote] = useState("");

  useEffect(() => {
    if (application) {
      setTab("overview");
      setStatus(application.status);
      setNegotiatedRate(application.negotiatedRate?.toString() ?? application.proposedRate.toString());
      setContentFormats(application.contentFormats ?? []);
      setBrandNote(application.brandNote ?? "");
    }
  }, [application]);

  if (!application) return null;
  const { creator } = application;

  const handleSave = (newStatus?: string) => {
    const finalStatus = (newStatus ?? status) as "PENDING" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";
    const rate = parseFloat(negotiatedRate);

    startTransition(async () => {
      const result = await updateApplicationAction(application.id, {
        status: finalStatus,
        negotiatedRate: !isNaN(rate) ? rate : null,
        contentFormats,
        brandNote: brandNote.trim() || null,
      });

      if (result.error) {
        toast({ variant: "destructive", title: result.error });
        return;
      }

      toast({
        title:
          finalStatus === "ACCEPTED" ? "Application accepted! 🎉"
          : finalStatus === "REJECTED" ? "Application rejected."
          : finalStatus === "UNDER_REVIEW" ? "Moved to review."
          : "Changes saved.",
      });

      onUpdated(application.id, {
        status: finalStatus,
        negotiatedRate: !isNaN(rate) ? rate : null,
        contentFormats,
        brandNote: brandNote.trim() || null,
      });

      if (newStatus === "ACCEPTED" || newStatus === "REJECTED") onClose();
    });
  };

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Overview", icon: FileText },
    { key: "negotiate", label: "Negotiate", icon: SlidersHorizontal },
    { key: "notes", label: "Notes", icon: MessageSquare },
  ];

  const statusCfg = STATUS_CONFIG[application.status] ?? STATUS_CONFIG.PENDING;
  const StatusIcon = statusCfg.icon;

  return (
    <Dialog open={!!application} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[92vh] overflow-hidden flex flex-col p-0">
        <DialogTitle className="sr-only">Negotiation</DialogTitle>
        {/* Creator header */}
        <div className="p-5 sm:p-6 border-b border-border flex items-start gap-4 shrink-0">
          <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-zinc-200 dark:ring-zinc-700 shrink-0">
            {creator.avatarUrl ? (
              <img src={creator.avatarUrl} alt={creator.name ?? ""} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {getInitials(creator.name)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <Link
                  href={`/profile/${creator.userId}`}
                  className="font-bold text-lg hover:text-primary transition-colors flex items-center gap-1.5"
                  onClick={onClose}
                >
                  {creator.name ?? "Creator"}
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5 flex-wrap">
                  {creator.primaryPlatform && (
                    <span className="capitalize">{creator.primaryPlatform}</span>
                  )}
                  {creator.niche && <span>· {creator.niche}</span>}
                  <span>· {formatFollowers(creator.totalFollowers)} followers</span>
                </div>
              </div>
              <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shrink-0", statusCfg.color)}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusCfg.label}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-sm flex-wrap">
              <span className="font-semibold text-foreground flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                {formatBudget(application.proposedRate)} proposed
              </span>
              {application.negotiatedRate && application.negotiatedRate !== application.proposedRate && (
                <span className="text-primary font-semibold flex items-center gap-1">
                  → ${application.negotiatedRate.toLocaleString()} negotiated
                </span>
              )}
              <span className="text-muted-foreground text-xs">{timeAgo(application.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-5 shrink-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
                tab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* ── Overview tab ── */}
          {tab === "overview" && (
            <div className="space-y-5">
              {creator.bio && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">About</p>
                  <p className="text-sm leading-relaxed">{creator.bio}</p>
                </div>
              )}

              {application.coverLetter && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Cover Letter</p>
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 p-4 text-sm leading-relaxed text-muted-foreground">
                    "{application.coverLetter}"
                  </div>
                </div>
              )}

              {application.contentFormats.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Agreed Formats</p>
                  <div className="flex flex-wrap gap-2">
                    {application.contentFormats.map((f) => {
                      const meta = CONTENT_FORMATS.find((cf) => cf.id === f);
                      return (
                        <span key={f} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {meta?.emoji} {meta?.label ?? f}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {application.brandNote && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Your Notes</p>
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border p-4 text-sm text-muted-foreground">
                    {application.brandNote}
                  </div>
                </div>
              )}

              {/* Quick action buttons */}
              {application.status === "PENDING" || application.status === "UNDER_REVIEW" ? (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleSave("ACCEPTED")}
                    disabled={isPending}
                  >
                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setTab("negotiate")}
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Negotiate
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 hover:border-red-300 hover:text-red-600"
                    onClick={() => handleSave("REJECTED")}
                    disabled={isPending}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              ) : null}
            </div>
          )}

          {/* ── Negotiate tab ── */}
          {tab === "negotiate" && (
            <div className="space-y-6">
              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Application Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Move to Review</SelectItem>
                    <SelectItem value="ACCEPTED">Accept</SelectItem>
                    <SelectItem value="REJECTED">Reject</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rate negotiation */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Negotiated Rate (USD)</label>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">Creator's Offer</p>
                    <p className="font-bold text-lg">{formatBudget(application.proposedRate)}</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 border-primary/30 border p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">Campaign Budget</p>
                    <p className="font-bold text-lg text-primary">{formatBudget(campaignBudget)}</p>
                  </div>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min={1}
                    step={0.01}
                    value={negotiatedRate}
                    onChange={(e) => setNegotiatedRate(e.target.value)}
                    placeholder="Enter counter-offer…"
                    className="pl-9"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Leave the creator's rate to accept it as-is.</p>
              </div>

              {/* Content formats */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Content Formats</label>
                <ChipSelector
                  options={CONTENT_FORMATS}
                  value={contentFormats}
                  onChange={setContentFormats}
                  columns={4}
                />
              </div>

              <Button onClick={() => handleSave()} disabled={isPending} className="w-full">
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                Save Negotiation
              </Button>
            </div>
          )}

          {/* ── Notes/Chat tab ── */}
          {tab === "notes" && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Internal Brand Notes
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  These notes are visible only to your team. Use them to track discussions or decisions.
                </p>
              </div>

              <textarea
                value={brandNote}
                onChange={(e) => setBrandNote(e.target.value)}
                placeholder="Add notes about this creator, negotiation progress, or decisions…"
                rows={6}
                maxLength={2000}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{brandNote.length}/2000</p>
                <Button size="sm" onClick={() => handleSave()} disabled={isPending}>
                  {isPending ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : null}
                  Save Notes
                </Button>
              </div>

              {/* Placeholder for future real-time chat */}
              <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-6 text-center">
                <MessageSquare className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm font-medium text-muted-foreground">Collaboration Chat</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Direct messaging with this creator will be available here soon.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Campaign Status Tracker ───────────────────────────────────────────────────

const WORKFLOW_META: Record<WorkflowStatus, { label: string; color: string; description: string }> = {
  PENDING:     { label: "Pending",     color: "#f59e0b", description: "Awaiting acceptance from creator(s)" },
  ACCEPTED:    { label: "Accepted",    color: "#8b5cf6", description: "Creator(s) accepted — ready to start" },
  IN_PROGRESS: { label: "In Progress", color: "#3b82f6", description: "Content creation is underway" },
  SUBMITTED:   { label: "Submitted",   color: "#06b6d4", description: "Creator(s) submitted deliverables for review" },
  COMPLETED:   { label: "Completed",   color: "#10b981", description: "Campaign finished and approved" },
};

function CampaignStatusTracker({
  campaignId,
  currentStatus,
  onStatusChange,
}: {
  campaignId: string;
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
}) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const workflowIndex = CAMPAIGN_WORKFLOW_STATUSES.indexOf(currentStatus as WorkflowStatus);
  const isWorkflowStatus = workflowIndex >= 0;

  const handleStatusUpdate = (newStatus: string) => {
    startTransition(async () => {
      const result = await updateCampaignStatusAction(campaignId, newStatus);
      if (result.error) {
        toast({ variant: "destructive", title: result.error });
        return;
      }
      toast({ title: `Campaign status updated to ${WORKFLOW_META[newStatus as WorkflowStatus]?.label ?? newStatus}` });
      onStatusChange(newStatus);
    });
  };

  return (
    <div className="rounded-2xl border border-zinc-200/60 dark:border-white/[0.06] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">Campaign Workflow Status</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isWorkflowStatus
              ? WORKFLOW_META[currentStatus as WorkflowStatus].description
              : "Set a workflow status to track progress"}
          </p>
        </div>
        {isWorkflowStatus && (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: `${WORKFLOW_META[currentStatus as WorkflowStatus].color}18`,
              color: WORKFLOW_META[currentStatus as WorkflowStatus].color,
              border: `1px solid ${WORKFLOW_META[currentStatus as WorkflowStatus].color}30`,
            }}
          >
            {WORKFLOW_META[currentStatus as WorkflowStatus].label}
          </span>
        )}
      </div>

      {/* Progress stepper */}
      <div className="flex items-center gap-0 mb-5 overflow-x-auto pb-1">
        {CAMPAIGN_WORKFLOW_STATUSES.map((s, idx) => {
          const meta = WORKFLOW_META[s];
          const isDone = workflowIndex > idx;
          const isCurrent = workflowIndex === idx;
          return (
            <div key={s} className="flex items-center min-w-0 shrink-0">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: isDone
                      ? "#10b981"
                      : isCurrent
                        ? meta.color
                        : "rgba(113,113,122,0.15)",
                    color: isDone || isCurrent ? "#fff" : "#71717a",
                    boxShadow: isCurrent ? `0 0 0 3px ${meta.color}30` : undefined,
                  }}
                >
                  {isDone ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className="text-[9px] font-medium whitespace-nowrap"
                  style={{ color: isCurrent ? meta.color : isDone ? "#10b981" : "#71717a" }}
                >
                  {meta.label}
                </span>
              </div>
              {idx < CAMPAIGN_WORKFLOW_STATUSES.length - 1 && (
                <div
                  className="flex-1 h-px w-8 sm:w-12 mx-1 mt-[-12px]"
                  style={{ background: isDone ? "#10b98160" : "rgba(113,113,122,0.2)" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {currentStatus === "PENDING" && (
          <>
            <Button
              size="sm"
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold h-8 px-4 rounded-xl"
              onClick={() => handleStatusUpdate("ACCEPTED")}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <BadgeCheck className="w-3.5 h-3.5 mr-1.5" />}
              Accept Campaign
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-4 rounded-xl text-red-500 border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/30"
              onClick={() => handleStatusUpdate("CANCELLED")}
              disabled={isPending}
            >
              <XCircle className="w-3.5 h-3.5 mr-1.5" />
              Decline
            </Button>
          </>
        )}
        {currentStatus === "ACCEPTED" && (
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold h-8 px-4 rounded-xl"
            onClick={() => handleStatusUpdate("IN_PROGRESS")}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
            Mark as In Progress
          </Button>
        )}
        {currentStatus === "IN_PROGRESS" && (
          <Button
            size="sm"
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold h-8 px-4 rounded-xl"
            onClick={() => handleStatusUpdate("SUBMITTED")}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
            Mark as Submitted
          </Button>
        )}
        {currentStatus === "SUBMITTED" && (
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold h-8 px-4 rounded-xl"
            onClick={() => handleStatusUpdate("COMPLETED")}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Approve &amp; Complete
          </Button>
        )}
        {!isWorkflowStatus && (
          <Button
            size="sm"
            className="bg-amber-500 hover:bg-amber-400 text-white font-semibold h-8 px-4 rounded-xl"
            onClick={() => {
              startTransition(async () => {
                const result = await startCampaignWorkflowAction(campaignId);
                if (result.error) {
                  toast({ variant: "destructive", title: result.error });
                  return;
                }
                toast({ title: "Workflow started! Creators have been notified." });
                onStatusChange("PENDING");
              });
            }}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
            Start Workflow
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Applicant row card ────────────────────────────────────────────────────────

function ApplicantCard({
  application,
  onClick,
}: {
  application: ApplicationDetail;
  onClick: () => void;
}) {
  const { creator } = application;
  const cfg = STATUS_CONFIG[application.status] ?? STATUS_CONFIG.PENDING;
  const StatusIcon = cfg.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 hover:border-primary/40 hover:shadow-md dark:hover:shadow-black/20 transition-all duration-200 group"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-zinc-200 dark:ring-zinc-700 shrink-0">
          {creator.avatarUrl ? (
            <img src={creator.avatarUrl} alt={creator.name ?? ""} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {getInitials(creator.name)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="font-semibold text-sm group-hover:text-primary transition-colors">{creator.name ?? "Creator"}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                {creator.primaryPlatform && <span className="capitalize">{creator.primaryPlatform}</span>}
                {creator.niche && <span>· {creator.niche}</span>}
                <span>· {formatFollowers(creator.totalFollowers)} followers</span>
              </div>
            </div>
            <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0", cfg.color)}>
              <StatusIcon className="w-3 h-3" />
              {cfg.label}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-2 text-sm flex-wrap">
            <span className="flex items-center gap-1 font-semibold">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              {formatBudget(application.proposedRate)}
              {application.negotiatedRate && application.negotiatedRate !== application.proposedRate && (
                <span className="text-primary text-xs ml-1">→ {formatBudget(application.negotiatedRate)}</span>
              )}
            </span>
            {application.contentFormats.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {application.contentFormats.length} format{application.contentFormats.length !== 1 ? "s" : ""} agreed
              </span>
            )}
            <span className="text-xs text-muted-foreground ml-auto">{timeAgo(application.createdAt)}</span>
          </div>

          {application.coverLetter && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-1 italic">
              "{application.coverLetter}"
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const CampaignDetail = () => {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const campaignId = params.id;

  const [campaign, setCampaign] = useState<CampaignDetailData | null>(null);
  const [campaignStatus, setCampaignStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ApplicationDetail | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [calendarRefreshKey, setCalendarRefreshKey] = useState(0);

  const handleEventCreated = (_event: CalendarEventData) => {
    setCalendarRefreshKey((k) => k + 1);
  };

  const load = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    const result = await getCampaignDetailAction(campaignId);
    if (result.error) {
      toast({ variant: "destructive", title: result.error });
    } else {
      setCampaign(result.data);
      setCampaignStatus(result.data?.status ?? "");
    }
    setLoading(false);
  }, [campaignId, toast]);

  useEffect(() => { load(); }, [load]);

  const handleUpdated = (applicationId: string, patch: Partial<ApplicationDetail>) => {
    setCampaign((prev) => {
      if (!prev) return prev;
      const apps = prev.applications.map((a) =>
        a.id === applicationId ? { ...a, ...patch } : a,
      );
      return {
        ...prev,
        applications: apps,
        stats: {
          total: apps.length,
          pending: apps.filter((a) => a.status === "PENDING").length,
          underReview: apps.filter((a) => a.status === "UNDER_REVIEW").length,
          accepted: apps.filter((a) => a.status === "ACCEPTED").length,
          rejected: apps.filter((a) => a.status === "REJECTED").length,
        },
      };
    });
    // Keep negotiation modal open with updated data
    if (selectedApp?.id === applicationId) {
      setSelectedApp((prev) => prev ? { ...prev, ...patch } : prev);
    }
  };

  const filterTabs = [
    { value: "ALL", label: "All", count: campaign?.stats.total ?? 0 },
    { value: "PENDING", label: "Pending", count: campaign?.stats.pending ?? 0 },
    { value: "UNDER_REVIEW", label: "In Review", count: campaign?.stats.underReview ?? 0 },
    { value: "ACCEPTED", label: "Accepted", count: campaign?.stats.accepted ?? 0 },
    { value: "REJECTED", label: "Rejected", count: campaign?.stats.rejected ?? 0 },
  ];

  const filtered = campaign?.applications.filter((a) =>
    statusFilter === "ALL" || a.status === statusFilter,
  ) ?? [];

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
            <div className="grid grid-cols-4 gap-3 mt-6">
              {[1,2,3,4].map((i) => <div key={i} className="h-20 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />)}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!campaign) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <Megaphone className="w-12 h-12 text-muted-foreground/40 mb-4" />
          <h2 className="font-bold text-xl mb-2">Campaign not found</h2>
          <Button variant="outline" onClick={() => router.push("/brand/campaigns")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Campaigns
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back + Header */}
        <div className="mb-6">
          <Link
            href="/brand/campaigns"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Campaigns
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              {campaign.imageUrl && (
                <div className="w-full h-40 rounded-2xl overflow-hidden mb-4">
                  <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover" />
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{campaign.title}</h1>
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{campaign.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm flex-wrap">
                <span className="flex items-center gap-1.5 font-semibold">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  {formatBudget(campaign.budget)} budget
                </span>
                {campaign.deadline && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(campaign.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                )}
              </div>
              {/* Platforms */}
              {campaign.platforms.length > 0 && (
                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {campaign.platforms.map((p) => (
                    <span key={p} className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs text-muted-foreground capitalize">{p}</span>
                  ))}
                </div>
              )}
              {/* Content formats */}
              {campaign.contentFormats.length > 0 && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {campaign.contentFormats.map((f) => {
                    const meta = CONTENT_FORMATS.find((cf) => cf.id === f);
                    return (
                      <span key={f} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {meta?.emoji} {meta?.label ?? f}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="shrink-0 flex flex-col gap-2 items-end">
              <AddEventButton
                campaignId={campaign.id}
                campaignTitle={campaign.title}
                platforms={campaign.platforms}
                onCreated={handleEventCreated}
              />
            </div>
          </div>
        </div>

        {/* Campaign Status Tracker */}
        <CampaignStatusTracker
          campaignId={campaign.id}
          currentStatus={campaignStatus}
          onStatusChange={setCampaignStatus}
        />

        {/* Collaboration Brief */}
        <CampaignBriefForm
          campaignId={campaign.id}
          initialData={{
            briefDescription: campaign.briefDescription ?? null,
            goal: campaign.goal ?? null,
            dosAndDonts: campaign.dosAndDonts ?? null,
          }}
          onSaved={(data) => {
            // Sync parent campaign state immediately so initialData stays accurate
            setCampaign((prev) =>
              prev
                ? { ...prev, briefDescription: data.briefDescription, goal: data.goal, dosAndDonts: data.dosAndDonts }
                : prev,
            );
          }}
        />

        {/* Campaign Calendar */}
        <div className="mb-6">
          <h2 className="font-display text-lg font-bold mb-3">Campaign Calendar</h2>
          <SmartCalendarWidget
            campaignId={campaign.id}
            canEdit
            refreshKey={calendarRefreshKey}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: campaign.stats.total, icon: Users, color: "text-foreground" },
            { label: "Pending", value: campaign.stats.pending, icon: Clock, color: "text-amber-600 dark:text-amber-400" },
            { label: "In Review", value: campaign.stats.underReview, icon: Eye, color: "text-blue-600 dark:text-blue-400" },
            { label: "Accepted", value: campaign.stats.accepted, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                <s.icon className="w-3.5 h-3.5" />
                {s.label}
              </div>
              <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border",
                statusFilter === tab.value
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-white dark:bg-zinc-900 text-muted-foreground border-zinc-200 dark:border-zinc-700 hover:border-primary/40",
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={cn(
                  "w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center",
                  statusFilter === tab.value ? "bg-white/20 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-muted-foreground",
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Applicants */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Users className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="font-semibold text-sm mb-1">
              {statusFilter === "ALL" ? "No applications yet" : `No ${statusFilter.toLowerCase()} applications`}
            </p>
            <p className="text-xs text-muted-foreground">
              {statusFilter === "ALL"
                ? "Creators will appear here once they apply."
                : "Try switching the filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => (
              <ApplicantCard
                key={app.id}
                application={app}
                onClick={() => setSelectedApp(app)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Negotiation Modal */}
      <NegotiationModal
        application={selectedApp}
        campaignBudget={campaign.budget}
        onClose={() => setSelectedApp(null)}
        onUpdated={handleUpdated}
      />
    </MainLayout>
  );
};

export default CampaignDetail;
