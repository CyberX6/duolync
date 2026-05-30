"use client";
import { useState, useEffect, useCallback } from "react";
import { useMessaging } from "@/components/messaging/MessagingContext";
import {
  X,
  Maximize2,
  Minimize2,
  BadgeCheck,
  MapPin,
  TrendingUp,
  Users,
  ChevronRight,
  Sparkles,
  MessageSquare,
  Send,
  DollarSign,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// ─── Shared types (re-exported for discover pages) ───────────────────────────

export interface Creator {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  niche: string | null;
  total_followers: number;
  avg_engagement_rate: number;
  primary_platform: string | null;
  location: string | null;
  languages: string[];
  verified?: boolean;
  platforms?: Record<string, string>;
}

type DrawerTab = "overview" | "analytics";

interface ProfileDrawerProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
  /** When provided, clicking "Message" opens the full chat page instead of the quick-panel. */
  onMessage?: (creator: Creator) => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const PLATFORM_META: Record<
  string,
  { abbr: string; label: string; badgeClass: string; barColor: string }
> = {
  instagram: {
    abbr: "IG",
    label: "Instagram",
    badgeClass:
      "bg-gradient-to-br from-purple-600 via-rose-500 to-amber-400 text-white",
    barColor: "bg-gradient-to-r from-purple-500 to-rose-500",
  },
  tiktok: {
    abbr: "TT",
    label: "TikTok",
    badgeClass: "bg-neutral-950 border border-neutral-700 text-white",
    barColor: "bg-neutral-200",
  },
  youtube: {
    abbr: "YT",
    label: "YouTube",
    badgeClass: "bg-red-600 text-white",
    barColor: "bg-red-500",
  },
  twitter: {
    abbr: "𝕏",
    label: "X / Twitter",
    badgeClass: "bg-neutral-800 border border-neutral-700 text-white",
    barColor: "bg-sky-400",
  },
  twitch: {
    abbr: "TV",
    label: "Twitch",
    badgeClass: "bg-purple-700 text-white",
    barColor: "bg-purple-400",
  },
  linkedin: {
    abbr: "in",
    label: "LinkedIn",
    badgeClass: "bg-blue-700 text-white",
    barColor: "bg-blue-400",
  },
};

const MOCK_PORTFOLIO = [
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1546961342-ea5f62d5a07b?w=400&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=400&fit=crop&auto=format",
];

/** Audience demographics — replaced by real API data when backend is live */
const MOCK_DEMOGRAPHICS = {
  topCountries: [
    { name: "United States", flag: "🇺🇸", pct: 45 },
    { name: "United Kingdom", flag: "🇬🇧", pct: 20 },
    { name: "Canada",         flag: "🇨🇦", pct: 12 },
    { name: "Australia",      flag: "🇦🇺", pct: 8  },
    { name: "Germany",        flag: "🇩🇪", pct: 6  },
  ],
  gender: { female: 62, male: 38 },
  ageGroups: [
    { range: "13–17", pct: 5  },
    { range: "18–24", pct: 42 },
    { range: "25–34", pct: 35 },
    { range: "35–44", pct: 12 },
    { range: "45+",   pct: 6  },
  ],
  /** Daily views (K) for the past 14 days */
  engagementTrend: [42, 38, 55, 48, 61, 52, 75, 68, 82, 71, 90, 85, 78, 95],
};

const MOCK_CAMPAIGNS = [
  "Summer Launch 2026",
  "Tech Review Series",
  "Holiday Gifting Campaign",
  "Brand Awareness Q3",
  "Creator Partnership Program",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatReach(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function getNicheTags(niche: string | null): string[] {
  if (!niche) return [];
  return niche.split(",").map((t) => t.trim()).filter(Boolean);
}

function parseFollowerStr(s: string): number {
  const t = s.trim().toUpperCase();
  if (t.endsWith("M")) return parseFloat(t) * 1_000_000;
  if (t.endsWith("K")) return parseFloat(t) * 1_000;
  return parseFloat(t) || 0;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

export const PlatformBadge = ({ platform }: { platform: string }) => {
  const meta = PLATFORM_META[platform] ?? {
    abbr: platform.slice(0, 2).toUpperCase(),
    badgeClass: "bg-neutral-700 text-white",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-bold shrink-0",
        meta.badgeClass
      )}
    >
      {meta.abbr}
    </span>
  );
};

const AnalyticsBar = ({
  label,
  valueText,
  valuePct,
  barColor,
  sublabel,
}: {
  label: string;
  valueText: string;
  valuePct: number;
  barColor: string;
  sublabel?: string;
}) => (
  <div className="space-y-2">
    <div className="flex items-baseline justify-between gap-2">
      <div className="flex items-baseline gap-2 min-w-0">
        <span className="text-sm font-semibold truncate text-zinc-900 dark:text-zinc-50">{label}</span>
        {sublabel && (
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 shrink-0">
            {sublabel}
          </span>
        )}
      </div>
      <span className="text-sm font-bold shrink-0 text-zinc-800 dark:text-zinc-200">{valueText}</span>
    </div>
    <div className="h-2.5 bg-zinc-200 dark:bg-neutral-800 rounded-full overflow-hidden">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out",
          barColor
        )}
        style={{ width: `${Math.min(Math.max(valuePct, 2), 100)}%` }}
      />
    </div>
  </div>
);

