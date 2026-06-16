"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart3, Users, Eye, TrendingUp, Link2, ArrowRight, LayoutDashboard } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { SmartCalendarWidget } from "@/components/calendar/SmartCalendarWidget";
import { useAuth } from "@/hooks/useAuth";

const VIOLET = "#c084fc";
const CYAN = "#67e8f9";

const CreatorDashboard = () => {
  const { profile } = useAuth();
  const [stats] = useState({
    totalViews: 0,
    savedBy: 0,
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const firstName = profile?.full_name?.split(" ")[0] || "Creator";

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Command Center header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{
              background: "rgba(192,132,252,0.12)",
              border: "1px solid rgba(192,132,252,0.35)",
              color: VIOLET,
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

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <Users className="w-6 h-6 text-primary mb-2" />
            <div className="text-2xl font-display font-bold">
              {formatNumber(profile?.total_followers || 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Followers</div>
          </div>
          <div className="stat-card">
            <Eye className="w-6 h-6 text-accent mb-2" />
            <div className="text-2xl font-display font-bold">
              {formatNumber(stats.totalViews)}
            </div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </div>
          <div className="stat-card">
            <TrendingUp className="w-6 h-6 text-teal mb-2" />
            <div className="text-2xl font-display font-bold">
              {profile?.avg_engagement_rate || 0}%
            </div>
            <div className="text-sm text-muted-foreground">Engagement Rate</div>
          </div>
          <div className="stat-card">
            <Users className="w-6 h-6 text-violet mb-2" />
            <div className="text-2xl font-display font-bold">{stats.savedBy}</div>
            <div className="text-sm text-muted-foreground">Saved by Brands</div>
          </div>
        </div>

        {/* Smart Calendar — main section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Smart Content Calendar</h2>
            <Link
              href="/creator/campaigns"
              className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
            >
              View campaigns
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <SmartCalendarWidget />
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/creator/accounts" className="card-interactive p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
              <Link2 className="w-7 h-7 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg mb-1">Manage Accounts</h3>
              <p className="text-sm text-muted-foreground">
                Connect and manage your social media accounts
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </Link>

          <Link href="/creator/analytics" className="card-interactive p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg mb-1">View Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Track your growth and performance
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreatorDashboard;
