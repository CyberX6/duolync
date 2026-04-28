import { useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Heart, MessageSquare, ExternalLink, MapPin, Users, TrendingUp, ChevronDown, X, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Creator {
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
}

const platforms = [
  { value: "all", label: "All Platforms" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter/X" },
  { value: "twitch", label: "Twitch" },
  { value: "linkedin", label: "LinkedIn" },
];

const niches = [
  "All Niches", "Lifestyle", "Tech Reviews", "Gaming", "Beauty & Makeup",
  "Fashion", "Fitness", "Food & Cooking", "Travel", "Comedy", "Education", "Music", "Business"
];

const followerRanges = [
  { value: "all", label: "Any Size" },
  { value: "nano", label: "Nano (1K-10K)" },
  { value: "micro", label: "Micro (10K-100K)" },
  { value: "mid", label: "Mid-tier (100K-500K)" },
  { value: "macro", label: "Macro (500K-1M)" },
  { value: "mega", label: "Mega (1M+)" },
];

const platformIcons: Record<string, string> = {
  youtube: "🎬",
  tiktok: "📱",
  instagram: "📸",
  twitter: "𝕏",
  twitch: "🎮",
  linkedin: "💼",
};

const platformColors: Record<string, string> = {
  youtube: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  tiktok: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  instagram: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  twitter: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  twitch: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  linkedin: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const Feed = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [platform, setPlatform] = useState("all");
  const [niche, setNiche] = useState("All Niches");
  const [followerRange, setFollowerRange] = useState("all");

  const toggleSave = (creatorId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!profile) return;
    if (savedIds.has(creatorId)) {
      setSavedIds((prev) => { const next = new Set(prev); next.delete(creatorId); return next; });
      toast({ title: "Removed from saved" });
    } else {
      setSavedIds((prev) => new Set(prev).add(creatorId));
      toast({ title: "Saved to favorites!" });
    }
  };

  const filteredCreators = creators.filter((c) =>
    searchQuery
      ? c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.niche?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const formatFollowers = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const activeFiltersCount = [
    platform !== "all",
    niche !== "All Niches",
    followerRange !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setPlatform("all");
    setNiche("All Niches");
    setFollowerRange("all");
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Discover Creators</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Find and connect with top content creators
          </p>
        </div>

        {/* Search Bar - LinkedIn Style */}
        <div className="bg-card border border-border rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, niche, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-secondary/50 border-0 focus-visible:ring-1"
              />
            </div>
            <Button
              variant={filtersOpen ? "default" : "outline"}
              size="default"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="gap-2 shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Expandable Filters */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleContent className="pt-4 mt-4 border-t border-border">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Platform</label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {platforms.map((p) => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Niche</label>
                  <Select value={niche} onValueChange={setNiche}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {niches.map((n) => (
                        <SelectItem key={n} value={n}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Audience Size</label>
                  <Select value={followerRange} onValueChange={setFollowerRange}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {followerRanges.map((f) => (
                        <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {activeFiltersCount > 0 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    {platform !== "all" && (
                      <Badge variant="secondary" className="gap-1 pr-1">
                        {platforms.find(p => p.value === platform)?.label}
                        <button onClick={() => setPlatform("all")} className="ml-1 hover:bg-muted rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {niche !== "All Niches" && (
                      <Badge variant="secondary" className="gap-1 pr-1">
                        {niche}
                        <button onClick={() => setNiche("All Niches")} className="ml-1 hover:bg-muted rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {followerRange !== "all" && (
                      <Badge variant="secondary" className="gap-1 pr-1">
                        {followerRanges.find(f => f.value === followerRange)?.label}
                        <button onClick={() => setFollowerRange("all")} className="ml-1 hover:bg-muted rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                    Clear all
                  </Button>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="text-sm text-muted-foreground mb-4">
            {filteredCreators.length} creator{filteredCreators.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Creator Cards - LinkedIn Style */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-muted rounded w-1/3" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCreators.length > 0 ? (
          <div className="space-y-3">
            {filteredCreators.map((creator) => (
              <Link key={creator.id} href={`/profile/${creator.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition-all duration-200 hover:border-primary/30 group">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <Avatar className="w-16 h-16 shrink-0 border-2 border-border">
                        <AvatarImage src={creator.avatar_url || undefined} alt={creator.full_name || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                          {creator.full_name?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                {creator.full_name || "Creator"}
                              </h3>
                              {creator.total_followers >= 100000 && (
                                <Verified className="w-4 h-4 text-primary shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {creator.niche || "Content Creator"}
                            </p>
                          </div>
                          
                          {/* Platform Badge */}
                          {creator.primary_platform && (
                            <Badge 
                              variant="secondary" 
                              className={`shrink-0 ${platformColors[creator.primary_platform] || ''}`}
                            >
                              {platformIcons[creator.primary_platform]} {creator.primary_platform}
                            </Badge>
                          )}
                        </div>

                        {/* Bio */}
                        {creator.bio && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {creator.bio}
                          </p>
                        )}

                        {/* Stats Row */}
                        <div className="flex items-center flex-wrap gap-4 mt-3">
                          <div className="flex items-center gap-1.5 text-sm">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{formatFollowers(creator.total_followers)}</span>
                            <span className="text-muted-foreground">followers</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-sm">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="font-medium text-green-600">{creator.avg_engagement_rate}%</span>
                            <span className="text-muted-foreground">engagement</span>
                          </div>

                          {creator.location && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{creator.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                          <Button variant="default" size="sm" className="h-8">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8"
                            onClick={(e) => toggleSave(creator.id, e)}
                          >
                            <Heart className={`w-4 h-4 mr-1 ${savedIds.has(creator.id) ? 'fill-red-500 text-red-500' : ''}`} />
                            {savedIds.has(creator.id) ? 'Saved' : 'Save'}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 ml-auto">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">No creators found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Feed;
