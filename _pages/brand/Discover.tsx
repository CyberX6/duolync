"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search, SlidersHorizontal, Heart, MessageSquare, X,
  MapPin, BadgeCheck, Users, TrendingUp, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import MainLayout from "@/components/layout/MainLayout";
import ProfileDrawer, {
  type Creator, PlatformBadge, PLATFORM_META,
} from "@/components/discovery/ProfileDrawer";
import SaveCollectionModal, { type SaveTarget } from "@/components/favorites/SaveCollectionModal";
import { useProfiles } from "@/components/discovery/ProfilesContext";
import { useFavorites } from "@/components/favorites/FavoritesContext";
import { useMessaging } from "@/components/messaging/MessagingContext";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTER_PLATFORMS = ["instagram", "tiktok", "youtube", "twitter", "twitch"];

const NICHES = [
  "All Niches", "Tech", "Lifestyle", "Gaming", "Beauty", "Fashion",
  "Fitness", "Food", "Travel", "Comedy", "Education", "Music", "Sustainability",
];

const REACH_RANGES = [
  { value: "all",   label: "Any" },
  { value: "nano",  label: "<50K" },
  { value: "micro", label: "50K–200K" },
  { value: "mid",   label: "200K–1M" },
  { value: "mega",  label: "1M+" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatReach(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function getNicheTags(niche: string | null): string[] {
  if (!niche) return [];
  return niche.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 3);
}

function matchesReach(followers: number, range: string): boolean {
  if (range === "all")   return true;
  if (range === "nano")  return followers < 50_000;
  if (range === "micro") return followers >= 50_000 && followers < 200_000;
  if (range === "mid")   return followers >= 200_000 && followers < 1_000_000;
  if (range === "mega")  return followers >= 1_000_000;
  return true;
}

// ─── Creator Card ─────────────────────────────────────────────────────────────

const CreatorCard = ({
  creator,
  isSaved,
  onSave,
  onViewProfile,
  onMessage,
}: {
  creator: Creator;
  isSaved: boolean;
  onSave: (target: SaveTarget) => void;
  onViewProfile: (c: Creator) => void;
  onMessage: (c: Creator) => void;
}) => {
  const tags = getNicheTags(creator.niche);
  const initials = creator.full_name
    ? creator.full_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "??";
  const platformEntries = Object.entries(creator.platforms ?? {}).slice(0, 3);

  return (
    <div className="group relative flex flex-col bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-none hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.45)] hover:-translate-y-0.5">
      {/* Save button */}
      <button
        onClick={() =>
          onSave({
            profileId: creator.id,
            profileType: "creator",
            snapshot: {
              displayName: creator.full_name,
              avatarUrl: creator.avatar_url,
              subtitle: creator.niche,
              primaryPlatform: creator.primary_platform,
            },
          })
        }
        aria-label={isSaved ? "Manage collections" : "Save creator"}
        className="absolute top-3.5 right-3.5 z-10 w-7 h-7 rounded-full bg-white dark:bg-zinc-800/90 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm dark:shadow-none"
      >
        <Heart
          className={cn(
            "w-3.5 h-3.5 transition-colors",
            isSaved ? "fill-rose-500 text-rose-500" : "text-zinc-400 dark:text-neutral-400 group-hover:text-zinc-600 dark:group-hover:text-neutral-300"
          )}
        />
      </button>

      <div className="p-5 flex flex-col flex-1">
        {/* Avatar + name */}
        <div className="flex items-start gap-3 mb-4 pr-8">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden ring-2 ring-zinc-200/80 dark:ring-zinc-700/50">
              {creator.avatar_url ? (
                <img src={creator.avatar_url} alt={creator.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-base font-bold text-zinc-400 dark:text-neutral-400">
                  {initials}
                </div>
              )}
            </div>
            {creator.primary_platform && (
              <div className="absolute -bottom-1 -right-1">
                <PlatformBadge platform={creator.primary_platform} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-display font-bold text-[15px] truncate text-zinc-900 dark:text-zinc-50">{creator.full_name}</span>
              {creator.verified && <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />}
            </div>
            {creator.location && (
              <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{creator.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Niche tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map((tag) => (
              <span key={tag} className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-500/20 font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Platform stats */}
        {platformEntries.length > 0 && (
          <div className="flex items-center gap-3 py-2.5 mb-3 border-y border-zinc-200/60 dark:border-zinc-800/60">
            {platformEntries.map(([p, count]) => (
              <div key={p} className="flex items-center gap-1.5">
                <PlatformBadge platform={p} />
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{count}</span>
              </div>
            ))}
          </div>
        )}

        {creator.bio && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">{creator.bio}</p>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-0 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl overflow-hidden mb-4 mt-auto">
          <div className="flex flex-col items-center py-3 px-2">
            <div className="flex items-center gap-1 mb-0.5">
              <Users className="w-3 h-3 text-zinc-400 dark:text-muted-foreground" />
              <span className="text-sm font-display font-bold text-zinc-800 dark:text-zinc-200">{formatReach(creator.total_followers)}</span>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">Reach</span>
          </div>
          <div className="flex flex-col items-center py-3 px-2 border-x border-zinc-200/60 dark:border-zinc-800/80">
            <div className="flex items-center gap-1 mb-0.5">
              <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-display font-bold text-emerald-600 dark:text-emerald-400">{creator.avg_engagement_rate}%</span>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">Eng Rate</span>
          </div>
          <div className="flex flex-col items-center py-3 px-2">
            <span className="text-sm font-display font-bold truncate w-full text-center text-zinc-800 dark:text-zinc-200">
              {creator.location?.split(",")[0] ?? "—"}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">Location</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 h-8 text-xs btn-gradient rounded-xl font-semibold" onClick={() => onViewProfile(creator)}>
            View Profile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:border-teal-200 dark:hover:border-teal-500/40 hover:text-teal-600 dark:hover:text-teal-400 shrink-0 transition-colors"
            aria-label="Send message"
            onClick={() => onMessage(creator)}
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Skeleton & Empty ─────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl p-5 animate-pulse shadow-[0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-none">
    <div className="flex gap-3 mb-4 pr-8">
      <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-3/4" />
        <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-1/2" />
      </div>
    </div>
    <div className="flex gap-2 mb-3">
      <div className="h-5 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
      <div className="h-5 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
    </div>
    <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-full mb-2" />
    <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-4/5 mb-4" />
    <div className="flex gap-2">
      <div className="flex-1 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
      <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
    </div>
  </div>
);

const EmptyState = ({ isFiltered, onClear }: { isFiltered: boolean; onClear: () => void }) => (
  <div className="col-span-full flex flex-col items-center py-20 px-6 text-center">
    <div className="relative mb-6">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Search className="w-8 h-8 text-primary/50" />
      </div>
      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full gradient-primary shadow-[0_0_12px_rgba(139,92,246,0.5)]" />
    </div>
    <h3 className="font-display text-xl font-bold mb-2">
      {isFiltered ? "No creators match your filters" : "No creators yet"}
    </h3>
    <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-6">
      {isFiltered ? "Try broadening your terms or removing some filters." : "Creators are joining Duolync every day — check back soon."}
    </p>
    {isFiltered && (
      <Button variant="outline" size="sm" className="gap-2 border-neutral-800 hover:border-neutral-600" onClick={onClear}>
        <X className="w-3.5 h-3.5" />Clear all filters
      </Button>
    )}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const Discover = () => {
  const router = useRouter();
  const { profile } = useAuth();
  const { creators } = useProfiles();
  const { isInAnyCollection } = useFavorites();
  const { openChatWindow } = useMessaging();

  const [loading] = useState(false);
  const [saveTarget, setSaveTarget] = useState<SaveTarget | null>(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  // Search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [niche, setNiche] = useState("All Niches");
  const [reachRange, setReachRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const handleMessage = (creator: Creator) => {
    if (!profile) return;
    openChatWindow({
      id: creator.id,
      full_name: creator.full_name,
      avatar_url: creator.avatar_url,
      user_type: "creator",
    });
  };

  const openProfile = (creator: Creator) => {
    setSelectedCreator(creator);
    setDrawerOpen(true);
  };

  const togglePlatform = (p: string) =>
    setSelectedPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  const clearFilters = () => {
    setSearchQuery(""); setSelectedPlatforms([]); setNiche("All Niches"); setReachRange("all");
  };

  const filtered = useMemo(
    () => creators.filter((c) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!c.full_name?.toLowerCase().includes(q) && !c.niche?.toLowerCase().includes(q) && !c.location?.toLowerCase().includes(q)) return false;
      }
      if (selectedPlatforms.length > 0 && (!c.primary_platform || !selectedPlatforms.includes(c.primary_platform))) return false;
      if (niche !== "All Niches" && !c.niche?.toLowerCase().includes(niche.toLowerCase())) return false;
      if (!matchesReach(c.total_followers, reachRange)) return false;
      return true;
    }),
    [creators, searchQuery, selectedPlatforms, niche, reachRange]
  );

  const activeFilterCount = selectedPlatforms.length + (niche !== "All Niches" ? 1 : 0) + (reachRange !== "all" ? 1 : 0);
  const isFiltered = !!searchQuery || activeFilterCount > 0;

  return (
    <MainLayout>
      <ProfileDrawer
        creator={selectedCreator}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onMessage={handleMessage}
      />

      <SaveCollectionModal target={saveTarget} onClose={() => setSaveTarget(null)} />

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-7">
          <h1 className="font-display text-3xl font-bold mb-1">Discover Creators</h1>
          <p className="text-muted-foreground text-sm">
            Find and connect with the perfect content creators for your brand
          </p>
        </div>

        {/* Search + filter toggle */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name, niche, or location…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-primary/50"
            />
          </div>
          <Button
            variant="outline"
            className={cn("h-11 gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-600 shrink-0 transition-colors", showFilters && "border-primary/60 text-primary bg-primary/5")}
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>
            )}
            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showFilters && "rotate-180")} />
          </Button>
        </div>

        {/* Filter panel */}
        <div className={cn("overflow-hidden transition-all duration-300 ease-in-out", showFilters ? "max-h-96 opacity-100 mb-4" : "max-h-0 opacity-0")}>
          <div className="bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Platform</p>
              <div className="flex flex-wrap gap-2">
                {FILTER_PLATFORMS.map((p) => {
                  const active = selectedPlatforms.includes(p);
                  return (
                    <button key={p} onClick={() => togglePlatform(p)}
                      className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150",
                        active ? "border-primary bg-primary/10 text-primary" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-zinc-500 dark:text-muted-foreground hover:border-zinc-300 dark:hover:border-neutral-600 hover:text-zinc-900 dark:hover:text-foreground"
                      )}
                    >
                      <PlatformBadge platform={p} />
                      {PLATFORM_META[p]?.label ?? p}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Niche / Category</p>
                <Select value={niche} onValueChange={setNiche}>
                  <SelectTrigger className="h-9 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{NICHES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Audience Reach</p>
                <div className="flex flex-wrap gap-2">
                  {REACH_RANGES.map((r) => (
                    <button key={r.value} onClick={() => setReachRange(r.value)}
                      className={cn("px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150",
                        reachRange === r.value ? "border-primary bg-primary/10 text-primary" : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-zinc-500 dark:text-muted-foreground hover:border-zinc-300 dark:hover:border-neutral-600 hover:text-zinc-900 dark:hover:text-foreground"
                      )}
                    >{r.label}</button>
                  ))}
                </div>
              </div>
            </div>
            {isFiltered && (
              <div className="flex items-center justify-between pt-1 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-xs text-muted-foreground">{filtered.length} creator{filtered.length !== 1 ? "s" : ""}</span>
                <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                  <X className="w-3 h-3" />Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Count */}
        <div className="flex items-center justify-between mb-6 gap-4 min-h-[28px]">
          <div className="flex flex-wrap gap-2">
            {[
              ...selectedPlatforms.map((p) => PLATFORM_META[p]?.label ?? p),
              niche !== "All Niches" ? niche : null,
              reachRange !== "all" ? REACH_RANGES.find((r) => r.value === reachRange)?.label : null,
              searchQuery ? `"${searchQuery}"` : null,
            ].filter(Boolean).map((chip, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-primary/10 text-primary/80 border border-primary/20 font-medium">
                {chip as string}
                <button onClick={() => {
                  const pKey = Object.entries(PLATFORM_META).find(([, v]) => v.label === chip)?.[0];
                  if (pKey) togglePlatform(pKey);
                  else if (chip === niche) setNiche("All Niches");
                  else if (chip === REACH_RANGES.find((r) => r.value === reachRange)?.label) setReachRange("all");
                  else setSearchQuery("");
                }}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          {!loading && (
            <span className="text-xs text-muted-foreground shrink-0">{filtered.length} creator{filtered.length !== 1 ? "s" : ""}</span>
          )}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length > 0 ? (
            filtered.map((c) => (
              <CreatorCard
                key={c.id}
                creator={c}
                isSaved={isInAnyCollection(c.id)}
                onSave={setSaveTarget}
                onViewProfile={openProfile}
                onMessage={handleMessage}
              />
            ))
          ) : (
            <EmptyState isFiltered={isFiltered} onClear={clearFilters} />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Discover;
