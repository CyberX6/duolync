"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import {
  Mail, Clock, CheckCircle2, XCircle, DollarSign,
  Building2, Megaphone, Calendar, ChevronRight, Loader2,
  MessageSquare, ExternalLink, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { RichEmptyState } from "@/app/_components/shared/RichEmptyState";
import { useMessaging, type ConversationRecipient } from "@/app/_components/messaging/MessagingContext";
import { cn } from "@/lib/utils";
import {
  getMyInvitationsAction,
  respondToInvitationAction,
  type InvitationItem,
} from "@/app/actions/invitations";

// ── Constants ─────────────────────────────────────────────────────────────────

const PLATFORM_EMOJI: Record<string, string> = {
  instagram: "📸", tiktok: "🎵", youtube: "▶️", twitter: "🐦",
  linkedin: "💼", pinterest: "📌", twitch: "🎮", snapchat: "👻",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING: {
    label: "Awaiting Response",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700/40",
    icon: Clock,
  },
  ACCEPTED: {
    label: "Accepted",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-700/40",
    icon: CheckCircle2,
  },
  DECLINED: {
    label: "Declined",
    color: "text-zinc-500 dark:text-zinc-400",
    bg: "bg-zinc-50 border-zinc-200 dark:bg-zinc-800/40 dark:border-zinc-700",
    icon: XCircle,
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBudget(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diff / 86_400_000);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDeadline(iso: string | null) {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return { text: "Expired", urgent: false };
  const days = Math.ceil(diff / 86_400_000);
  return { text: days <= 1 ? "Due today" : `${days}d left`, urgent: days <= 3 };
}

// ── Invitation Card ────────────────────────────────────────────────────────────

interface InvitationCardProps {
  invitation: InvitationItem;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  actionLoading: string | null;
}

function InvitationCard({ invitation, onAccept, onDecline, actionLoading }: InvitationCardProps) {
  const { openChatWindow } = useMessaging();
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[invitation.status] ?? STATUS_CONFIG.PENDING;
  const StatusIcon = status.icon;
  const { campaign, brand } = invitation;
  const deadline = formatDeadline(campaign.deadline);
  const isLoading = actionLoading === invitation.id;

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    openChatWindow({
      id: brand.userId,
      full_name: brand.companyName,
      avatar_url: brand.avatarUrl,
      user_type: "brand",
    } as ConversationRecipient);
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden transition-all duration-200",
        "hover:shadow-md dark:hover:shadow-black/20",
        invitation.status === "PENDING" && "ring-2 ring-primary/20 dark:ring-primary/15",
        invitation.status === "ACCEPTED" && "ring-2 ring-emerald-400/40 dark:ring-emerald-500/30",
      )}
    >
      {/* Campaign image */}
      {campaign.imageUrl && (
        <div className="w-full h-24 overflow-hidden">
          <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-4 sm:p-5">
        {/* Status badge */}
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border mb-3",
          status.bg, status.color,
        )}>
          <StatusIcon className="w-3.5 h-3.5" />
          {status.label}
        </div>

        {/* Campaign title */}
        <h3 className="font-bold text-base leading-snug line-clamp-2 mb-1 flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-primary shrink-0" />
          {campaign.title}
        </h3>

        {/* Brand */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <Link
            href={`/profile/${brand.userId}`}
            className="font-medium hover:text-primary hover:underline underline-offset-2 transition-colors truncate"
          >
            {brand.companyName}
          </Link>
          {brand.industry && (
            <span className="text-muted-foreground/60 truncate">· {brand.industry}</span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-sm flex-wrap mb-3">
          {invitation.proposedBudget ? (
            <div className="flex items-center gap-1.5 font-semibold">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>{formatBudget(invitation.proposedBudget)}</span>
              <span className="text-xs text-muted-foreground font-normal">offered</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <DollarSign className="w-3.5 h-3.5" />
              Budget to be discussed
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            Received {timeAgo(invitation.createdAt)}
          </div>
          {deadline && (
            <div className={cn("flex items-center gap-1.5 text-xs", deadline.urgent ? "text-orange-500 font-medium" : "text-muted-foreground")}>
              <Calendar className="w-3.5 h-3.5" />
              {deadline.text}
            </div>
          )}
        </div>

        {/* Platform chips */}
        {campaign.platforms.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {campaign.platforms.slice(0, 4).map((pid) => (
              <span key={pid} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                {PLATFORM_EMOJI[pid.toLowerCase()] ?? "🌐"} {pid}
              </span>
            ))}
          </div>
        )}

        {/* Message from brand */}
        {invitation.message && (
          <>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {expanded ? "Hide" : "View"} brand message
              <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", expanded && "rotate-90")} />
            </button>
            {expanded && (
              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 p-3 text-sm text-muted-foreground mb-3 leading-relaxed italic">
                &ldquo;{invitation.message}&rdquo;
              </div>
            )}
          </>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          {invitation.status === "PENDING" ? (
            <>
              <Button
                size="sm"
                className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => onAccept(invitation.id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1.5 hover:border-red-300 hover:text-red-600 dark:hover:border-red-700 dark:hover:text-red-400"
                onClick={() => onDecline(invitation.id)}
                disabled={isLoading}
              >
                <XCircle className="w-3.5 h-3.5" />
                Decline
              </Button>
              <button
                onClick={handleMessage}
                className="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shrink-0"
                title="Message brand"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 w-full">
              {invitation.status === "ACCEPTED" && (
                <Link
                  href={`/creator/campaigns/${campaign.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Campaign
                </Link>
              )}
              <button
                onClick={handleMessage}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Stats bar ─────────────────────────────────────────────────────────────────

function StatsBar({ invitations }: { invitations: InvitationItem[] }) {
  const stats = [
    { label: "Total", value: invitations.length, icon: Mail, color: "text-foreground" },
    { label: "Pending", value: invitations.filter((i) => i.status === "PENDING").length, icon: Clock, color: "text-amber-600 dark:text-amber-400" },
    { label: "Accepted", value: invitations.filter((i) => i.status === "ACCEPTED").length, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Declined", value: invitations.filter((i) => i.status === "DECLINED").length, icon: XCircle, color: "text-zinc-400" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
            <s.icon className="w-3.5 h-3.5" />
            {s.label}
          </div>
          <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const MyInvitations = () => {
  const { toast } = useToast();
  const [invitations, setInvitations] = useState<InvitationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getMyInvitationsAction();
    if (!result.error) setInvitations(result.data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRespond = async (invitationId: string, response: "ACCEPTED" | "DECLINED") => {
    setActionLoading(invitationId);
    const result = await respondToInvitationAction(invitationId, response);
    if (result.error) {
      toast({ variant: "destructive", title: result.error });
    } else {
      toast({
        title: response === "ACCEPTED" ? "Invitation accepted! 🎉" : "Invitation declined.",
        description: response === "ACCEPTED"
          ? "The brand has been notified. Check the campaign details."
          : "The brand has been notified.",
      });
      setInvitations((prev) =>
        prev.map((i) => i.id === invitationId ? { ...i, status: response } : i),
      );
    }
    setActionLoading(null);
  };

  const filterTabs = [
    { value: "ALL", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "DECLINED", label: "Declined" },
  ];

  const filtered = statusFilter === "ALL"
    ? invitations
    : invitations.filter((i) => i.status === statusFilter);

  const pendingCount = invitations.filter((i) => i.status === "PENDING").length;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Mail className="w-7 h-7 text-primary" />
              Brand Invitations
              {pendingCount > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 ml-1">
                  {pendingCount} new
                </span>
              )}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Review collaboration invitations from brands and respond to them.
            </p>
          </div>
          <Link href="/creator/campaigns">
            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
              <Megaphone className="w-4 h-4" />
              Browse Campaigns
            </Button>
          </Link>
        </div>

        {!loading && invitations.length > 0 && <StatsBar invitations={invitations} />}

        {/* Filter tabs */}
        {invitations.length > 0 && (
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
            {filterTabs.map((tab) => {
              const count = tab.value === "ALL"
                ? invitations.length
                : invitations.filter((i) => i.status === tab.value).length;
              return (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={cn(
                    "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border",
                    statusFilter === tab.value
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-white dark:bg-zinc-900 text-muted-foreground border-zinc-200 dark:border-zinc-700 hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="p-5 space-y-3">
                  <div className="h-7 w-32 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
                  <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-full" />
                  <div className="flex gap-2 pt-2">
                    <div className="flex-1 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
                    <div className="flex-1 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : invitations.length === 0 ? (
          <RichEmptyState
            icon={<Mail className="w-8 h-8 text-violet-500" />}
            headline="Your invite inbox is quiet"
            sub="Brands discover and hand-pick creators with complete profiles. The more you fill in, the more invitations you'll attract."
            primary={{ label: "Complete Profile", href: "/creator/settings", icon: <Sparkles className="w-4 h-4" /> }}
            secondary={{ label: "Browse campaigns instead", href: "/creator/campaigns" }}
            tips={[
              { icon: <Building2 className="w-3 h-3" />, label: "Get chosen by top brands" },
              { icon: <DollarSign className="w-3 h-3" />, label: "Review offered budgets" },
              { icon: <Sparkles className="w-3 h-3" />, label: "Stand out with a great profile" },
            ]}
            ambient="purple"
          />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-14 text-center">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center mb-3">
              <Mail className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
            </div>
            <p className="font-medium text-sm mb-1">
              No {statusFilter.toLowerCase()} invitations
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Try a different filter to see more.
            </p>
            <button
              onClick={() => setStatusFilter("ALL")}
              className="text-xs font-medium text-primary hover:underline"
            >
              Show all invitations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((inv) => (
              <InvitationCard
                key={inv.id}
                invitation={inv}
                onAccept={(id) => handleRespond(id, "ACCEPTED")}
                onDecline={(id) => handleRespond(id, "DECLINED")}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyInvitations;
