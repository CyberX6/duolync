import { useState } from "react";
import Link from "next/link";
import { Heart, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface SavedProfile {
  id: string;
  saved_profile_id: string;
  created_at: string;
  profile: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    user_type: string;
    niche: string | null;
    total_followers: number;
    avg_engagement_rate: number;
    primary_platform: string | null;
    industry: string | null;
  };
}

const SavedProfiles = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [loading] = useState(false);

  const removeSaved = (savedId: string) => {
    setSavedProfiles((prev) => prev.filter((s) => s.id !== savedId));
    toast({ title: "Removed from saved" });
  };

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
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Saved Profiles</h1>
          <p className="text-muted-foreground">
            Your saved {profile?.user_type === "brand" ? "creators" : "brands"}
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card-elevated p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-full bg-secondary" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-secondary rounded w-3/4" />
                    <div className="h-3 bg-secondary rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : savedProfiles.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {savedProfiles.map((saved) => (
              <div key={saved.id} className="card-interactive p-4">
                <div className="flex items-start gap-4">
                  <Link href={`/profile/${saved.profile.id}`}>
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-2xl shrink-0">
                      {saved.profile.avatar_url ? (
                        <img
                          src={saved.profile.avatar_url}
                          alt={saved.profile.full_name || ""}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        "👤"
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/profile/${saved.profile.id}`}
                      className="font-display font-bold hover:underline block truncate"
                    >
                      {saved.profile.full_name || "User"}
                    </Link>
                    <p className="text-sm text-muted-foreground truncate capitalize">
                      {saved.profile.user_type === "creator"
                        ? saved.profile.niche
                        : saved.profile.industry}
                    </p>
                    {saved.profile.user_type === "creator" && (
                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <span>
                          {saved.profile.primary_platform
                            ? platformEmoji[saved.profile.primary_platform]
                            : "📱"}
                        </span>
                        <span>{formatNumber(saved.profile.total_followers)}</span>
                        <span className="text-green-600 font-medium">
                          {saved.profile.avg_engagement_rate}% ER
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/messages?to=${saved.profile.id}`}>
                        <MessageSquare className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSaved(saved.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-elevated p-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold mb-2">No saved profiles</h3>
            <p className="text-muted-foreground mb-4">
              Save profiles to quickly access them later
            </p>
            <Button asChild>
              <Link href={profile?.user_type === "brand" ? "/brand/discover" : "/community"}>
                {profile?.user_type === "brand" ? "Discover Creators" : "Browse Community"}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SavedProfiles;
