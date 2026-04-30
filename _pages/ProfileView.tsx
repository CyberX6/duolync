import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, MessageSquare, MapPin, Globe, ExternalLink, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  id: string;
  user_type: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  niche: string | null;
  primary_platform: string | null;
  location: string | null;
  languages: string[];
  total_followers: number;
  avg_engagement_rate: number;
  company_name: string | null;
  industry: string | null;
  website: string | null;
}

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

const ProfileView = () => {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();
  const { profile: currentUser } = useAuth();
  const { toast } = useToast();
  const [profileData] = useState<ProfileData | null>(null);
  const [socialAccounts] = useState<SocialAccount[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [loading] = useState(false);

  const toggleSave = () => {
    if (!currentUser) return;
    setIsSaved((prev) => !prev);
    toast({ title: isSaved ? "Removed from saved" : "Saved to favorites!" });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-2">Profile not found</h1>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isCreator = profileData.user_type === "creator";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero py-8">
        <div className="container">
          <Button
            variant="ghost"
            className="mb-6 text-muted-foreground hover:text-foreground"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-2xl bg-card shadow-lg flex items-center justify-center text-5xl shrink-0">
              {profileData.avatar_url ? (
                <img
                  src={profileData.avatar_url}
                  alt={profileData.full_name || ""}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                "👤"
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="font-display text-3xl md:text-4xl font-bold">
                  {profileData.full_name || "User"}
                </h1>
                <Badge variant={isCreator ? "default" : "secondary"} className="capitalize">
                  {profileData.user_type}
                </Badge>
              </div>

              {isCreator ? (
                <>
                  <p className="text-lg text-muted-foreground mb-2">{profileData.niche}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {profileData.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profileData.location}
                      </span>
                    )}
                    {profileData.primary_platform && (
                      <span className="flex items-center gap-1">
                        <span>{platformEmoji[profileData.primary_platform]}</span>
                        Primary: {profileData.primary_platform}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg text-muted-foreground mb-2">
                    {profileData.company_name || profileData.industry}
                  </p>
                  {profileData.website && (
                    <a
                      href={profileData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Globe className="w-4 h-4" />
                      {profileData.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </>
              )}
            </div>

            {/* Actions */}
            {currentUser && currentUser.id !== profileData.id && (
              <div className="flex gap-2 shrink-0">
                <Button
                  variant={isSaved ? "default" : "outline"}
                  onClick={toggleSave}
                  className="gap-2"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                  {isSaved ? "Saved" : "Save"}
                </Button>
                <Button asChild>
                  <Link href={`/messages?to=${profileData.id}`}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            {profileData.bio && (
              <div className="card-elevated p-6">
                <h2 className="font-display text-xl font-bold mb-4">About</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{profileData.bio}</p>
              </div>
            )}

            {/* Social Accounts */}
            {isCreator && socialAccounts.length > 0 && (
              <div className="card-elevated p-6">
                <h2 className="font-display text-xl font-bold mb-4">Connected Platforms</h2>
                <div className="space-y-4">
                  {socialAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50"
                    >
                      <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center text-2xl">
                        {platformEmoji[account.platform]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold capitalize">{account.platform}</span>
                          {account.is_primary && (
                            <Badge variant="outline" className="text-xs">Primary</Badge>
                          )}
                        </div>
                        <a
                          href={account.profile_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          @{account.username}
                        </a>
                      </div>
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                          <div className="font-bold">{formatNumber(account.followers)}</div>
                          <div className="text-xs text-muted-foreground">Followers</div>
                        </div>
                        <div>
                          <div className="font-bold">{formatNumber(Number(account.total_views))}</div>
                          <div className="text-xs text-muted-foreground">Views</div>
                        </div>
                        <div>
                          <div className="font-bold text-green-600">{account.engagement_rate}%</div>
                          <div className="text-xs text-muted-foreground">ER</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            {isCreator && (
              <div className="card-elevated p-6">
                <h3 className="font-display font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Followers</span>
                    <span className="font-bold">{formatNumber(profileData.total_followers)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg. Engagement</span>
                    <span className="font-bold text-green-600">{profileData.avg_engagement_rate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Languages</span>
                    <span className="font-medium">
                      {profileData.languages?.join(", ") || "English"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Brand Info */}
            {!isCreator && (
              <div className="card-elevated p-6">
                <h3 className="font-display font-bold mb-4">Company Info</h3>
                <div className="space-y-4">
                  {profileData.company_name && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Company</span>
                      <span className="font-medium">{profileData.company_name}</span>
                    </div>
                  )}
                  {profileData.industry && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Industry</span>
                      <span className="font-medium">{profileData.industry}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
