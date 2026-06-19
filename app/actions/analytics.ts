"use server";

import { db } from "@/lib/db";

export interface EngagementDataPoint {
  month: string;
  rate: number;
}

export interface CreatorAnalytics {
  engagementTrend: EngagementDataPoint[];
  avgReach: number;
  bestPlatform: { name: string; label: string } | null;
  peakHour: number | null;
  avgEngagementRate: number;
  totalFollowers: number;
}

export async function getCreatorAnalyticsAction(creatorUserId: string): Promise<{
  data: CreatorAnalytics | null;
  error: string | null;
}> {
  try {
    const profile = await db.creatorProfile.findUnique({
      where: { userId: creatorUserId },
      include: {
        socialPosts: {
          orderBy: { postedAt: "desc" },
          take: 100,
        },
      },
    });

    if (!profile) {
      return { data: null, error: "Creator not found" };
    }

    const posts = profile.socialPosts.filter((p) => p.postedAt !== null);
    const totalFollowers = Math.max(profile.totalFollowers || profile.followerCount || 1, 1);

    const postsWithEng = posts.map((p) => ({
      ...p,
      computedEngRate:
        p.engagementRate ??
        (((p.likes ?? 0) + (p.comments ?? 0)) / totalFollowers) * 100,
    }));

    // Average engagement over last 10 posts
    const last10 = postsWithEng.slice(0, 10);
    const avgEngagementRate =
      last10.length > 0
        ? last10.reduce((s, p) => s + p.computedEngRate, 0) / last10.length
        : profile.avgEngagementRate || profile.averageEngagement || 0;

    // Growth trend: last 3 calendar months
    const now = new Date();
    const engagementTrend: EngagementDataPoint[] = [];
    for (let i = 2; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const label = start.toLocaleString("default", { month: "short" });
      const monthPosts = postsWithEng.filter((p) => {
        const d = new Date(p.postedAt!);
        return d >= start && d <= end;
      });
      const rate =
        monthPosts.length > 0
          ? monthPosts.reduce((s, p) => s + p.computedEngRate, 0) / monthPosts.length
          : 0;
      engagementTrend.push({ month: label, rate: parseFloat(rate.toFixed(2)) });
    }

    // Average reach from post views
    const postsWithViews = posts.filter((p) => p.views != null);
    const avgReach =
      postsWithViews.length > 0
        ? Math.round(
            postsWithViews.reduce((s, p) => s + (p.views ?? 0), 0) /
              postsWithViews.length
          )
        : profile.followerCount ?? profile.totalFollowers ?? 0;

    // Best platform by engagement rate
    const platformGroups: Record<string, number[]> = {};
    postsWithEng.forEach((p) => {
      if (!platformGroups[p.platform]) platformGroups[p.platform] = [];
      platformGroups[p.platform].push(p.computedEngRate);
    });

    const PLATFORM_LABELS: Record<string, string> = {
      tiktok: "TikTok",
      instagram: "Instagram",
      youtube: "YouTube",
      twitter: "X / Twitter",
      twitch: "Twitch",
      linkedin: "LinkedIn",
    };

    let bestPlatform: { name: string; label: string } | null = null;
    let bestAvg = -1;
    for (const [platform, rates] of Object.entries(platformGroups)) {
      const avg = rates.reduce((s, r) => s + r, 0) / rates.length;
      if (avg > bestAvg) {
        bestAvg = avg;
        const platformName = PLATFORM_LABELS[platform] ?? platform;
        const engLabel =
          avg >= 6 ? "High Engagement" : avg >= 3 ? "Good Engagement" : "Moderate";
        bestPlatform = { name: platform, label: `${platformName} — ${engLabel}` };
      }
    }

    // Audience activity peak hour
    const hourCounts: Record<number, number> = {};
    posts.forEach((p) => {
      if (!p.postedAt) return;
      const h = new Date(p.postedAt).getHours();
      hourCounts[h] = (hourCounts[h] ?? 0) + 1;
    });

    let peakHour: number | null = null;
    let peakCount = 0;
    for (const [h, count] of Object.entries(hourCounts)) {
      if (count > peakCount) {
        peakCount = count;
        peakHour = parseInt(h);
      }
    }

    return {
      data: {
        engagementTrend,
        avgReach,
        bestPlatform,
        peakHour,
        avgEngagementRate: parseFloat(avgEngagementRate.toFixed(2)),
        totalFollowers,
      },
      error: null,
    };
  } catch (err) {
    console.error("getCreatorAnalyticsAction error:", err);
    return { data: null, error: "Failed to load analytics" };
  }
}
