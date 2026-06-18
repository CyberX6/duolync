/** Aggregate platform stats into summary metrics. */
export function aggregateStats(
  platformStats: { followerCount: number | null; engagementRate: number | null }[]
): { totalReach: number; avgEngagementRate: number } {
  const totalReach = platformStats.reduce((sum, s) => sum + (s.followerCount ?? 0), 0);
  const withEng = platformStats.filter((s) => s.engagementRate != null);
  const avgEngagementRate =
    withEng.length > 0
      ? parseFloat(
          (withEng.reduce((sum, s) => sum + (s.engagementRate ?? 0), 0) / withEng.length).toFixed(2)
        )
      : 0;
  return { totalReach, avgEngagementRate };
}

export function formatReach(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}
