import { useState } from "react";
import Link from "next/link";
import { Search, Sparkles, TrendingUp, Users, MessageSquare, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";

interface CreatorPreview {
  id: string;
  full_name: string;
  avatar_url: string | null;
  niche: string | null;
  total_followers: number;
  avg_engagement_rate: number;
  primary_platform: string | null;
}

const BrandDashboard = () => {
  const { profile } = useAuth();
  const [featuredCreators, setFeaturedCreators] = useState<CreatorPreview[]>([]);
  const [stats, setStats] = useState({
    savedCreators: 0,
    activeConversations: 0,
  });

  const formatFollowers = (num: number) => {
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
            Welcome back, {profile?.full_name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Find your perfect creator match and grow your brand.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link href="/brand/discover" className="card-interactive p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Search className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg mb-1">Browse Creators</h3>
              <p className="text-sm text-muted-foreground">
                Explore 50,000+ verified influencers
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </Link>

          <Link href="/brand/smart-match" className="card-interactive p-6 flex items-center gap-4 border-primary/30">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg mb-1">Smart Match</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered creator recommendations
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <TrendingUp className="w-6 h-6 text-primary mb-2" />
            <div className="text-2xl font-display font-bold">50K+</div>
            <div className="text-sm text-muted-foreground">Available Creators</div>
          </div>
          <div className="stat-card">
            <Users className="w-6 h-6 text-accent mb-2" />
            <div className="text-2xl font-display font-bold">{stats.savedCreators}</div>
            <div className="text-sm text-muted-foreground">Saved Creators</div>
          </div>
          <div className="stat-card">
            <MessageSquare className="w-6 h-6 text-teal mb-2" />
            <div className="text-2xl font-display font-bold">{stats.activeConversations}</div>
            <div className="text-sm text-muted-foreground">Conversations</div>
          </div>
          <div className="stat-card">
            <Heart className="w-6 h-6 text-destructive mb-2" />
            <div className="text-2xl font-display font-bold">98%</div>
            <div className="text-sm text-muted-foreground">Match Rate</div>
          </div>
        </div>

        {/* Featured Creators */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Featured Creators</h2>
            <Link href="/brand/discover" className="text-primary font-medium text-sm hover:underline">
              View all
            </Link>
          </div>

          {featuredCreators.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredCreators.map((creator) => (
                <Link
                  key={creator.id}
                  href={`/profile/${creator.id}`}
                  className="card-interactive p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl">
                      {creator.avatar_url ? (
                        <img
                          src={creator.avatar_url}
                          alt={creator.full_name || ""}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        "👤"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{creator.full_name || "Creator"}</div>
                      <div className="text-sm text-muted-foreground truncate">{creator.niche || "Content Creator"}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <span>{creator.primary_platform ? platformEmoji[creator.primary_platform] : "📱"}</span>
                      <span className="text-muted-foreground">
                        {formatFollowers(creator.total_followers)}
                      </span>
                    </div>
                    <div className="text-green-600 font-medium">
                      {creator.avg_engagement_rate}% ER
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card-elevated p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No creators available yet</p>
              <p className="text-sm text-muted-foreground">Check back soon!</p>
            </div>
          )}
        </div>

        {/* CTA Banner */}
        <div className="card-elevated p-8 gradient-primary text-white rounded-3xl">
          <div className="max-w-2xl">
            <h3 className="font-display text-2xl font-bold mb-2">
              Ready to find your perfect match?
            </h3>
            <p className="text-white/80 mb-6">
              Let our AI analyze your brand and recommend the best-fit creators for your campaigns.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              <Link href="/brand/smart-match">
                <Sparkles className="w-5 h-5 mr-2" />
                Try Smart Match
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BrandDashboard;
