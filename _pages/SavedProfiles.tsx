"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart, MessageSquare, Trash2, FolderOpen,
  Plus, ChevronRight, Briefcase, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites, type FavoritesCollection, type FavoriteItem } from "@/components/favorites/FavoritesContext";
import { useMessaging } from "@/components/messaging/MessagingContext";
import { cn } from "@/lib/utils";
import SaveCollectionModal, { type SaveTarget } from "@/components/favorites/SaveCollectionModal";

// ─── Collection folder card ───────────────────────────────────────────────────

const COLLECTION_INACTIVE =
  "bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/50 text-zinc-700 dark:text-zinc-300";

const CollectionFolder = ({
  collection,
  isSelected,
  onClick,
}: {
  collection: FavoritesCollection;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-left transition-all duration-150",
      isSelected
        ? "bg-primary/10 border-primary/30 text-primary"
        : COLLECTION_INACTIVE
    )}
  >
    <span className="text-xl leading-none">{collection.emoji}</span>
    <div className="flex-1 min-w-0">
      <div className={cn("text-sm font-semibold truncate", isSelected ? "text-primary" : "text-zinc-700 dark:text-zinc-300")}>
        {collection.name}
      </div>
      <div className="text-xs text-zinc-500 dark:text-zinc-400">
        {collection.items.length} saved
      </div>
    </div>
    <ChevronRight className={cn("w-4 h-4 shrink-0 transition-transform text-zinc-400 dark:text-zinc-500", isSelected && "rotate-90 text-primary")} />
  </button>
);

// ─── Profile item card ────────────────────────────────────────────────────────

