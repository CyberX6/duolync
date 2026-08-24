"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users, Eye, TrendingUp, ArrowRight, LayoutDashboard,
  Wifi, Zap,
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { SmartCalendarWidget } from "@/components/calendar/SmartCalendarWidget";
import { OnboardingChecklist } from "@/app/_components/dashboard/OnboardingChecklist";
import { KpiCardsSkeleton, SocialConnectionsSkeleton } from "@/app/_components/dashboard/DashboardSkeletons";
import { AIGrowthMentor } from "@/app/_components/dashboard/AIGrowthMentor";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const VIOLET = "var(--accent-violet-text)";
const VIOLET_T = "var(--accent-violet-text)";
const CYAN = "var(--accent-cyan-text)";
const CYAN_T = "var(--accent-cyan-text)";

const PLATFORM_META: Record<string, { emoji: string; color: string }> = {
  instagram: { emoji: "📷", color: "var(--brand-instagram-text)" },
  tiktok:    { emoji: "📱", color: "#ffffff" },
  youtube:   { emoji: "▶️", color: "var(--brand-youtube-text)" },
  twitter:   { emoji: "🐦", color: "#1da1f2" },
  twitch:    { emoji: "🎮", color: "#9146ff" },
  linkedin:  { emoji: "💼", color: "#0a66c2" },
};

const fmt = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
};

const CreatorDashboard = () => {
  const { profile, fullProfile, loading: profileLoading } = useAuth();
  const [stats] = useState({ totalViews: 0, savedBy: 0 });

  const firstName = profile?.full_name?.split(" ")[0] || "Creator";

  const connectedPlatforms = fullProfile?.connectedPlatforms ?? [];
  const followerCount = fullProfile?.followerCount ?? profile?.total_followers ?? 0;
  const engagementRate = fullProfile?.averageEngagement ?? profile?.avg_engagement_rate ?? 0;
  const hasConnections = connectedPlatforms.length > 0 || followerCount > 0;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Command Center header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{
              background: "color-mix(in srgb, var(--accent-violet-text) 12%, transparent)",
              border: "1px solid color-mix(in srgb, var(--accent-violet-text) 35%, transparent)",
              color: VIOLET_T,
            }}
          >
            <LayoutDashboard size={11} />
            Command Center
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {firstName}!{" "}
            <span
              style={{
                background: `linear-gradient(90deg, ${VIOLET}, ${CYAN})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              One command center.
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Plan, schedule, and track your brand campaigns across every platform — all in one place.
          </p>
        </div>

        {/* Onboarding checklist — hidden once all steps are done or dismissed */}
        {profile?.id && (
          <OnboardingChecklist
            userId={profile.id}
            hasConnectedPlatform={hasConnections}
          />
        )}

        {/* KPI cards */}
        {profileLoading ? (
          <KpiCardsSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="stat-card">
              <Users className="w-6 h-6 text-primary mb-2" />
              <div className="text-2xl font-display font-bold">{fmt(followerCount)}</div>
              <div className="text-sm text-muted-foreground">Total Followers</div>
            </div>
            <div className="stat-card">
              <Eye className="w-6 h-6 text-accent mb-2" />
              <div className="text-2xl font-display font-bold">{fmt(stats.totalViews)}</div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>
            <div className="stat-card">
              <TrendingUp className="w-6 h-6 text-teal mb-2" />
              <div className="text-2xl font-display font-bold">{engagementRate}%</div>
              <div className="text-sm text-muted-foreground">Engagement Rate</div>
            </div>
            <div className="stat-card">
              <Wifi className="w-6 h-6 text-violet-400 mb-2" />
              <div className="text-2xl font-display font-bold">{connectedPlatforms.length}</div>
              <div className="text-sm text-muted-foreground">Connected Platforms</div>
            </div>
          </div>
        )}

        {/* Smart Calendar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Smart Content Calendar</h2>
            <Link
              href="/creator/campaigns"
              className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
            >
              View campaigns <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <SmartCalendarWidget />
        </div>

        {/* Social Connections section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-violet-400" />
              <h2 className="font-display text-xl font-bold">Social Connections</h2>
            </div>
            <Link
              href="/creator/presence"
              className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
            >
              Manage <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {hasConnections ? (
            <div data-fixed-dark className="rounded-2xl bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 p-6">
              <div className="flex items-start justify-between gap-6 flex-wrap">
                {/* Aggregated stats */}
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-3xl font-display font-bold text-zinc-900 dark:text-white">{fmt(followerCount)}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Total Followers</p>
                  </div>
                  {engagementRate > 0 && (
                    <div>
                      <p className="text-3xl font-display font-bold text-emerald-600 dark:text-emerald-400">{engagementRate}%</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Avg. Engagement</p>
                    </div>
                  )}
                </div>

                {/* Per-platform rows */}
                <div className="flex flex-col gap-2 min-w-[180px]">
                  {connectedPlatforms.map((p) => {
                    const meta = PLATFORM_META[p] ?? { emoji: "📱", color: "#888" };
                    const stat = fullProfile?.platformStats?.find((s) => s.platform === p);
                    return (
                      <div
                        key={p}
                        className="flex items-center justify-between gap-4 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{meta.emoji}</span>
                          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200 capitalize">{p}</span>
                        </div>
                        <span className="text-xs font-semibold text-zinc-900 dark:text-white tabular-nums">
                          {stat?.followerCount != null ? fmt(stat.followerCount) : "—"} followers
                        </span>
                      </div>
                    );
                  })}
                  <Link href="/creator/presence">
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs font-medium text-violet-600 dark:text-violet-300 hover:bg-violet-500/20 transition-colors cursor-pointer">
                      + Add Platform
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Not connected CTA */
            <div data-fixed-dark className="rounded-2xl border border-dashed border-zinc-700 p-8 flex flex-col sm:flex-row items-center gap-6 bg-zinc-900/50">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <Wifi className="w-7 h-7 text-violet-400" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-display font-bold text-lg mb-1">Connect your social accounts</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Link Instagram, TikTok, YouTube and more to showcase your reach to brands and unlock analytics.
                </p>
              </div>
              <Link href="/creator/presence">
                <Button className="gap-2 bg-violet-600 hover:bg-violet-500 text-white border-0 shrink-0">
                  <Zap className="w-4 h-4" /> Connect Now
                </Button>
              </Link>
            </div>
          )}
        </div>
        {/* AI Growth Mentor */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="font-display text-xl font-bold">AI Growth Mentor</h2>
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide"
              style={{ background: "rgba(192,132,252,0.12)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.25)" }}
            >
              AI
            </span>
          </div>
          <AIGrowthMentor
            followerCount={followerCount}
            engagementRate={engagementRate}
            niche={fullProfile?.niche ?? profile?.niche ?? null}
            platforms={connectedPlatforms}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default CreatorDashboard;
