import { useState } from "react";
import Link from "next/link";
import { BarChart3, Users, Eye, TrendingUp, Link2, Plus, Settings, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  profile_url: string | null;
  followers: number;
  total_views: number;
  engagement_rate: number;
  is_primary: boolean;
}

const CreatorDashboard = () => {
  const { profile } = useAuth();
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [stats, setStats] = useState({
    totalViews: 0,
    profileViews: 0,
    savedBy: 0,
    conversations: 0,
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const platformEmoji: Record<string, string> = {
    youtube: "▶️",
    tiktok: "📱",
    instagram: "📷",
    twitter: "🐦",
    twitch: "🎮",
    linkedin: "💼",
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {profile?.full_name?.split(" ")[0] || "Creator"}! 🎨
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your profile and track your growth.
          </p>
        </div>

        {/* Stats */}
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

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
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

        {/* Connected Accounts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Connected Accounts</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/creator/accounts" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Account
              </Link>
            </Button>
          </div>

          {socialAccounts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialAccounts.map((account) => (
                <div key={account.id} className="card-elevated p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                      {platformEmoji[account.platform] || "📱"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold capitalize flex items-center gap-2">
                        {account.platform}
                        {account.is_primary && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        @{account.username}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <div className="font-semibold">{formatNumber(account.followers)}</div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                    <div>
                      <div className="font-semibold">{formatNumber(Number(account.total_views))}</div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                    <div>
                      <div className="font-semibold text-green-600">{account.engagement_rate}%</div>
                      <div className="text-xs text-muted-foreground">ER</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-elevated p-8 text-center">
              <Link2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-bold mb-2">No accounts connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect your social media accounts to showcase your stats
              </p>
              <Button asChild>
                <Link href="/creator/accounts">
                  <Plus className="w-4 h-4 mr-2" />
                  Connect Account
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Profile Completion */}
        {(!profile?.bio || !profile?.niche) && (
          <div className="card-elevated p-6 bg-accent/5 border-accent/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Settings className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-lg mb-1">Complete Your Profile</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  A complete profile helps brands find and connect with you.
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/creator/settings">Update Profile</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CreatorDashboard;
