"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import {
  Send, Clock, CheckCircle2, XCircle, Layers, Eye,
  DollarSign, Calendar, Building2, ChevronRight, Loader2,
  FileText, TrendingUp, Megaphone, X, RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  getMyApplicationsAction,
  withdrawApplicationAction,
  type MyApplication,
} from "@/app/actions/creator-campaigns";

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, {
  label: string;
  color: string;
  bg: string;
  icon: React.ElementType;
  description: string;
}> = {
  PENDING: {
    label: "Pending",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700/40",
    icon: Clock,
    description: "Waiting for the brand to review.",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700/40",
    icon: Eye,
    description: "The brand is reviewing your application.",
  },
  ACCEPTED: {
    label: "Accepted",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-700/40",
    icon: CheckCircle2,
    description: "Congratulations! The brand selected you.",
  },
  REJECTED: {
    label: "Not Selected",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700/40",
    icon: XCircle,
    description: "The brand went with another creator.",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    color: "text-zinc-500 dark:text-zinc-400",
    bg: "bg-zinc-50 border-zinc-200 dark:bg-zinc-800/40 dark:border-zinc-700",
    icon: RotateCcw,
    description: "You withdrew this application.",
  },
};

// ── Platform emoji ────────────────────────────────────────────────────────────

const PLATFORM_EMOJI: Record<string, string> = {
  instagram: "📸", tiktok: "🎵", youtube: "▶️", twitter: "🐦",
  linkedin: "💼", pinterest: "📌", twitch: "🎮", snapchat: "👻",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBudget(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
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
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDeadline(iso: string | null) {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return { text: "Expired", urgent: false };
  const days = Math.ceil(diff / 86_400_000);
  return {
    text: days <= 1 ? "Due today" : `${days}d left`,
    urgent: days <= 3,
  };
}

// ── Application Card ──────────────────────────────────────────────────────────

interface AppCardProps {
  application: MyApplication;
  onWithdraw: (id: string) => void;
  withdrawing: boolean;
}

function ApplicationCard({ application, onWithdraw, withdrawing }: AppCardProps) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[application.status] ?? STATUS_CONFIG.PENDING;
  const StatusIcon = status.icon;
  const deadline = formatDeadline(application.campaign.deadline);
  const { campaign } = application;

  return (
    <div className={cn(
      "bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden transition-all duration-200",
      "hover:shadow-md dark:hover:shadow-black/20",
      application.status === "ACCEPTED" && "ring-2 ring-emerald-400/50 dark:ring-emerald-500/40",
    )}>
      {/* Campaign image strip */}
      {campaign.imageUrl && (
        <div className="w-full h-24 overflow-hidden">
          <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-4 sm:p-5">
        {/* Status badge */}
        <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border mb-3", status.bg, status.color)}>
          <StatusIcon className="w-3.5 h-3.5" />
          {status.label}
        </div>

        {/* Campaign title + brand */}
        <h3 className="font-bold text-base leading-snug line-clamp-2 mb-1">
          {campaign.title}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <Link
            href={`/profile/${campaign.brand.userId}`}
            className="truncate font-medium hover:text-primary hover:underline underline-offset-2 transition-colors"
          >
            {campaign.brand.companyName}
          </Link>
          {campaign.brand.industry && (
            <span className="text-muted-foreground/60 truncate">· {campaign.brand.industry}</span>
          )}
        </div>

        {/* Key meta */}
        <div className="flex items-center gap-4 text-sm flex-wrap mb-3">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold">{formatBudget(application.proposedRate)}</span>
            <span className="text-xs text-muted-foreground">your rate</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <Clock className="w-3.5 h-3.5" />
            Applied {timeAgo(application.createdAt)}
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
                {PLATFORM_EMOJI[pid] ?? "🌐"} {pid}
              </span>
            ))}
          </div>
        )}

        {/* Status description */}
        <p className={cn("text-xs mb-3", status.color)}>{status.description}</p>

        {/* Expandable: cover letter */}
        {application.coverLetter && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <FileText className="w-3.5 h-3.5" />
            {expanded ? "Hide" : "View"} cover letter
            <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", expanded && "rotate-90")} />
          </button>
        )}
        {expanded && application.coverLetter && (
          <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 p-3 text-sm text-muted-foreground mb-3 leading-relaxed">
            {application.coverLetter}
          </div>
        )}

        {/* Withdraw button */}
        {application.status === "PENDING" && (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-muted-foreground hover:text-red-500 hover:border-red-300 mt-1"
            onClick={() => onWithdraw(application.id)}
            disabled={withdrawing}
          >
            {withdrawing ? (
              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
            ) : (
              <X className="w-3.5 h-3.5 mr-2" />
            )}
            Withdraw Application
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Stats bar ─────────────────────────────────────────────────────────────────

function StatsBar({ applications }: { applications: MyApplication[] }) {
  const stats = [
    { label: "Total", value: applications.length, icon: Send, color: "text-foreground" },
    { label: "Pending", value: applications.filter((a) => a.status === "PENDING").length, icon: Clock, color: "text-amber-600 dark:text-amber-400" },
    { label: "Accepted", value: applications.filter((a) => a.status === "ACCEPTED").length, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Rejected", value: applications.filter((a) => a.status === "REJECTED").length, icon: XCircle, color: "text-red-500 dark:text-red-400" },
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

const MyApplications = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [confirmWithdrawId, setConfirmWithdrawId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getMyApplicationsAction();
    if (!result.error) setApplications(result.data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleWithdraw = async (applicationId: string) => {
    setConfirmWithdrawId(applicationId);
  };

  const confirmWithdraw = async () => {
    const applicationId = confirmWithdrawId;
    if (!applicationId) return;
    setConfirmWithdrawId(null);
    setWithdrawingId(applicationId);
    setApplications((prev) =>
      prev.map((a) => a.id === applicationId ? { ...a, status: "WITHDRAWN" } : a),
    );
    const result = await withdrawApplicationAction(applicationId);
    if (result.error) {
      toast({ variant: "destructive", title: result.error });
      load();
    } else {
      toast({ title: "Application withdrawn." });
    }
    setWithdrawingId(null);
  };

  const filterTabs = [
    { value: "ALL", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "UNDER_REVIEW", label: "In Review" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "REJECTED", label: "Not Selected" },
    { value: "WITHDRAWN", label: "Withdrawn" },
  ];

  const filtered = statusFilter === "ALL"
    ? applications
    : applications.filter((a) => a.status === statusFilter);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Send className="w-7 h-7 text-primary" />
              My Applications
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Track every campaign you've applied to and its current status.
            </p>
          </div>
          <Link href="/creator/campaigns">
            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
              <Megaphone className="w-4 h-4" />
              Browse Campaigns
            </Button>
          </Link>
        </div>

        {!loading && applications.length > 0 && (
          <StatsBar applications={applications} />
        )}

        {/* Filter tabs */}
        {applications.length > 0 && (
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
            {filterTabs.map((tab) => (
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
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="p-5 space-y-3">
                  <div className="h-7 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
                  <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">No applications yet</h3>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              You haven't applied to any campaigns. Find one that matches your niche!
            </p>
            <Link href="/creator/campaigns">
              <Button>
                <Megaphone className="w-4 h-4 mr-2" />
                Browse Campaigns
              </Button>
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">
              No {statusFilter.toLowerCase().replace("_", " ")} applications.
            </p>
            <button onClick={() => setStatusFilter("ALL")} className="mt-2 text-sm text-primary hover:underline">
              Show all
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onWithdraw={handleWithdraw}
                withdrawing={withdrawingId === app.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Withdraw confirmation */}
      <AlertDialog open={confirmWithdrawId !== null} onOpenChange={(open) => { if (!open) setConfirmWithdrawId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw application?</AlertDialogTitle>
            <AlertDialogDescription>
              Your application will be marked as withdrawn. You can re-apply to this campaign later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmWithdraw} className="bg-red-600 hover:bg-red-700 text-white">
              Withdraw
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default MyApplications;