const ProfileItemCard = ({
  item,
  onMessage,
  onRemove,
  onManage,
}: {
  item: FavoriteItem;
  onMessage: (item: FavoriteItem) => void;
  onRemove: (item: FavoriteItem) => void;
  onManage: (item: FavoriteItem) => void;
}) => {
  const isCreator = item.profileType === "creator";
  const initials = item.snapshot.displayName
    .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="group flex items-start gap-4 p-4 bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] dark:shadow-none hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-neutral-800 overflow-hidden ring-1 ring-zinc-200/80 dark:ring-neutral-700/50">
          {item.snapshot.avatarUrl ? (
            <img src={item.snapshot.avatarUrl} alt={item.snapshot.displayName} className="w-full h-full object-cover" />
          ) : (
            <div className={cn(
              "w-full h-full flex items-center justify-center text-sm font-bold text-white",
              isCreator ? "gradient-primary" : "bg-gradient-to-br from-teal-600 to-cyan-600"
            )}>
              {initials}
            </div>
          )}
        </div>
        <div className={cn(
          "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border border-white dark:border-neutral-900 flex items-center justify-center text-[9px] font-bold text-white",
          isCreator ? "bg-purple-600" : "bg-teal-600"
        )}>
          {isCreator ? "C" : "B"}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[14px] truncate mb-0.5 text-zinc-900 dark:text-zinc-50">{item.snapshot.displayName}</div>
        {item.snapshot.subtitle && (
          <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            {isCreator ? <Heart className="w-3 h-3 shrink-0" /> : <Briefcase className="w-3 h-3 shrink-0" />}
            <span className="truncate">{item.snapshot.subtitle}</span>
          </div>
        )}
        <div className={cn(
          "inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold",
          isCreator
            ? "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20"
            : "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-500/20"
        )}>
          {isCreator ? "Creator" : "Brand"}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onMessage(item)}
          title="Message"
          className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-neutral-800 hover:bg-zinc-50 dark:hover:bg-neutral-800 hover:border-zinc-300 dark:hover:border-neutral-600 flex items-center justify-center text-zinc-500 dark:text-muted-foreground hover:text-zinc-900 dark:hover:text-foreground transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onManage(item)}
          title="Manage collections"
          className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-neutral-800 hover:bg-primary/10 hover:border-primary/40 hover:text-primary flex items-center justify-center text-zinc-500 dark:text-muted-foreground transition-colors"
        >
          <FolderOpen className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onRemove(item)}
          title="Remove from this collection"
          className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-neutral-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-200 dark:hover:border-rose-500/40 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center text-zinc-500 dark:text-muted-foreground transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const SavedProfiles = () => {
  const { profile } = useAuth();
  const router = useRouter();
  const { collections, removeFromCollection, createCollection, getAllSavedItems } = useFavorites();
  const { openChatWindow } = useMessaging();

  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(
    collections.length > 0 ? collections[0].id : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showNewInput, setShowNewInput] = useState(false);
  const [manageTarget, setManageTarget] = useState<SaveTarget | null>(null);

  const selectedCollection = collections.find((c) => c.id === selectedCollectionId) ?? null;

  const displayedItems = (selectedCollectionId === "__all__"
    ? getAllSavedItems()
    : selectedCollection?.items ?? []
  ).filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.snapshot.displayName.toLowerCase().includes(q) ||
      item.snapshot.subtitle?.toLowerCase().includes(q) ||
      false
    );
  });

  const totalSaved = getAllSavedItems().length;

  const handleMessage = (item: FavoriteItem) => {
    if (!profile) return;
    openChatWindow({
      id: item.profileId,
      full_name: item.snapshot.displayName,
      avatar_url: item.snapshot.avatarUrl,
      user_type: item.profileType,
    });
  };

  const handleRemove = (item: FavoriteItem) => {
    if (!selectedCollectionId || selectedCollectionId === "__all__") return;
    removeFromCollection(selectedCollectionId, item.profileId);
  };

  const handleManage = (item: FavoriteItem) => {
    setManageTarget({
      profileId: item.profileId,
      profileType: item.profileType,
      snapshot: item.snapshot,
    });
  };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    const col = createCollection(newCollectionName.trim());
    setSelectedCollectionId(col.id);
    setNewCollectionName("");
    setShowNewInput(false);
  };

  const discoverLink = profile?.user_type === "brand" ? "/brand/discover" : "/creator/discover";

  return (
    <MainLayout>
      <SaveCollectionModal target={manageTarget} onClose={() => setManageTarget(null)} />

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="mb-7">
          <h1 className="font-display text-3xl font-bold mb-1">Saved Collections</h1>
          <p className="text-muted-foreground text-sm">
            {totalSaved > 0
              ? `${totalSaved} profile${totalSaved !== 1 ? "s" : ""} across ${collections.length} collection${collections.length !== 1 ? "s" : ""}`
              : "Organize your favourite profiles into collections"}
          </p>
        </div>

        {totalSaved === 0 ? (
          /* ─── Empty state ─── */
          <div className="flex flex-col items-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-primary/50" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">No saved profiles yet</h3>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-6">
              Click the heart icon on any creator or brand card to save them to a collection.
            </p>
            <Button className="btn-gradient rounded-xl" onClick={() => router.push(discoverLink)}>
              Go to Discover
            </Button>
          </div>
        ) : (
          <div className="flex gap-6 items-start">
            {/* ─── Left: collections sidebar ─── */}
            <div className="w-64 shrink-0 space-y-1.5">
              {/* All saved */}
              <button
                onClick={() => setSelectedCollectionId("__all__")}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-left transition-all duration-150",
                  selectedCollectionId === "__all__"
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : COLLECTION_INACTIVE
                )}
              >
                <span className="text-xl leading-none">🗂️</span>
                <div className="flex-1 min-w-0">
                  <div className={cn("text-sm font-semibold", selectedCollectionId === "__all__" ? "text-primary" : "text-zinc-700 dark:text-zinc-300")}>
                    All Saved
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{totalSaved} total</div>
                </div>
              </button>

              <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />

              {/* Individual collections */}
              {collections.map((col) => (
                <CollectionFolder
                  key={col.id}
                  collection={col}
                  isSelected={selectedCollectionId === col.id}
                  onClick={() => setSelectedCollectionId(col.id)}
                />
              ))}

              {/* Create new */}
              {showNewInput ? (
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="Collection name…"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateCollection();
                      if (e.key === "Escape") { setShowNewInput(false); setNewCollectionName(""); }
                    }}
                    className="h-9 text-sm bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:border-primary/50"
                    autoFocus
                  />
                  <Button size="sm" className="h-9 px-3 btn-gradient shrink-0" onClick={handleCreateCollection} disabled={!newCollectionName.trim()}>
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewInput(true)}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-zinc-500 dark:text-muted-foreground hover:text-zinc-900 dark:hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New collection
                </button>
              )}
            </div>

            {/* ─── Right: items grid ─── */}
            <div className="flex-1 min-w-0">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search saved profiles…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-primary/50 text-sm"
                />
              </div>

              {displayedItems.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-neutral-900 border border-zinc-200 dark:border-neutral-800 flex items-center justify-center mb-4">
                    <FolderOpen className="w-6 h-6 text-zinc-400 dark:text-neutral-600" />
                  </div>
                  <p className="font-semibold mb-1 text-zinc-900 dark:text-zinc-50">This collection is empty</p>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? "No results match your search." : "Save profiles from Discover to fill it."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayedItems.map((item) => (
                    <ProfileItemCard
                      key={item.profileId}
                      item={item}
                      onMessage={handleMessage}
                      onRemove={handleRemove}
                      onManage={handleManage}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SavedProfiles;
