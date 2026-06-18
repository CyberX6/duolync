"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check, X, Clock, Users, DollarSign, TrendingUp, FileText, Filter,
  MessageSquare, ExternalLink, ChevronRight, Eye, SlidersHorizontal,
  Megaphone, CheckCircle2, XCircle, ArrowLeft, Loader2, Smartphone,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { useMessaging, type ConversationRecipient } from "@/app/_components/messaging/MessagingContext";
import {
  getProposalsAction,
  updateProposalStatusAction,
  type ProposalWithDetails,
} from "@/app/actions/proposals";
import { cn } from "@/lib/utils";

// ── Platform helpers ──────────────────────────────────────────────────────────

const PLATFORM_EMOJI: Record<string, string> = {
  instagram: "📸",
  tiktok: "🎵",
  youtube: "▶️",
  twitter: "🐦",
  linkedin: "💼",
  pinterest: "📌",
  twitch: "🎮",
  snapchat: "👻",
};

const PLATFORM_LABEL: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  twitter: "X / Twitter",
  linkedin: "LinkedIn",
  pinterest: "Pinterest",
  twitch: "Twitch",
  snapchat: "Snapchat",
};

function PlatformBadge({ platform }: { platform: string }) {
  const key = platform.toLowerCase();
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
      <span>{PLATFORM_EMOJI[key] ?? "🌐"}</span>
      <span>{PLATFORM_LABEL[key] ?? platform}</span>
    </span>
  );
}

// ── Reject reason modal ───────────────────────────────────────────────────────

interface RejectModalProps {
  open: boolean;
  creatorName: string | null;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  loading: boolean;
}

