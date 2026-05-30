"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FavoriteItemSnapshot {
  displayName: string;
  avatarUrl: string | null;
  subtitle: string | null;        // niche for creators, industry for brands
  primaryPlatform?: string | null;
}

export interface FavoriteItem {
  profileId: string;
  profileType: "creator" | "brand";
  savedAt: string;
  snapshot: FavoriteItemSnapshot;
}

export interface FavoritesCollection {
  id: string;
  name: string;
  emoji: string;
  createdAt: string;
  items: FavoriteItem[];
}

// ─── Default collections (seeded once per new user) ───────────────────────────

const DEFAULT_COLLECTIONS: FavoritesCollection[] = [
  { id: "col-shortlist",  name: "Shortlist",     emoji: "⭐", createdAt: new Date().toISOString(), items: [] },
  { id: "col-gaming",     name: "Gaming",         emoji: "🎮", createdAt: new Date().toISOString(), items: [] },
  { id: "col-beauty",     name: "Beauty & Style", emoji: "💄", createdAt: new Date().toISOString(), items: [] },
  { id: "col-tech",       name: "Tech Reviews",   emoji: "💻", createdAt: new Date().toISOString(), items: [] },
  { id: "col-future",     name: "Future Deals",   emoji: "🤝", createdAt: new Date().toISOString(), items: [] },
];

// ─── Context ──────────────────────────────────────────────────────────────────

interface FavoritesContextValue {
  collections: FavoritesCollection[];
  isInAnyCollection: (profileId: string) => boolean;
  getItemCollections: (profileId: string) => string[];          // collection ids
  toggleInCollection: (collectionId: string, item: FavoriteItem) => void;
  createCollection: (name: string, emoji?: string) => FavoritesCollection;
  removeFromCollection: (collectionId: string, profileId: string) => void;
  getAllSavedItems: () => FavoriteItem[];
}

const FavoritesContext = createContext<FavoritesContextValue>({
  collections: DEFAULT_COLLECTIONS,
  isInAnyCollection: () => false,
  getItemCollections: () => [],
  toggleInCollection: () => {},
  createCollection: () => DEFAULT_COLLECTIONS[0],
  removeFromCollection: () => {},
  getAllSavedItems: () => [],
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [collections, setCollections] = useState<FavoritesCollection[]>(DEFAULT_COLLECTIONS);
  const [hydrated, setHydrated] = useState(false);

  const lsKey = user ? `duolync_favorites_${user.id}` : null;

  // Load from localStorage when user is available
  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem(`duolync_favorites_${user.id}`);
      if (raw) {
        const stored = JSON.parse(raw) as FavoritesCollection[];
        if (Array.isArray(stored) && stored.length > 0) {
          setCollections(stored);
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [user]);

  // Persist on changes
  useEffect(() => {
    if (!hydrated || !lsKey) return;
    localStorage.setItem(lsKey, JSON.stringify(collections));
  }, [collections, hydrated, lsKey]);

  const isInAnyCollection = (profileId: string) =>
    collections.some((col) => col.items.some((item) => item.profileId === profileId));

  const getItemCollections = (profileId: string) =>
    collections
      .filter((col) => col.items.some((item) => item.profileId === profileId))
      .map((col) => col.id);

  const toggleInCollection = (collectionId: string, item: FavoriteItem) => {
    setCollections((prev) =>
      prev.map((col) => {
        if (col.id !== collectionId) return col;
        const exists = col.items.some((i) => i.profileId === item.profileId);
        return {
          ...col,
          items: exists
            ? col.items.filter((i) => i.profileId !== item.profileId)
            : [...col.items, { ...item, savedAt: new Date().toISOString() }],
        };
      })
    );
  };

  const createCollection = (name: string, emoji = "📁"): FavoritesCollection => {
    const newCol: FavoritesCollection = {
      id: `col-${Date.now()}`,
      name: name.trim(),
      emoji,
      createdAt: new Date().toISOString(),
      items: [],
    };
    setCollections((prev) => [...prev, newCol]);
    return newCol;
  };

  const removeFromCollection = (collectionId: string, profileId: string) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId
          ? { ...col, items: col.items.filter((i) => i.profileId !== profileId) }
          : col
      )
    );
  };

  const getAllSavedItems = (): FavoriteItem[] => {
    const seen = new Set<string>();
    const result: FavoriteItem[] = [];
    for (const col of collections) {
      for (const item of col.items) {
        if (!seen.has(item.profileId)) {
          seen.add(item.profileId);
          result.push(item);
        }
      }
    }
    return result;
  };

  return (
    <FavoritesContext.Provider
      value={{
        collections,
        isInAnyCollection,
        getItemCollections,
        toggleInCollection,
        createCollection,
        removeFromCollection,
        getAllSavedItems,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
