"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { X, Plus, Check, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useFavorites, type FavoriteItem, type FavoriteItemSnapshot } from "./FavoritesContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SaveTarget {
  profileId: string;
  profileType: "creator" | "brand";
  snapshot: FavoriteItemSnapshot;
}

interface SaveCollectionModalProps {
  target: SaveTarget | null;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const COLLECTION_EMOJIS = ["⭐", "🎮", "💄", "💻", "🤝", "🎨", "🏋️", "📱", "🌿", "🍕", "✈️", "🎵"];

export default function SaveCollectionModal({ target, onClose }: SaveCollectionModalProps) {
  const { collections, toggleInCollection, createCollection, getItemCollections } = useFavorites();
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("📁");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [creating, setCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const inCollectionIds = target ? new Set(getItemCollections(target.profileId)) : new Set<string>();

  useEffect(() => {
    if (target && creating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [target, creating]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: Event) => {
      if ((e as unknown as KeyboardEvent).key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!target) return null;

  const handleToggle = (collectionId: string) => {
    const item: FavoriteItem = {
      profileId: target.profileId,
      profileType: target.profileType,
      savedAt: new Date().toISOString(),
      snapshot: target.snapshot,
    };
    toggleInCollection(collectionId, item);
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const col = createCollection(newName.trim(), newEmoji);
    // Auto-add the profile to the newly created collection
    const item: FavoriteItem = {
      profileId: target.profileId,
      profileType: target.profileType,
      savedAt: new Date().toISOString(),
      snapshot: target.snapshot,
    };
    toggleInCollection(col.id, item);
    setNewName("");
    setNewEmoji("📁");
    setCreating(false);
  };

  const handleNewKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCreate();
    if (e.key === "Escape") { setCreating(false); setNewName(""); }
  };

  const savedCount = collections.reduce(
    (n, col) => n + (col.items.some((i) => i.profileId === target.profileId) ? 1 : 0),
    0
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal
        aria-label="Save to collection"
        className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.85)] overflow-hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-200">

          {/* Top accent */}
          <div className="h-0.5 w-full gradient-primary" />

          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-neutral-800">
            <div>
              <h2 className="font-display text-[15px] font-bold leading-tight">
                Save to Collection
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[220px]">
                {target.snapshot.displayName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-neutral-700 hover:bg-neutral-800 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Collections list */}
          <div className="px-3 py-3 max-h-72 overflow-y-auto space-y-1">
            {collections.map((col) => {
              const isIn = inCollectionIds.has(col.id);
              return (
                <button
                  key={col.id}
                  onClick={() => handleToggle(col.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150",
                    isIn
                      ? "bg-primary/10 border border-primary/25"
                      : "hover:bg-neutral-800 border border-transparent"
                  )}
                >
                  {/* Emoji */}
                  <span className="text-base w-8 text-center shrink-0 leading-none">{col.emoji}</span>

                  {/* Name + count */}
                  <div className="flex-1 min-w-0">
                    <span className={cn("text-sm font-semibold", isIn ? "text-primary" : "text-foreground")}>
                      {col.name}
                    </span>
                    <div className="text-[11px] text-muted-foreground">
                      {col.items.length} saved
                    </div>
                  </div>

                  {/* Check indicator */}
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                      isIn
                        ? "bg-primary border-primary"
                        : "border-neutral-600 hover:border-neutral-400"
                    )}
                  >
                    {isIn && <Check className="w-3 h-3 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Create new collection */}
          <div className="px-3 pb-3 pt-1 border-t border-neutral-800">
            {creating ? (
              <div className="space-y-2 pt-2">
                {/* Emoji selector row */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker((v) => !v)}
                    className="w-10 h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 flex items-center justify-center text-lg transition-colors"
                  >
                    {newEmoji}
                  </button>
                  <Input
                    ref={inputRef}
                    placeholder="Collection name…"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleNewKeyDown}
                    className="flex-1 h-10 border-neutral-800 bg-neutral-950/50 text-sm focus:border-primary/50"
                    maxLength={30}
                  />
                  <Button
                    size="sm"
                    className="h-10 px-3 btn-gradient shrink-0"
                    onClick={handleCreate}
                    disabled={!newName.trim()}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>

                {/* Emoji picker */}
                {showEmojiPicker && (
                  <div className="flex flex-wrap gap-1.5 p-2 bg-neutral-800 rounded-xl">
                    {COLLECTION_EMOJIS.map((e) => (
                      <button
                        key={e}
                        onClick={() => { setNewEmoji(e); setShowEmojiPicker(false); }}
                        className={cn(
                          "w-8 h-8 rounded-lg text-base flex items-center justify-center transition-colors",
                          newEmoji === e ? "bg-primary/20 ring-1 ring-primary" : "hover:bg-neutral-700"
                        )}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => { setCreating(false); setNewName(""); }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCreating(true)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-neutral-800 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg border-2 border-dashed border-neutral-700 group-hover:border-neutral-500 flex items-center justify-center transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                Create new collection
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 pb-4 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {savedCount > 0
                ? `Saved in ${savedCount} collection${savedCount > 1 ? "s" : ""}`
                : "Not saved yet"}
            </span>
            <Button size="sm" variant="outline" className="h-8 border-neutral-700 hover:border-neutral-500 gap-1.5" onClick={onClose}>
              <FolderOpen className="w-3.5 h-3.5" />
              Done
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
