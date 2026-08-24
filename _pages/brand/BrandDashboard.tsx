"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Heart,
  Megaphone,
  MessageSquare,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { SmartCalendarWidget } from "@/components/calendar/SmartCalendarWidget";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/components/favorites/FavoritesContext";
import {
  getBrandDashboardStatsAction,
  type BrandDashboardStats,
} from "@/app/actions/campaigns";
import {
  getActiveCollaborationsAction,
  type ActiveCollaboration,
} from "@/app/actions/proposals";
import { cn } from "@/lib/utils";
import { useMessaging, type ConversationRecipient } from "@/app/_components/messaging/MessagingContext";
import { KpiCardsSkeleton } from "@/app/_components/dashboard/DashboardSkeletons";
import { BrandOnboardingChecklist } from "@/app/_components/dashboard/BrandOnboardingChecklist";
import { AIStrategyConsultant } from "@/app/_components/dashboard/AIStrategyConsultant";

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  href: string;
  icon: React.ElementType;
  iconColor: string;
  value: number | string;
  label: string;
  accent?: string;
}

function StatCard({ href, icon: Icon, iconColor, value, label, accent }: StatCardProps) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-white/[0.06] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm p-5 flex flex-col gap-3 transition-all hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/5"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: accent
            ? `radial-gradient(ellipse at top left, ${accent}08 0%, transparent 60%)`
            : "radial-gradient(ellipse at top left, rgba(192,132,252,0.06) 0%, transparent 60%)",
        }}
      />
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}30` }}
        >
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
        <ArrowRight className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div>
        <div
          className="text-2xl font-bold font-display tabular-nums"
          style={{ color: iconColor }}
        >
          {value}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </div>
    </Link>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

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

const BrandDashboard = () => {
  const { profile } = useAuth();
  const { getAllSavedItems } = useFavorites();
  const { openChatWindow } = useMessaging();
  const savedCreatorsCount = getAllSavedItems().length;
  const [stats, setStats] = useState<BrandDashboardStats>({
    activeCampaigns: 0,
    savedCreators: 0,
    activeConversations: 0,
    availableCreators: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [collabs, setCollabs] = useState<ActiveCollaboration[]>([]);
  const [collabsLoading, setCollabsLoading] = useState(true);

  useEffect(() => {
    getBrandDashboardStatsAction().then(({ data }) => {
      setStats(data);
      setStatsLoading(false);
    });
    getActiveCollaborationsAction().then(({ data }) => {
      setCollabs(data);
      setCollabsLoading(false);
    });
  }, []);

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 overflow-x-hidden">

        {/* ── Welcome header ────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-muted-foreground text-base">
            Your campaign command center — track creators, content, and conversations.
          </p>
        </div>

        {/* ── Brand onboarding checklist ────────────────────────────────── */}
        {profile?.id && (
          <BrandOnboardingChecklist
            userId={profile.id}
            hasCompletedProfile={!!(profile.full_name && profile.avatar_url)}
            hasCampaigns={stats.activeCampaigns > 0}
            hasSavedCreators={stats.savedCreators > 0}
            hasSentProposals={false}
          />
        )}

        {/* ── Quick actions ─────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          <Link
            href="/brand/discover"
            className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-white/[0.06] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm p-5 flex items-center gap-4 transition-all hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/5"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-0.5">Browse Creators</h3>
              <p className="text-xs text-muted-foreground">Explore 50,000+ verified influencers</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            href="/brand/smart-match"
            className="group relative overflow-hidden rounded-2xl border border-violet-500/30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm p-5 flex items-center gap-4 transition-all hover:border-violet-500/60 hover:shadow-lg hover:shadow-violet-500/10"
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "radial-gradient(ellipse at left, rgba(192,132,252,0.08) 0%, transparent 60%)" }}
            />
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-sm">AI Smart Match</h3>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/25">
                  NEW
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Find creators with natural language search</p>
            </div>
            <ArrowRight className="w-4 h-4 text-violet-500 dark:text-violet-400 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        {/* ── Metric cards ──────────────────────────────────────────────── */}
        {statsLoading ? (
          <KpiCardsSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatCard
              href="/brand/campaigns"
              icon={Megaphone}
              iconColor="#c084fc"
              value={stats.activeCampaigns}
              label="Active Campaigns"
              accent="#c084fc"
            />
            <StatCard
              href="/brand/saved"
              icon={Heart}
              iconColor="#f472b6"
              value={savedCreatorsCount}
              label="Saved Creators"
              accent="#f472b6"
            />
            <StatCard
              href="/messages"
              icon={MessageSquare}
              iconColor="#34d399"
              value={stats.activeConversations}
              label="Conversations"
              accent="#34d399"
            />
            <StatCard
              href="/brand/discover"
              icon={TrendingUp}
              iconColor="#60a5fa"
              value={stats.availableCreators.toLocaleString()}
              label="Available Creators"
              accent="#60a5fa"
            />
          </div>
        )}

        {/* ── Smart Content Calendar ─────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-500 dark:text-violet-400" />
              <h2 className="font-display text-base font-semibold">Campaign Timeline</h2>
            </div>
            <Link
              href="/brand/campaigns"
              className="text-xs text-violet-600 dark:text-violet-400 font-medium hover:underline flex items-center gap-1"
            >
              View campaigns
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <SmartCalendarWidget isBrand canEdit />
        </div>

        {/* ── Connected creators ────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-500 dark:text-violet-400" />
              <h2 className="font-display text-base font-semibold">Quick Actions</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {
                href: "/brand/campaigns",
                icon: Megaphone,
                label: "Manage Campaigns",
                desc: "Create and track your campaigns",
                color: "#c084fc",
              },
              {
                href: "/brand/proposals",
                icon: Users,
                label: "Review Proposals",
                desc: "Approve or reject creator applications",
                color: "#f472b6",
              },
              {
              href: "/messages",
              icon: MessageSquare,
              label: "Messages",
              desc: "Chat with your creator partners",
              color: "#34d399",
              },
            ].map(({ href, icon: Icon, label, desc, color }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 rounded-2xl border border-zinc-200/60 dark:border-white/[0.06] bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm p-4 transition-all hover:border-violet-500/30 hover:shadow-md"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{label}</div>
                  <div className="text-xs text-muted-foreground truncate">{desc}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* ── Active Collaborations ─────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="font-display text-base font-semibold">Active Collaborations</h2>
              {collabs.length > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  {collabs.length}
                </span>
              )}
            </div>
            <Link
              href="/brand/proposals?tab=ACCEPTED"
              className="text-xs text-violet-600 dark:text-violet-400 font-medium hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {collabsLoading ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-2xl border border-zinc-200/60 dark:border-white/[0.06] bg-white/80 dark:bg-zinc-950/80 p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
                      <div className="h-3 bg-zinc-100 dark:bg-zinc-800/50 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : collabs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-6 text-center">
              <CheckCircle2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No active collaborations yet.</p>
              <Link href="/brand/proposals" className="mt-2 inline-block text-xs text-violet-600 dark:text-violet-400 hover:underline">
                Review pending proposals →
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {collabs.slice(0, 4).map((c) => {
                const initials = (c.creator.name ?? "?")
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                const platform = c.selectedPlatform ?? c.creator.primaryPlatform;
                return (
                  <div
                    key={c.proposalId}
                    className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm p-4 transition-all hover:border-emerald-500/40 hover:shadow-md hover:shadow-emerald-500/5"
                  >
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Active
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-700 shrink-0">
                        {c.creator.avatarUrl ? (
                          <img src={c.creator.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {initials}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 pr-10">
                        <Link
                          href={`/profile/${c.creator.userId}`}
                          className="font-semibold text-sm leading-tight text-zinc-900 dark:text-zinc-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors truncate block"
                        >
                          {c.creator.name ?? "Creator"}
                        </Link>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {c.campaignTitle}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {platform && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                              {PLATFORM_EMOJI[platform.toLowerCase()] ?? "🌐"} {platform}
                            </span>
                          )}
                          <span className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <DollarSign className="w-3 h-3" />
                            {c.rate.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        onClick={() => openChatWindow({
                          id: c.creator.userId,
                          full_name: c.creator.name,
                          avatar_url: c.creator.avatarUrl,
                          user_type: "creator",
                        } as ConversationRecipient)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors py-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Message
                      </button>
                      <Link
                        href={`/brand/campaigns/${c.campaignId}`}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors py-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      >
                        <Megaphone className="w-3.5 h-3.5" />
                        Campaign
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── AI Strategy Consultant ────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-display text-base font-semibold">AI Strategy Consultant</h2>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              AI
            </span>
          </div>
          <AIStrategyConsultant industry={profile?.industry ?? null} />
        </div>

        {/* ── CTA Banner ────────────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-3xl p-5 sm:p-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(109,40,217,0.1) 50%, rgba(76,29,149,0.15) 100%)",
            border: "1px solid rgba(139,92,246,0.25)",
          }}
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse at top right, rgba(192,132,252,0.2) 0%, transparent 60%)",
            }}
          />
          <div className="relative max-w-xl">
            <h3 className="font-display text-lg sm:text-xl font-bold mb-2">
              Ready to find your perfect match?
            </h3>
            <p className="text-muted-foreground text-sm mb-5">
              Our AI will analyze your brand and surface the best-fit creators for your next campaign.
            </p>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                asChild
                className="bg-violet-600 hover:bg-violet-500 text-white font-semibold border-0"
              >
                <Link href="/brand/smart-match">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Try AI Smart Match
                </Link>
              </Button>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default BrandDashboard;
