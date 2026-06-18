"use client";

import { useState, useEffect, useRef } from "react";
import {
  Wifi, Zap, RefreshCw, TrendingUp, Users, BarChart3, Loader2,
  CheckCircle2, AlertCircle, Heart, MessageCircle, Eye, Pencil, Trash2,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  startVerifyAction,
  pollVerifyAction,
  confirmSyncAction,
  type Platform,
  type AccountPreview,
} from "@/app/actions/apify-sync";
import { getMyProfileAction, type FullProfile } from "@/app/actions/profile";
import { getSocialPostsAction, deletePostAction, clearBrokenPostImagesAction, type SocialPostItem } from "@/app/actions/social-posts";
import { removePlatformAction } from "@/app/actions/social-connections";

// ─── Platform config ──────────────────────────────────────────────────────────

type PlatformConfig = {
  id: Platform | "youtube";
  label: string;
  bg: string;
  emoji: string;
  syncable: boolean;
  placeholder: string;
};

const PLATFORMS: PlatformConfig[] = [
  {
    id: "instagram", label: "Instagram", emoji: "📷",
    bg: "bg-pink-500/10 border-pink-500/20",
    syncable: true, placeholder: "your_handle",
  },
  {
    id: "tiktok", label: "TikTok", emoji: "📱",
    bg: "bg-zinc-800 border-zinc-700",
    syncable: true, placeholder: "your_handle",
  },
  {
    id: "youtube", label: "YouTube", emoji: "▶️",
    bg: "bg-red-500/10 border-red-500/20",
    syncable: false, placeholder: "",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number | null | undefined): string => {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
};

// ─── Sync Modal (2-step: verify preview → confirm sync) ──────────────────────

type SyncPhase =
  | "idle"
  | "verifying"
  | "preview"
  | "confirming"
  | "done"
  | "error_not_found"
  | "error_private"
  | "error_generic";

function SyncModal({
  userId,
  platform,
  onDone,
  onClose,
}: {
  userId: string;
  platform: Platform;
  onDone: () => void;
  onClose: () => void;
}) {
  const cfg = PLATFORMS.find((p) => p.id === platform)!;
  const [handle, setHandle] = useState("");
  const [phase, setPhase] = useState<SyncPhase>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [preview, setPreview] = useState<AccountPreview | null>(null);
  const [datasetId, setDatasetId] = useState<string | null>(null);
  const { toast } = useToast();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  };
  useEffect(() => () => stop(), []);

  // ── Step 1: Start verify run ──────────────────────────────────────────────
  const handlePreview = async () => {
    if (!handle.trim()) return;
    setPhase("verifying");
    setErrorMsg("");

    const start = await startVerifyAction(handle.trim(), platform);
    if ("error" in start) {
      setPhase("error_generic");
      setErrorMsg(start.error);
      return;
    }

    const { runId } = start;
    pollRef.current = setInterval(async () => {
      const result = await pollVerifyAction(runId, platform, handle.trim());
      if (result.state === "running") return;
      stop();

      if (result.state === "found") {
        setPreview(result.preview);
        setDatasetId(result.datasetId);
        setPhase("preview");
      } else if (result.state === "not_found") {
        setPhase("error_not_found");
      } else if (result.state === "private") {
        setPhase("error_private");
      } else {
        setPhase("error_generic");
        setErrorMsg(result.error);
      }
    }, 3_000);
  };

  // ── Step 2: Confirm and save ──────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!datasetId) return;
    setPhase("confirming");

    const result = await confirmSyncAction(datasetId, userId, platform);
    if (result.success) {
      setPhase("done");
      toast({
        title: `${cfg.label} connected!`,
        description: `${fmt(result.platformFollowers)} followers imported.`,
      });
      onDone();
    } else {
      setPhase("error_generic");
      setErrorMsg(result.error);
    }
  };

  const handleReset = () => {
    stop();
    setPhase("idle");
    setPreview(null);
    setDatasetId(null);
    setErrorMsg("");
  };

  const busy = phase === "verifying" || phase === "confirming";

  return (
    <DialogContent className="sm:max-w-sm bg-zinc-950 border-zinc-800 text-white">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <span className="text-xl">{cfg.emoji}</span>
          {phase === "preview" ? "Confirm Account" : `Connect ${cfg.label}`}
        </DialogTitle>
        <DialogDescription className="text-zinc-400 text-sm">
          {phase === "preview"
            ? "Is this your account?"
            : "Pull your follower count and latest posts via Apify."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-1">

        {/* ── Phase: idle — handle input + warning ── */}
        {phase === "idle" && (
          <>
            <div className="flex items-start gap-2.5 rounded-lg bg-amber-950/40 border border-amber-700/40 px-3.5 py-3">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300/90 leading-relaxed">
                Your <strong>{cfg.label}</strong> account must be <strong>public</strong>. Private accounts cannot be verified.
              </p>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">@</span>
              <Input
                value={handle}
                onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))}
                placeholder={cfg.placeholder}
                className="pl-7 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-violet-500 focus-visible:ring-0"
                onKeyDown={(e) => e.key === "Enter" && handlePreview()}
                autoFocus
              />
            </div>
          </>
        )}

        {/* ── Phase: verifying ── */}
        {phase === "verifying" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
            <p className="text-sm text-zinc-300">Looking up @{handle}…</p>
            <p className="text-xs text-zinc-600">This takes 30–60 seconds</p>
          </div>
        )}

        {/* ── Phase: preview — show account card ── */}
        {phase === "preview" && preview && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex items-center gap-4">
            {preview.avatarUrl ? (
              <img
                src={preview.avatarUrl}
                alt={preview.displayName ?? "avatar"}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-zinc-700 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-2xl shrink-0">
                {cfg.emoji}
              </div>
            )}
            <div className="min-w-0">
              {preview.displayName && (
                <p className="font-semibold text-white text-sm truncate">{preview.displayName}</p>
              )}
              <p className="text-zinc-400 text-xs">@{preview.handle}</p>
              {preview.followerCount != null && (
                <p className="text-zinc-500 text-xs mt-1">{fmt(preview.followerCount)} followers</p>
              )}
            </div>
          </div>
        )}

        {/* ── Phase: confirming ── */}
        {phase === "confirming" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
            <p className="text-sm text-zinc-300">Syncing your data…</p>
          </div>
        )}

        {/* ── Phase: done ── */}
        {phase === "done" && (
          <div className="flex items-center gap-3 rounded-lg bg-emerald-950/50 border border-emerald-800/50 px-4 py-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-sm text-emerald-300">Connected! Your data has been saved.</p>
          </div>
        )}

        {/* ── Phase: account not found ── */}
        {phase === "error_not_found" && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg bg-zinc-900 border border-zinc-700 px-4 py-3">
              <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white font-medium">Account not found</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  No account was found for <strong>@{handle}</strong> on {cfg.label}. Please check the username and try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Phase: account is private ── */}
        {phase === "error_private" && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg bg-amber-950/40 border border-amber-700/40 px-4 py-3">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white font-medium">Account is private</p>
                <p className="text-xs text-amber-300/80 mt-0.5">
                  <strong>@{handle}</strong> is set to private. Please make your account public in your {cfg.label} settings and try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Phase: generic error ── */}
        {phase === "error_generic" && (
          <div className="flex items-start gap-3 rounded-lg bg-red-950/50 border border-red-800/50 px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300 leading-relaxed">{errorMsg}</p>
          </div>
        )}
      </div>

      <DialogFooter className="gap-2">
        {/* Cancel / Close */}
        <Button
          variant="outline"
          onClick={phase === "done" ? onClose : phase === "preview" || phase.startsWith("error") ? handleReset : onClose}
          disabled={busy}
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
        >
          {phase === "done" ? "Close" : phase === "preview" ? "That's not me" : phase.startsWith("error") ? "Try again" : "Cancel"}
        </Button>

        {/* Primary action */}
        {phase === "idle" && (
          <Button
            onClick={handlePreview}
            disabled={!handle.trim()}
            className="gap-2 bg-violet-600 hover:bg-violet-500 text-white border-0"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Preview Account
          </Button>
        )}
        {phase === "preview" && (
          <Button
            onClick={handleConfirm}
            className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white border-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Yes, sync my data
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
}

// ─── Platform Card ────────────────────────────────────────────────────────────

function PlatformCard({
  platform,
  isConnected,
  followers,
  engagement,
  onSync,
  onRemove,
}: {
  platform: PlatformConfig;
  isConnected: boolean;
  followers: number | null;
  engagement: number | null;
  onSync: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 flex items-center gap-4 transition-all",
        isConnected ? "bg-zinc-900 border-zinc-800" : "bg-zinc-900/40 border-zinc-800/50",
      )}
    >
      {/* Icon */}
      <div className={cn("w-12 h-12 rounded-xl border flex items-center justify-center text-2xl shrink-0", platform.bg)}>
        {platform.emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-semibold text-sm text-white">{platform.label}</p>
          {isConnected ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Connected
            </span>
          ) : (
            <span className="text-[10px] font-medium text-zinc-500 bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded-full">
              Not Connected
            </span>
          )}
        </div>
        {isConnected && followers != null ? (
          <p className="text-xs text-zinc-400">
            {fmt(followers)} followers{engagement ? ` · ${engagement}% eng` : ""}
          </p>
        ) : (
          <p className="text-xs text-zinc-600">
            {platform.syncable ? "Sync to import your stats" : "Coming soon"}
          </p>
        )}
      </div>

      {/* Actions */}
      {platform.syncable && (
        <div className="flex items-center gap-1.5 shrink-0">
          {isConnected && (
            <>
              <Button
                size="icon"
                variant="ghost"
                onClick={onSync}
                className="w-8 h-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                title={`Re-sync ${platform.label}`}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={onRemove}
                className="w-8 h-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                title={`Remove ${platform.label}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
          {!isConnected && (
            <Button
              size="sm"
              onClick={onSync}
              className="gap-1.5 bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30 hover:text-violet-200"
              variant="outline"
            >
              <Zap className="w-3.5 h-3.5" /> Connect
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

function PostCard({
  post,
  onDelete,
}: {
  post: SocialPostItem;
  onDelete?: (id: string) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleting(true);
    const res = await deletePostAction(post.id);
    setDeleting(false);
    if (res.error) {
      toast({ title: "Failed to remove post", description: res.error, variant: "destructive" });
    } else {
      onDelete?.(post.id);
    }
  };

  const emoji = post.platform === "instagram" ? "📷" : "📱";

  const inner = (
    <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 group cursor-pointer relative">
      {/* Delete button */}
      {onDelete && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/70 border border-zinc-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600/80 hover:border-red-500"
          title="Remove post"
        >
          {deleting ? (
            <Loader2 className="w-3 h-3 text-white animate-spin" />
          ) : (
            <AlertCircle className="w-3 h-3 text-white" />
          )}
        </button>
      )}

      {/* Image or fallback */}
      {post.imageUrl && !imgError ? (
        <div className="aspect-square w-full overflow-hidden bg-zinc-800">
          <img
            src={post.imageUrl}
            alt={post.caption ?? "Post"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="aspect-square w-full bg-zinc-800 flex items-center justify-center text-3xl">
          {emoji}
        </div>
      )}

      <div className="p-3 space-y-1.5">
        {post.caption && (
          <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">{post.caption}</p>
        )}
        <div className="flex items-center gap-3 text-[11px] text-zinc-600">
          {post.likes != null && (
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{fmt(post.likes)}</span>
          )}
          {post.comments != null && (
            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{fmt(post.comments)}</span>
          )}
          {post.views != null && (
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{fmt(post.views)}</span>
          )}
        </div>
      </div>
    </div>
  );

  if (post.postUrl) {
    return (
      <a href={post.postUrl} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    );
  }
  return inner;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const PresencePage = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [fullProfile, setFullProfile] = useState<FullProfile | null>(null);
  const [posts, setPosts] = useState<SocialPostItem[]>([]);
  const [syncTarget, setSyncTarget] = useState<Platform | null>(null);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    const [p, postsRes] = await Promise.all([getMyProfileAction(), getSocialPostsAction()]);
    if (p) setFullProfile(p);
    if (!postsRes.error) setPosts(postsRes.data);
  };

  useEffect(() => {
    // Silently clear any posts with broken image URLs from a previous code version
    clearBrokenPostImagesAction().catch(() => {});
    reload().finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Per-platform stats lookup
  const getPerPlatformStats = (platformId: string) => {
    return fullProfile?.platformStats?.find((s) => s.platform === platformId) ?? null;
  };

  const connectedPlatforms = fullProfile?.connectedPlatforms ?? [];
  const totalFollowers = fullProfile?.followerCount ?? null;
  const avgEngagement = fullProfile?.averageEngagement ?? null;
  const niches = fullProfile?.topNiches ?? [];
  const lastSynced = fullProfile?.lastSyncedAt;

  const handleSyncDone = async () => {
    setSyncTarget(null);
    await reload();
  };

  const handleRemoveConfirm = async () => {
    if (!removeTarget) return;
    setRemoving(true);
    const res = await removePlatformAction(removeTarget);
    setRemoving(false);
    setRemoveTarget(null);
    if (res.error) {
      toast({ title: "Failed to remove", description: res.error, variant: "destructive" });
    } else {
      toast({ title: `${removeTarget.charAt(0).toUpperCase() + removeTarget.slice(1)} removed` });
      await reload();
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <Wifi className="w-5 h-5 text-violet-400" />
            <h1 className="font-display text-2xl font-bold">Social Connections</h1>
          </div>
          <p className="text-sm text-zinc-400">
            Connect your platforms and track performance across all channels.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-10">
            {/* ── Connect Accounts ── */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                  Connect Accounts
                </h2>
                {lastSynced && (
                  <span className="text-xs text-zinc-600">
                    Last synced {new Date(lastSynced).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {PLATFORMS.map((p) => {
                  const perPlatform = getPerPlatformStats(p.id);
                  return (
                    <PlatformCard
                      key={p.id}
                      platform={p}
                      isConnected={connectedPlatforms.includes(p.id)}
                      followers={perPlatform?.followerCount ?? null}
                      engagement={perPlatform?.engagementRate ?? null}
                      onSync={() => p.syncable && setSyncTarget(p.id as Platform)}
                      onRemove={() => setRemoveTarget(p.id)}
                    />
                  );
                })}
              </div>
            </section>

            {/* ── Performance Snapshot ── */}
            <section>
              <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">
                Performance Snapshot
              </h2>

              {connectedPlatforms.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-800 p-10 text-center">
                  <Zap className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-sm text-zinc-400 font-medium mb-1">No data yet</p>
                  <p className="text-xs text-zinc-600">
                    Connect a platform above to pull your stats.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-violet-400" />
                      <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium">Total Followers</p>
                    </div>
                    {totalFollowers != null ? (
                      <p className="text-3xl font-bold font-display text-white">{fmt(totalFollowers)}</p>
                    ) : (
                      <p className="text-sm text-zinc-600 font-medium">Not Connected</p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium">Avg Engagement</p>
                    </div>
                    {avgEngagement != null ? (
                      <p className="text-3xl font-bold font-display text-emerald-400">
                        {avgEngagement.toFixed(1)}%
                      </p>
                    ) : (
                      <p className="text-sm text-zinc-600 font-medium">Not Connected</p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="w-4 h-4 text-cyan-400" />
                      <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium">Niches</p>
                    </div>
                    {niches.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {niches.slice(0, 3).map((n) => (
                          <span key={n} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20 font-medium">
                            {n}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-600 font-medium">Not Connected</p>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* ── Latest Posts grouped by platform ── */}
            {(() => {
              const PLATFORM_LABELS: Record<string, { label: string; emoji: string }> = {
                instagram: { label: "Instagram Posts", emoji: "📷" },
                tiktok: { label: "TikTok Posts", emoji: "📱" },
              };
              const groups = Object.entries(PLATFORM_LABELS).map(([key, meta]) => ({
                key,
                meta,
                items: posts.filter((p) => p.platform === key),
              })).filter((g) => g.items.length > 0);

              if (groups.length === 0) return null;

              return (
                <section className="space-y-8">
                  <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                    Latest Posts
                  </h2>
                  {groups.map(({ key, meta, items }) => (
                    <div key={key}>
                      <p className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                        <span>{meta.emoji}</span> {meta.label}
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {items.slice(0, 3).map((post) => (
                          <PostCard
                            key={post.id}
                            post={post}
                            onDelete={(id) => setPosts((prev) => prev.filter((p) => p.id !== id))}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </section>
              );
            })()}
          </div>
        )}
      </div>

      {/* Sync Modal — locked to the clicked platform */}
      {syncTarget && (
        <Dialog open onOpenChange={(open) => !open && setSyncTarget(null)}>
          <SyncModal
            userId={profile?.id ?? ""}
            platform={syncTarget}
            onDone={handleSyncDone}
            onClose={() => setSyncTarget(null)}
          />
        </Dialog>
      )}

      {/* Remove Confirm Dialog */}
      <AlertDialog open={!!removeTarget} onOpenChange={(open) => !open && setRemoveTarget(null)}>
        <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {removeTarget}?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This will delete all synced data and posts for{" "}
              <span className="capitalize font-medium text-white">{removeTarget}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveConfirm}
              disabled={removing}
              className="bg-red-600 hover:bg-red-500 text-white border-0 gap-2"
            >
              {removing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default PresencePage;
