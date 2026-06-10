"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Check, X, Clock, Users, DollarSign, TrendingUp, FileText, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import {
  getProposalsAction,
  updateProposalStatusAction,
  type ProposalWithDetails,
} from "@/app/actions/proposals";
import { cn } from "@/lib/utils";

// ─── Status badge ──────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; className: string }> = {
    PENDING: {
      label: "Pending",
      className:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    },
    ACCEPTED: {
      label: "Accepted",
      className:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
    },
    REJECTED: {
      label: "Rejected",
      className:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    },
  };
  const cfg = map[status] ?? map.PENDING;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
        cfg.className,
      )}
    >
      {status === "PENDING" && <Clock className="w-3 h-3" />}
      {status === "ACCEPTED" && <Check className="w-3 h-3" />}
      {status === "REJECTED" && <X className="w-3 h-3" />}
      {cfg.label}
    </span>
  );
};

// ─── Proposal card ─────────────────────────────────────────────────────────────

const ProposalCard = ({
  proposal,
  onAccept,
  onReject,
  loading,
}: {
  proposal: ProposalWithDetails;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  loading: boolean;
}) => {
  const { creator } = proposal;
  const initials = (creator.name ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formatFollowers = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
      {/* Header row */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-700 shrink-0">
          {creator.avatarUrl ? (
            <img
              src={creator.avatarUrl}
              alt={creator.name ?? "Creator"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-violet-600 to-purple-600">
              {initials}
            </div>
          )}
        </div>

        {/* Creator info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm truncate">
              {creator.name ?? "Creator"}
            </span>
            <StatusBadge status={proposal.status} />
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
            {creator.niche && (
              <span className="flex items-center gap-1">
                <Filter className="w-3 h-3" />
                {creator.niche}
              </span>
            )}
            {creator.primaryPlatform && (
              <span className="capitalize">{creator.primaryPlatform}</span>
            )}
            {creator.totalFollowers > 0 && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {formatFollowers(creator.totalFollowers)}
              </span>
            )}
            <span>{timeAgo(proposal.createdAt)}</span>
          </div>
        </div>

        {/* Rate */}
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 font-bold text-sm">
            <DollarSign className="w-3.5 h-3.5 text-green-500" />
            {proposal.rate.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground">proposed rate</div>
        </div>
      </div>

      {/* Campaign pill */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Campaign:</span>
        <span className="text-xs font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full truncate max-w-[200px]">
          {proposal.campaign.title}
        </span>
        <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Budget: ${proposal.campaign.budget.toLocaleString()}
        </span>
      </div>

      {/* Cover letter */}
      {proposal.coverLetter && (
        <p className="mt-3 text-sm text-muted-foreground bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 line-clamp-3 italic">
          &ldquo;{proposal.coverLetter}&rdquo;
        </p>
      )}

      {/* Actions */}
      {proposal.status === "PENDING" && (
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            onClick={() => onAccept(proposal.id)}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReject(proposal.id)}
            disabled={loading}
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-500/10 gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            Reject
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

  const load = useCallback(async () => {
    const result = await getProposalsAction();
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      setProposals(result.data);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusUpdate = async (
    proposalId: string,
    status: "ACCEPTED" | "REJECTED",
  ) => {
    setActionLoading(true);
    const result = await updateProposalStatusAction(proposalId, status);
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({
        title: status === "ACCEPTED" ? "Proposal accepted!" : "Proposal rejected",
        description:
          status === "ACCEPTED"
            ? "The creator has been notified."
            : "The creator has been notified.",
      });
      setProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? { ...p, status } : p)),
      );
    }
    setActionLoading(false);
  };

  const filtered =
    activeTab === "ALL"
      ? proposals
      : proposals.filter((p) => p.status === activeTab);

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
              PENDING:
                "border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-500/5",
              ACCEPTED:
                "border-green-200 bg-green-50 dark:border-green-800/50 dark:bg-green-500/5",
              REJECTED:
                "border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-500/5",
            };
            const textColors: Record<string, string> = {
              PENDING: "text-amber-700 dark:text-amber-400",
              ACCEPTED: "text-green-700 dark:text-green-400",
              REJECTED: "text-red-700 dark:text-red-400",
            };
            return (
              <div
                key={s}
                className={cn(
                  "rounded-xl border p-4 text-center",
                  colors[s],
                )}
              >
                <div className={cn("text-2xl font-bold", textColors[s])}>
                  {counts[s]}
                </div>
                <div className="text-xs text-muted-foreground capitalize mt-0.5">
                  {s.toLowerCase()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as FilterTab)}
          className="mb-5"
        >
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
              <div
                key={i}
                className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 animate-pulse"
              >
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
                ? "Create active campaigns in Smart Match to start receiving proposals from creators."
                : "Switch to the All tab to see all proposals."}
            </p>
            {activeTab === "ALL" && (
              <Button
                className="btn-gradient rounded-xl"
                onClick={() => router.push("/brand/smart-match")}
              >
                Create a Campaign
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((p) => (
              <ProposalCard
                key={p.id}
                proposal={p}
                onAccept={(id) => handleStatusUpdate(id, "ACCEPTED")}
                onReject={(id) => handleStatusUpdate(id, "REJECTED")}
                loading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Proposals;