/** Mini sparkline-style bar chart */
const EngagementTrend = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const avg = Math.round(data.reduce((a, b) => a + b, 0) / data.length);
  return (
    <div>
      <div className="flex items-end gap-[3px] h-16">
        {data.map((v, i) => {
          const isToday = i === data.length - 1;
          return (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-t-sm transition-all duration-700 ease-out cursor-default group relative",
                isToday ? "bg-primary" : "bg-primary/40 hover:bg-primary/70"
              )}
              style={{ height: `${Math.max((v / max) * 100, 4)}%` }}
              title={`${v}K views`}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-muted-foreground">14 days ago</span>
        <span className="text-[10px] font-medium text-zinc-500 dark:text-neutral-400">
          Avg: {avg}K views/day
        </span>
        <span className="text-[10px] text-muted-foreground">Today</span>
      </div>
    </div>
  );
};

// ─── Main Drawer ──────────────────────────────────────────────────────────────

const ProfileDrawer = ({ creator, isOpen, onClose, onMessage }: ProfileDrawerProps) => {
  const { toast } = useToast();
  const { openChatWindow } = useMessaging();

  // Panel state
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState<DrawerTab>("overview");

  // Proposal modal
  const [showProposal, setShowProposal] = useState(false);
  const [campaign, setCampaign] = useState("");
  const [budget, setBudget] = useState("");
  const [brief, setBrief] = useState("");

  // Quick message panel
  const [showQuickMessage, setShowQuickMessage] = useState(false);
  const [messageText, setMessageText] = useState("");

  // ── Reset everything when drawer closes ───────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setIsFullScreen(false);
        setActiveTab("overview");
        setShowProposal(false);
        setShowQuickMessage(false);
        setCampaign("");
        setBudget("");
        setBrief("");
        setMessageText("");
      }, 320);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showProposal) { setShowProposal(false); return; }
        if (showQuickMessage) { setShowQuickMessage(false); return; }
        onClose();
      }
    },
    [onClose, showProposal, showQuickMessage]
  );
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ── Body scroll lock ──────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ── Action handlers ───────────────────────────────────────────────────────
  const handleSubmitProposal = () => {
    toast({
      title: "Proposal sent! 🎉",
      description: `Your collaboration request was delivered to ${creator?.full_name}.`,
    });
    setShowProposal(false);
    setCampaign("");
    setBudget("");
    setBrief("");
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    toast({
      title: "Message sent!",
      description: `Your message was delivered to ${creator?.full_name}.`,
    });
    setMessageText("");
    setShowQuickMessage(false);
  };

  if (!creator) return null;

  const tags = getNicheTags(creator.niche);
  const initials = creator.full_name
    ? creator.full_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  const platformEntries = Object.entries(creator.platforms ?? {});
  const maxPlatformFollowers = Math.max(
    1,
    ...platformEntries.map(([, v]) => parseFollowerStr(v))
  );

  // Shared width classes — kept in sync between panel + quick-message panel
  const drawerWidthCls = isFullScreen
    ? "w-full left-0 border-l-0"
    : "w-full md:w-[52vw] md:max-w-3xl";

  return (
    <>
      {/* ── Backdrop ───────────────────────────────────────────── */}
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/65 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen && !isFullScreen && !showProposal
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />

      {/* ── Panel ──────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${creator.full_name} profile`}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex flex-col",
          "bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800",
          "shadow-[-32px_0_80px_rgba(0,0,0,0.08)] dark:shadow-[-32px_0_80px_rgba(0,0,0,0.75)]",
          "transition-all duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
          drawerWidthCls
        )}
      >
        {/* ── Top bar ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-zinc-100 dark:bg-neutral-800 shrink-0">
              {creator.avatar_url ? (
                <img src={creator.avatar_url} alt={creator.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[13px] truncate leading-tight text-zinc-900 dark:text-zinc-50">
                  {creator.full_name}
                </span>
                {creator.verified && (
                  <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                )}
              </div>
              {creator.location && (
                <div className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  {creator.location}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-3">
            <button
              onClick={() => setIsFullScreen((v) => !v)}
              title={isFullScreen ? "Minimize" : "Expand to full screen"}
              className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-neutral-800 bg-zinc-50 dark:bg-neutral-900/60 hover:bg-zinc-100 dark:hover:bg-neutral-800 hover:border-zinc-300 dark:hover:border-neutral-600 flex items-center justify-center transition-colors text-zinc-700 dark:text-zinc-300"
            >
              {isFullScreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={onClose}
              title="Close"
              className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-neutral-800 bg-zinc-50 dark:bg-neutral-900/60 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/40 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center transition-colors text-zinc-700 dark:text-zinc-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Tab bar ──────────────────────────────────────────── */}
        <div className="flex items-end px-5 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          {(["overview", "analytics"] as DrawerTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative px-4 pt-3 pb-3 text-sm font-semibold capitalize transition-colors",
                activeTab === tab
                  ? "text-zinc-900 dark:text-zinc-50"
                  : "text-zinc-500 dark:text-muted-foreground hover:text-zinc-700 dark:hover:text-neutral-300"
              )}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] gradient-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* ── Scrollable content ───────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">

          {/* ── OVERVIEW TAB ─────────────────────────────────── */}
          {activeTab === "overview" && (
            <div className="p-6 space-y-7">
              {/* Hero */}
              <div className="flex items-start gap-5">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-zinc-100 dark:bg-neutral-800 overflow-hidden ring-2 ring-zinc-200/80 dark:ring-neutral-700/50">
                    {creator.avatar_url ? (
                      <img src={creator.avatar_url} alt={creator.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                        {initials}
                      </div>
                    )}
                  </div>
                  {creator.verified && (
                    <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-neutral-800 flex items-center justify-center">
                      <BadgeCheck className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <h2 className="font-display text-2xl font-bold leading-tight mb-1 text-zinc-900 dark:text-zinc-50">
                    {creator.full_name}
                  </h2>
                  {creator.location && (
                    <div className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 mb-2.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {creator.location}
                    </div>
                  )}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span key={tag} className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/50">
                <div className="py-4 flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-zinc-400 dark:text-muted-foreground" />
                    <span className="text-xl font-display font-bold text-zinc-800 dark:text-zinc-200">{formatReach(creator.total_followers)}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">Total Reach</span>
                </div>
                <div className="py-4 flex flex-col items-center gap-1 border-x border-zinc-200/60 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xl font-display font-bold text-emerald-600 dark:text-emerald-400">{creator.avg_engagement_rate}%</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">Eng Rate</span>
                </div>
                <div className="py-4 flex flex-col items-center gap-1">
                  <span className="text-xl font-display font-bold text-zinc-800 dark:text-zinc-200">{creator.languages?.[0] ?? "EN"}</span>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">Primary Lang</span>
                </div>
              </div>

              {/* Bio */}
              {creator.bio && (
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold mb-3">About</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{creator.bio}</p>
                </div>
              )}

              {/* Platform list */}
              {platformEntries.length > 0 && (
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold mb-3">Active Platforms</h3>
                  <div className="space-y-2">
                    {platformEntries.map(([platform, count]) => {
                      const meta = PLATFORM_META[platform];
                      return (
                        <div key={platform} className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                          <div className="flex items-center gap-3">
                            <PlatformBadge platform={platform} />
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{meta?.label ?? platform}</span>
                          </div>
                          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Media portfolio */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold">Content Portfolio</h3>
                  <button className="text-xs text-primary hover:text-primary/70 flex items-center gap-1 transition-colors">
                    View all <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {MOCK_PORTFOLIO.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-neutral-800 group cursor-pointer">
                      <img src={src} alt={`Post ${i + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-200" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ANALYTICS TAB ────────────────────────────────── */}
          {activeTab === "analytics" && (
            <div className="p-6 space-y-8">

              {/* 1. Performance Scores */}
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold mb-5">
                  Performance Scores
                </h3>
                <div className="space-y-5">
                  <AnalyticsBar
                    label="Engagement Rate"
                    valueText={`${creator.avg_engagement_rate}%`}
                    valuePct={(creator.avg_engagement_rate / 10) * 100}
                    barColor="bg-emerald-500"
                    sublabel={creator.avg_engagement_rate >= 5 ? "Above average ✦" : "Industry avg"}
                  />
                  <AnalyticsBar
                    label="Audience Authenticity"
                    valueText="94%"
                    valuePct={94}
                    barColor="bg-gradient-to-r from-violet-500 to-indigo-500"
                    sublabel="High quality"
                  />
                  <AnalyticsBar
                    label="Brand Alignment Score"
                    valueText={`${Math.min(99, Math.round(creator.avg_engagement_rate * 12))}%`}
                    valuePct={Math.min(99, creator.avg_engagement_rate * 12)}
                    barColor="bg-gradient-to-r from-amber-400 to-orange-400"
                  />
                </div>
              </div>

              {/* 2. Engagement Trend */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold">
                    30-Day Engagement Trend
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-semibold">
                    +18% vs last month
                  </span>
                </div>
                <EngagementTrend data={MOCK_DEMOGRAPHICS.engagementTrend} />
              </div>

              {/* 3. Audience Demographics */}
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold mb-5">
                  Audience Demographics
                </h3>

                {/* Top Countries */}
                <div className="space-y-3 mb-6">
                  <p className="text-xs font-medium text-zinc-500 dark:text-neutral-400">Top Countries</p>
                  {MOCK_DEMOGRAPHICS.topCountries.map((c) => (
                    <div key={c.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-medium text-zinc-900 dark:text-zinc-50">
                          <span>{c.flag}</span>
                          {c.name}
                        </span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{c.pct}%</span>
                      </div>
                      <div className="h-2 bg-zinc-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-600 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${c.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gender Split */}
                <div className="space-y-3 mb-6">
                  <p className="text-xs font-medium text-zinc-500 dark:text-neutral-400">Gender Split</p>
                  <div className="h-3.5 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-rose-400 transition-all duration-700 ease-out"
                      style={{ width: `${MOCK_DEMOGRAPHICS.gender.female}%` }}
                    />
                    <div className="h-full bg-sky-400 flex-1" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                      <span className="text-zinc-500 dark:text-muted-foreground">Female</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{MOCK_DEMOGRAPHICS.gender.female}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{MOCK_DEMOGRAPHICS.gender.male}%</span>
                      <span className="text-zinc-500 dark:text-muted-foreground">Male</span>
                      <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Age Groups */}
                <div className="space-y-2.5">
                  <p className="text-xs font-medium text-zinc-500 dark:text-neutral-400 mb-3">Age Groups</p>
                  {MOCK_DEMOGRAPHICS.ageGroups.map((ag) => (
                    <div key={ag.range} className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500 dark:text-muted-foreground w-11 shrink-0 font-medium">
                        {ag.range}
                      </span>
                      <div className="flex-1 h-2 bg-zinc-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/70 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${ag.pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold w-7 text-right shrink-0 text-zinc-800 dark:text-zinc-200">
                        {ag.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Platform Reach Breakdown */}
              {platformEntries.length > 0 && (
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold mb-5">
                    Platform Reach Breakdown
                  </h3>
                  <div className="space-y-5">
                    {platformEntries.map(([platform, countStr]) => {
                      const meta = PLATFORM_META[platform];
                      const count = parseFollowerStr(countStr);
                      return (
                        <div key={platform} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <PlatformBadge platform={platform} />
                              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{meta?.label ?? platform}</span>
                            </div>
                            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{countStr}</span>
                          </div>
                          <div className="h-2.5 bg-zinc-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full rounded-full transition-all duration-700 ease-out", meta?.barColor ?? "bg-neutral-500")}
                              style={{ width: `${(count / maxPlatformFollowers) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. Availability callout */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/[0.07] border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold mb-0.5 text-zinc-900 dark:text-zinc-50">Open for partnerships</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Avg. response time: 4 hours. Active campaign slots available for sponsored content.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer CTA ───────────────────────────────────────── */}
        <div className="px-5 py-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0 flex gap-3">
          <Button
            className="flex-1 h-10 btn-gradient rounded-xl font-semibold gap-2"
            onClick={() => setShowProposal(true)}
          >
            <Send className="w-3.5 h-3.5" />
            Send Proposal
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-10 rounded-xl border-zinc-200 dark:border-neutral-700 hover:border-zinc-300 dark:hover:border-neutral-500 font-semibold gap-2 transition-colors text-zinc-900 dark:text-zinc-50"
            onClick={() => {
              if (!creator) return;
              // Always prefer the floating chat window; close the drawer first.
              onClose();
              if (onMessage) {
                onMessage(creator);
              } else {
                openChatWindow({
                  id: creator.id,
                  full_name: creator.full_name,
                  avatar_url: creator.avatar_url,
                  user_type: "creator",
                });
              }
            }}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Message
          </Button>
        </div>
      </div>

      {/* ── Quick Message Panel (slides up, matches drawer width) ──────── */}
      <div
        className={cn(
          "fixed bottom-0 right-0 z-[55]",
          "bg-[#09090e] border-t border-l border-neutral-800/60",
          "shadow-[0_-16px_48px_rgba(0,0,0,0.65)]",
          "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          drawerWidthCls,
          isOpen && showQuickMessage ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="p-4 pb-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg overflow-hidden bg-neutral-800 shrink-0">
                {creator.avatar_url ? (
                  <img src={creator.avatar_url} alt={creator.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full gradient-primary flex items-center justify-center text-white text-[10px] font-bold">
                    {initials}
                  </div>
                )}
              </div>
              <div className="leading-tight">
                <span className="text-sm font-semibold">Quick Message</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowRight className="w-2.5 h-2.5" />
                  {creator.full_name}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowQuickMessage(false)}
              className="w-7 h-7 rounded-lg border border-neutral-800 hover:bg-neutral-800 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Input row */}
          <div className="flex gap-2 items-end">
            <Textarea
              placeholder={`Write a message to ${creator.full_name}…`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSendMessage();
              }}
              className="flex-1 resize-none h-[72px] border-neutral-800 bg-neutral-950/60 text-sm placeholder:text-neutral-600 focus:border-primary/50"
            />
            <Button
              className="h-10 px-4 btn-gradient rounded-xl font-semibold gap-1.5 shrink-0 self-end"
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            ⌘ Enter to send instantly
          </p>
        </div>
      </div>

      {/* ── Proposal Modal ────────────────────────────────────────── */}
      {showProposal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Modal backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowProposal(false)}
          />

          {/* Modal card */}
          <div className="relative z-10 w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.85)] overflow-hidden">

            {/* Top accent bar */}
            <div className="h-0.5 w-full gradient-primary" />

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-neutral-800">
              <div>
                <h2 className="font-display text-[17px] font-bold leading-tight">
                  Send Collaboration Proposal
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  to{" "}
                  <span className="text-foreground font-semibold">
                    {creator.full_name}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setShowProposal(false)}
                className="w-8 h-8 rounded-lg border border-neutral-700 hover:bg-neutral-800 hover:border-neutral-600 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Form body */}
            <div className="px-6 py-5 space-y-5">

              {/* Campaign */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Select Active Campaign
                </label>
                <Select value={campaign} onValueChange={setCampaign}>
                  <SelectTrigger className="border-neutral-800 bg-neutral-950/50 h-10 text-sm focus:ring-primary/40">
                    <SelectValue placeholder="Choose a campaign…" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800">
                    {MOCK_CAMPAIGNS.map((c) => (
                      <SelectItem key={c} value={c} className="focus:bg-neutral-800">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Offer Budget (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="number"
                    min={0}
                    step={100}
                    placeholder="e.g. 1500"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="pl-9 h-10 border-neutral-800 bg-neutral-950/50 text-sm focus:border-primary/50"
                  />
                </div>
              </div>

              {/* Brief */}
              <div className="space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Message / Brief Guidelines
                </label>
                <Textarea
                  placeholder="Describe campaign goals, deliverables, timeline, and any creative direction…"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  className="resize-none h-28 border-neutral-800 bg-neutral-950/50 text-sm placeholder:text-neutral-600 focus:border-primary/50"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 pb-5 pt-1">
              <Button
                className="flex-1 h-10 btn-gradient rounded-xl font-semibold gap-2"
                onClick={handleSubmitProposal}
                disabled={!campaign && !budget && !brief}
              >
                <Check className="w-4 h-4" />
                Submit Proposal
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-10 rounded-xl border-neutral-700 hover:border-neutral-500 font-semibold"
                onClick={() => setShowProposal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileDrawer;
