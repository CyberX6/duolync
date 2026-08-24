"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  MessageSquare, Users, Search, Plus, Trash2, FolderPlus, Check,
  ListPlus, UserPlus, FolderOpen, MoveRight, MapPin, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMessaging } from "@/components/messaging/MessagingContext";
import {
  getCommunityListsAction,
  createCommunityListAction,
  deleteCommunityListAction,
  removeCreatorFromListAction,
  addCreatorToListAction,
  type CommunityListWithCount,
} from "@/app/actions/communities";
import { getCreatorsAction } from "@/app/actions/discover";
import { cn } from "@/lib/utils";

interface CreatorEntry {
  id: string;
  full_name: string;
  avatar_url: string | null;
  niche: string | null;
  primary_platform: string | null;
  total_followers: number;
  avg_engagement_rate: number;
  location: string | null;
}

const platformEmoji: Record<string, string> = {
  youtube: "▶️", tiktok: "📱", instagram: "📷",
  twitter: "🐦", twitch: "🎮", linkedin: "💼",
};

const formatFollowers = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
};

// ─── Creator card (full card design, matches Discover style) ──────────────────

function CreatorCard({
  creator,
  currentListId,
  lists,
  onRemove,
  onMove,
}: {
  creator: CreatorEntry;
  currentListId: string;
  lists: CommunityListWithCount[];
  onRemove: (listId: string, creatorId: string) => void;
  onMove: (fromListId: string, toListId: string, creatorId: string) => void;
}) {
  const { openChatWindow } = useMessaging();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [moveLoading, setMoveLoading] = useState<string | null>(null);

  const initials = creator.full_name
    .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const otherLists = lists.filter((l) => l.id !== currentListId);

  const handleMove = async (toListId: string, toListName: string) => {
    setMoveLoading(toListId);
    // Add to new list first, then remove from current
    const addRes = await addCreatorToListAction(toListId, creator.id);
    if (addRes.error) {
      toast({ title: "Error", description: addRes.error, variant: "destructive" });
      setMoveLoading(null);
      return;
    }
    const removeRes = await removeCreatorFromListAction(currentListId, creator.id);
    setMoveLoading(null);
    if (removeRes.error) {
      toast({ title: "Partial error", description: removeRes.error, variant: "destructive" });
    } else {
      onMove(currentListId, toListId, creator.id);
      toast({ title: "Moved", description: `Moved to "${toListName}"` });
    }
  };

  return (
    <div className="group flex flex-col bg-white dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.03)] dark:shadow-none hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.45)] hover:-translate-y-0.5">
      <div className="p-5 flex flex-col flex-1">
        {/* Avatar + name */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 ring-2 ring-zinc-200/80 dark:ring-zinc-700/50">
            {creator.avatar_url ? (
              <img src={creator.avatar_url} alt={creator.full_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-violet-600 to-purple-600">
                {initials}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Link
              href={`/profile/${creator.id}`}
              className="font-display font-bold text-sm truncate block hover:text-primary transition-colors"
            >
              {creator.full_name}
            </Link>
            {creator.niche && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">{creator.niche}</p>
            )}
            {creator.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">{creator.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 py-2.5 mb-3 border-y border-zinc-100 dark:border-zinc-800/60 text-xs text-muted-foreground">
          {creator.primary_platform && (
            <span className="flex items-center gap-1">
              <span>{platformEmoji[creator.primary_platform] ?? "🌐"}</span>
              <span className="capitalize">{creator.primary_platform}</span>
            </span>
          )}
          {creator.total_followers > 0 && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {formatFollowers(creator.total_followers)}
            </span>
          )}
          {creator.avg_engagement_rate > 0 && (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              {creator.avg_engagement_rate}%
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Button size="sm" variant="outline" className="flex-1 h-8 text-xs rounded-xl" asChild>
            <Link href={`/profile/${creator.id}`}>View Profile</Link>
          </Button>
          {profile && profile.id !== creator.id && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:border-teal-200 dark:hover:border-teal-500/40 hover:text-teal-600 dark:hover:text-teal-400 shrink-0 transition-colors"
              title="Message"
              onClick={() => openChatWindow({
                id: creator.id,
                full_name: creator.full_name,
                avatar_url: creator.avatar_url,
                user_type: "creator",
              })}
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </Button>
          )}

          {/* Move to list */}
          {otherLists.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:border-violet-200 dark:hover:border-violet-500/40 hover:text-violet-600 dark:hover:text-violet-400 shrink-0 transition-colors"
                  title="Move to another list"
                >
                  <MoveRight className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Move to list
                </div>
                <DropdownMenuSeparator />
                {otherLists.map((l) => (
                  <DropdownMenuItem
                    key={l.id}
                    disabled={moveLoading === l.id}
                    onClick={() => handleMove(l.id, l.name)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <ListPlus className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate text-sm">{l.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground shrink-0">{l.memberCount}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Remove from list */}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/40 shrink-0 transition-colors"
            title="Remove from list"
            onClick={() => onRemove(currentListId, creator.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const Community = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const isBrand = profile?.user_type === "brand";

  const [lists, setLists] = useState<CommunityListWithCount[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [allCreators, setAllCreators] = useState<CreatorEntry[]>([]);
  const [search, setSearch] = useState("");

  // Create list modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [creating, setCreating] = useState(false);
  const [confirmDeleteList, setConfirmDeleteList] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (!isBrand) return;
    getCommunityListsAction().then((res) => {
      if (!res.error) {
        setLists(res.data);
        if (res.data.length > 0) setActiveListId(res.data[0].id);
      }
    });
    getCreatorsAction().then((data) => setAllCreators(data as CreatorEntry[]));
  }, [isBrand]);

  const activeList = lists.find((l) => l.id === activeListId) ?? null;

  const membersInActiveList = activeList
    ? allCreators.filter(
        (c) =>
          activeList.memberUserIds.includes(c.id) &&
          (!search ||
            c.full_name.toLowerCase().includes(search.toLowerCase()) ||
            c.niche?.toLowerCase().includes(search.toLowerCase())),
      )
    : [];

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    setCreating(true);
    const res = await createCommunityListAction(newListName);
    setCreating(false);
    if (res.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else if (res.data) {
      setLists((prev) => [...prev, res.data!]);
      setActiveListId(res.data.id);
      setNewListName("");
      setShowCreateModal(false);
      toast({ title: "List created", description: `"${res.data.name}" is ready.` });
    }
  };

  const handleDeleteList = async (listId: string, listName: string) => {
    setConfirmDeleteList({ id: listId, name: listName });
  };

  const confirmDeleteListAction = async () => {
    if (!confirmDeleteList) return;
    const { id: listId } = confirmDeleteList;
    setConfirmDeleteList(null);
    const res = await deleteCommunityListAction(listId);
    if (res.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      const remaining = lists.filter((l) => l.id !== listId);
      setLists(remaining);
      setActiveListId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleRemoveMember = useCallback(async (listId: string, creatorUserId: string) => {
    const res = await removeCreatorFromListAction(listId, creatorUserId);
    if (res.error) {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    } else {
      setLists((prev) =>
        prev.map((l) =>
          l.id === listId
            ? {
                ...l,
                memberUserIds: l.memberUserIds.filter((id) => id !== creatorUserId),
                memberCount: l.memberCount - 1,
              }
            : l,
        ),
      );
      toast({ title: "Removed from list" });
    }
  }, [toast]);

  // Called by card after successful move (add+remove)
  const handleMoveCreator = useCallback((fromListId: string, toListId: string, creatorId: string) => {
    setLists((prev) =>
      prev.map((l) => {
        if (l.id === fromListId) {
          return {
            ...l,
            memberUserIds: l.memberUserIds.filter((id) => id !== creatorId),
            memberCount: l.memberCount - 1,
          };
        }
        if (l.id === toListId && !l.memberUserIds.includes(creatorId)) {
          return {
            ...l,
            memberUserIds: [...l.memberUserIds, creatorId],
            memberCount: l.memberCount + 1,
          };
        }
        return l;
      }),
    );
  }, []);

  if (!isBrand) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="font-display text-3xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground text-sm">Connect with brands and manage your network.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-1">Community</h1>
            <p className="text-muted-foreground text-sm">
              Your curated creator lists. Add creators from{" "}
              <Link href="/brand/discover" className="text-primary hover:underline">Discover</Link>
              {" "}or their profile.
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="gap-2 btn-gradient shrink-0">
            <FolderPlus className="w-4 h-4" />
            New List
          </Button>
        </div>

        {lists.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center mb-4">
              <FolderOpen className="w-8 h-8 text-violet-500" />
            </div>
            <h2 className="font-display text-xl font-bold mb-2">No lists yet</h2>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              Create a community list to organize creators you want to work with.
            </p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Button onClick={() => setShowCreateModal(true)} className="gap-2 btn-gradient">
                <Plus className="w-4 h-4" /> Create your first list
              </Button>
              <Button variant="outline" asChild>
                <Link href="/brand/discover">
                  <UserPlus className="w-4 h-4 mr-2" /> Discover creators
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Sidebar: list tabs */}
            <aside className="w-56 shrink-0 hidden sm:block">
              <div className="space-y-1">
                {lists.map((list) => (
                  <div key={list.id} className="group flex items-center gap-1">
                    <button
                      onClick={() => setActiveListId(list.id)}
                      className={cn(
                        "flex-1 flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left",
                        activeListId === list.id
                          ? "bg-violet-600 text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                      )}
                    >
                      <span className="truncate">{list.name}</span>
                      <span className={cn("text-xs ml-2 shrink-0", activeListId === list.id ? "text-white/70" : "text-muted-foreground")}>
                        {list.memberCount}
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteList(list.id, list.name)}
                      title="Delete list"
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-all"
                >
                  <Plus className="w-4 h-4" /> New list
                </button>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Mobile: list pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 sm:hidden">
                {lists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => setActiveListId(list.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                      activeListId === list.id
                        ? "bg-violet-600 text-white border-violet-600"
                        : "bg-secondary text-muted-foreground border-transparent",
                    )}
                  >
                    {list.name}
                    <span className="opacity-60">{list.memberCount}</span>
                  </button>
                ))}
              </div>

              {activeList && (
                <>
                  {/* List header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="font-display text-xl font-bold">{activeList.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {activeList.memberCount} {activeList.memberCount === 1 ? "creator" : "creators"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/brand/discover">
                        <ListPlus className="w-3.5 h-3.5 mr-1.5" /> Add creators
                      </Link>
                    </Button>
                  </div>

                  {/* Search */}
                  {activeList.memberCount > 0 && (
                    <div className="relative mb-5">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <Input
                        placeholder="Search in this list…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  )}

                  {/* Creator cards grid */}
                  {activeList.memberCount === 0 ? (
                    <div className="flex flex-col items-center py-16 text-center">
                      <Users className="w-10 h-10 text-muted-foreground/40 mb-3" />
                      <h3 className="font-semibold mb-1">List is empty</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Use the <span className="font-medium">Add to Community</span> button on any creator card in Discover.
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/brand/discover">
                          <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Discover creators
                        </Link>
                      </Button>
                    </div>
                  ) : membersInActiveList.length === 0 ? (
                    <div className="py-10 text-center text-sm text-muted-foreground">
                      No creators match &quot;{search}&quot;
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {membersInActiveList.map((creator) => (
                        <CreatorCard
                          key={creator.id}
                          creator={creator}
                          currentListId={activeList.id}
                          lists={lists}
                          onRemove={handleRemoveMember}
                          onMove={handleMoveCreator}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create List Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Community List</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Input
              placeholder='e.g. "Gaming Creators", "Beauty Partners"'
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreateList(); }}
              maxLength={60}
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-1.5">{newListName.length}/60 characters</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreateModal(false); setNewListName(""); }}>
              Cancel
            </Button>
            <Button onClick={handleCreateList} disabled={creating || !newListName.trim()} className="btn-gradient">
              {creating ? "Creating…" : "Create List"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete list confirmation */}
      <AlertDialog open={confirmDeleteList !== null} onOpenChange={(open) => { if (!open) setConfirmDeleteList(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{confirmDeleteList?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the list and all its members. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteListAction} className="bg-red-600 hover:bg-red-700 text-white">
              Delete List
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Community;