function RejectReasonModal({ open, creatorName, onConfirm, onCancel, loading }: RejectModalProps) {
  const [reason, setReason] = useState("");

  // Reset on open
  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-md w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Decline proposal
          </DialogTitle>
          <DialogDescription>
            Let {creatorName ?? "the creator"} know why their proposal wasn&apos;t the right fit. This helps them improve future applications.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-2">
          <label className="text-sm font-medium">Reason (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Not the right niche for this campaign, budget mismatch, looking for a different content format…"
            rows={4}
            maxLength={500}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">{reason.length}/500</p>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(reason)}
            disabled={loading}
            className="gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
            Decline proposal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Status badge ───────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    icon: Clock,
  },
  UNDER_REVIEW: {
    label: "In Review",
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    icon: Eye,
  },
  ACCEPTED: {
    label: "Accepted",
    className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
    icon: Check,
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    icon: X,
  },
  WITHDRAWN: {
    label: "Withdrawn",
    className: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
    icon: X,
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border", cfg.className)}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function getInitials(name: string | null) {
  return (name ?? "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// ── Application Detail Modal ──────────────────────────────────────────────────

interface DetailModalProps {
  proposal: ProposalWithDetails | null;
  onClose: () => void;
  onAccept: (id: string) => void;
  onRequestReject: (p: ProposalWithDetails) => void;
  loading: boolean;
}

function ApplicationDetailModal({ proposal, onClose, onAccept, onRequestReject, loading }: DetailModalProps) {
  const { openChatWindow } = useMessaging();

  if (!proposal) return null;
  const { creator } = proposal;
  const cfg = STATUS_CONFIG[proposal.status] ?? STATUS_CONFIG.PENDING;

  const handleMessage = () => {
    const recipient: ConversationRecipient = {
      id: creator.userId,
      full_name: creator.name,
      avatar_url: creator.avatarUrl,
      user_type: "creator",
    };
    openChatWindow(recipient);
    onClose();
  };

  return (
    <Dialog open={!!proposal} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Application Details
          </DialogTitle>
        </DialogHeader>

        {/* Creator profile */}
        <div className="flex items-start gap-4 pb-4 border-b border-border">
          <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-zinc-200 dark:ring-zinc-700 shrink-0">
            {creator.avatarUrl ? (
              <img src={creator.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {getInitials(creator.name)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/profile/${creator.userId}`}
                className="font-bold text-base hover:text-primary transition-colors flex items-center gap-1.5"
                onClick={onClose}
              >
                {creator.name ?? "Creator"}
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </Link>
              <StatusBadge status={proposal.status} />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5 flex-wrap">
              {creator.niche && <span>{creator.niche}</span>}
              {creator.totalFollowers > 0 && <span>· {formatFollowers(creator.totalFollowers)} followers</span>}
            </div>
            {proposal.selectedPlatform && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-xs text-muted-foreground">Applying with:</span>
                <PlatformBadge platform={proposal.selectedPlatform} />
              </div>
            )}

            {/* Message + Profile actions */}
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" className="gap-1.5" onClick={handleMessage}>
                <MessageSquare className="w-3.5 h-3.5" />
                Message
              </Button>
              <Link href={`/profile/${creator.userId}`} onClick={onClose}>
                <Button size="sm" variant="ghost" className="gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Proposal details */}
        <div className="space-y-4 py-2">
          {/* Rate */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Proposed Rate</p>
              <p className="font-bold text-xl flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                {proposal.rate.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Submitted</p>
              <p className="font-semibold text-sm">{timeAgo(proposal.createdAt)}</p>
            </div>
          </div>

          {/* Campaign */}
          <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border p-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Campaign</p>
              <p className="font-semibold text-sm truncate">{proposal.campaign.title}</p>
              <p className="text-xs text-muted-foreground">Budget: ${proposal.campaign.budget.toLocaleString()}</p>
            </div>
            <Link href={`/brand/campaigns/${proposal.campaign.id}`} onClick={onClose}>
              <Button size="sm" variant="ghost" className="gap-1.5 shrink-0">
                <Megaphone className="w-3.5 h-3.5" />
                Open
              </Button>
            </Link>
          </div>

          {/* Cover letter */}
          {proposal.coverLetter && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Cover Letter</p>
              <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border p-4 text-sm text-muted-foreground leading-relaxed italic">
                "{proposal.coverLetter}"
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {(proposal.status === "PENDING" || proposal.status === "UNDER_REVIEW") && (
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
            <Button
              className="flex-1 gap-1.5"
              onClick={() => { onAccept(proposal.id); onClose(); }}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Accept
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={() => onClose()}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Negotiate
            </Button>
            <Button
              variant="outline"
              className="flex-1 gap-1.5 hover:border-red-300 hover:text-red-600"
              onClick={() => { onRequestReject(proposal); onClose(); }}
              disabled={loading}
            >
              <X className="w-4 h-4" />
              Decline
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Proposal card ─────────────────────────────────────────────────────────────

const ProposalCard = ({
  proposal,
  onAccept,
  onRequestReject,
  onOpenDetail,
  loading,
}: {
  proposal: ProposalWithDetails;
  onAccept: (id: string) => void;
  onRequestReject: (p: ProposalWithDetails) => void;
  onOpenDetail: (p: ProposalWithDetails) => void;
  loading: boolean;
}) => {
  const { openChatWindow } = useMessaging();
  const { creator } = proposal;

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const recipient: ConversationRecipient = {
      id: creator.userId,
      full_name: creator.name,
      avatar_url: creator.avatarUrl,
      user_type: "creator",
    };
    openChatWindow(recipient);
  };

  return (
    <div
      className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
      onClick={() => onOpenDetail(proposal)}
    >
      {/* Header row */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-700 shrink-0">
          {creator.avatarUrl ? (
            <img src={creator.avatarUrl} alt={creator.name ?? "Creator"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-violet-600 to-purple-600">
              {getInitials(creator.name)}
            </div>
          )}
        </div>

        {/* Creator info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Clickable name — stop propagation so it doesn't also trigger the modal */}
            <Link
              href={`/profile/${creator.userId}`}
              className="font-semibold text-sm hover:text-primary transition-colors hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {creator.name ?? "Creator"}
            </Link>
            <StatusBadge status={proposal.status} />
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
            {creator.niche && (
              <span className="flex items-center gap-1">
                <Filter className="w-3 h-3" />
                {creator.niche}
              </span>
            )}
            {creator.totalFollowers > 0 && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {formatFollowers(creator.totalFollowers)}
              </span>
            )}
            <span>{timeAgo(proposal.createdAt)}</span>
          </div>
          {proposal.selectedPlatform && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <Smartphone className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Applying with:</span>
              <PlatformBadge platform={proposal.selectedPlatform} />
            </div>
          )}
        </div>

        {/* Rate + message button */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="flex items-center gap-1 font-bold text-sm">
            <DollarSign className="w-3.5 h-3.5 text-green-500" />
            {proposal.rate.toLocaleString()}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleMessage}
            title={`Message ${creator.name ?? "creator"}`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Message
          </Button>
        </div>
      </div>

      {/* Campaign pill — clickable */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Campaign:</span>
        <Link
          href={`/brand/campaigns/${proposal.campaign.id}`}
          className="text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-primary/10 hover:text-primary px-2 py-0.5 rounded-full truncate max-w-[180px] transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {proposal.campaign.title}
        </Link>
        <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          ${proposal.campaign.budget.toLocaleString()}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      {/* Creator message */}
      {proposal.coverLetter && (
        <p className="mt-3 text-sm text-muted-foreground bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 line-clamp-2 italic">
          &ldquo;{proposal.coverLetter}&rdquo;
        </p>
      )}

      {/* Rejection reason (brand note) */}
      {proposal.status === "REJECTED" && proposal.brandNote && (
        <div className="mt-2 flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-600 dark:text-red-400">{proposal.brandNote}</p>
        </div>
      )}

      {/* Quick actions — only for pending, stop propagation */}
      {proposal.status === "PENDING" && (
        <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            onClick={(e) => { e.stopPropagation(); onAccept(proposal.id); }}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => { e.stopPropagation(); onOpenDetail(proposal); }}
            disabled={loading}
            className="flex-1 gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Negotiate
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => { e.stopPropagation(); onRequestReject(proposal); }}
            disabled={loading}
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-500/10 gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            Decline
          </Button>
        </div>
      )}
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

type FilterTab = "ALL" | "PENDING" | "ACCEPTED" | "REJECTED";

const Proposals = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [proposals, setProposals] = useState<ProposalWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [detailProposal, setDetailProposal] = useState<ProposalWithDetails | null>(null);
  // Reject reason modal
  const [rejectTarget, setRejectTarget] = useState<ProposalWithDetails | null>(null);

  const load = useCallback(async () => {
    const result = await getProposalsAction();
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      setProposals(result.data);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleAccept = async (proposalId: string) => {
    setActionLoading(true);
    const result = await updateProposalStatusAction(proposalId, "ACCEPTED");
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Proposal accepted! 🎉", description: "The creator has been notified." });
      setProposals((prev) => prev.map((p) => (p.id === proposalId ? { ...p, status: "ACCEPTED" } : p)));
    }
    setActionLoading(false);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectTarget) return;
    setActionLoading(true);
    const result = await updateProposalStatusAction(rejectTarget.id, "REJECTED", reason);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Proposal declined.", description: "The creator has been notified." });
      setProposals((prev) =>
        prev.map((p) =>
          p.id === rejectTarget.id ? { ...p, status: "REJECTED", brandNote: reason || null } : p,
        ),
      );
      setRejectTarget(null);
    }
    setActionLoading(false);
  };

  const filtered = activeTab === "ALL" ? proposals : proposals.filter((p) => p.status === activeTab);

  const counts = {
    ALL: proposals.length,
    PENDING: proposals.filter((p) => p.status === "PENDING").length,
    ACCEPTED: proposals.filter((p) => p.status === "ACCEPTED").length,
    REJECTED: proposals.filter((p) => p.status === "REJECTED").length,
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="mb-7">
          <h1 className="font-display text-3xl font-bold mb-1 flex items-center gap-3">
            <FileText className="w-7 h-7 text-primary" />
            Proposals
          </h1>
          <p className="text-muted-foreground text-sm">
            Review and manage creator applications for your campaigns
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(["PENDING", "ACCEPTED", "REJECTED"] as const).map((s) => {
            const colors: Record<string, string> = {
              PENDING: "border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-500/5",
              ACCEPTED: "border-green-200 bg-green-50 dark:border-green-800/50 dark:bg-green-500/5",
              REJECTED: "border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-500/5",
            };
            const textColors: Record<string, string> = {
              PENDING: "text-amber-700 dark:text-amber-400",
              ACCEPTED: "text-green-700 dark:text-green-400",
              REJECTED: "text-red-700 dark:text-red-400",
            };
            return (
              <div key={s} className={cn("rounded-xl border p-4 text-center", colors[s])}>
                <div className={cn("text-2xl font-bold", textColors[s])}>{counts[s]}</div>
                <div className="text-xs text-muted-foreground capitalize mt-0.5">{s.toLowerCase()}</div>
              </div>
            );
          })}
        </div>

        {/* Filter tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)} className="mb-5">
          <TabsList>
            <TabsTrigger value="ALL">All ({counts.ALL})</TabsTrigger>
            <TabsTrigger value="PENDING">Pending ({counts.PENDING})</TabsTrigger>
            <TabsTrigger value="ACCEPTED">Accepted ({counts.ACCEPTED})</TabsTrigger>
            <TabsTrigger value="REJECTED">Rejected ({counts.REJECTED})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-1/3" />
                    <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-primary/50" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">
              {activeTab === "ALL" ? "No proposals yet" : `No ${activeTab.toLowerCase()} proposals`}
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-6">
              {activeTab === "ALL"
                ? "Create active campaigns to start receiving proposals from creators."
                : "Switch to the All tab to see all proposals."}
            </p>
            {activeTab === "ALL" && (
              <Button className="btn-gradient rounded-xl" onClick={() => router.push("/brand/campaigns")}>
                Manage Campaigns
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((p) => (
              <ProposalCard
                key={p.id}
                proposal={p}
                onAccept={handleAccept}
                onRequestReject={setRejectTarget}
                onOpenDetail={setDetailProposal}
                loading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Application detail modal */}
      <ApplicationDetailModal
        proposal={detailProposal}
        onClose={() => setDetailProposal(null)}
        onAccept={handleAccept}
        onRequestReject={(p) => { setDetailProposal(null); setRejectTarget(p); }}
        loading={actionLoading}
      />

      {/* Reject reason modal */}
      <RejectReasonModal
        open={!!rejectTarget}
        creatorName={rejectTarget?.creator.name ?? null}
        onConfirm={handleRejectConfirm}
        onCancel={() => setRejectTarget(null)}
        loading={actionLoading}
      />
    </MainLayout>
  );
};

export default Proposals;
