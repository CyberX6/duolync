"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users, Plus, Home, Search, MessageSquare, Heart, Sparkles,
  BarChart3, Link2, Compass, FileText, FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useMessaging } from "@/app/_components/messaging/MessagingContext";
import {
  getCommunityListsAction,
  createCommunityListAction,
  type CommunityListWithCount,
} from "@/app/actions/communities";
import { cn } from "@/lib/utils";

const GroupsPanel = () => {
  const { profile } = useAuth();
  const { unreadCount } = useMessaging();
  const pathname = usePathname();
  const isBrand = profile?.user_type === "brand";

  const [communityLists, setCommunityLists] = useState<CommunityListWithCount[]>([]);
  const [newListName, setNewListName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!isBrand) return;
    getCommunityListsAction().then((res) => {
      if (!res.error) setCommunityLists(res.data);
    });
  }, [isBrand]);

  const handleCreate = async () => {
    if (!newListName.trim()) return;
    setCreating(true);
    const res = await createCommunityListAction(newListName);
    setCreating(false);
    if (!res.error && res.data) {
      setCommunityLists((prev) => [...prev, res.data!]);
      setNewListName("");
      setShowInput(false);
    }
  };

  const mainNavItems = isBrand
    ? [
        { icon: Compass, label: "Feed", path: "/feed" },
        { icon: Home, label: "Dashboard", path: "/brand/dashboard" },
        { icon: Search, label: "Discover", path: "/brand/discover" },
        { icon: Sparkles, label: "Smart Match", path: "/brand/smart-match" },
        { icon: FileText, label: "Proposals", path: "/brand/proposals" },
        { icon: Heart, label: "Saved", path: "/brand/saved" },
        { icon: MessageSquare, label: "Messages", path: "/messages" },
        { icon: Users, label: "Community", path: "/community" },
      ]
    : [
        { icon: Compass, label: "Feed", path: "/feed" },
        { icon: Home, label: "Dashboard", path: "/creator/dashboard" },
        { icon: Search, label: "Discover", path: "/creator/discover" },
        { icon: BarChart3, label: "Analytics", path: "/creator/analytics" },
        { icon: Link2, label: "Social Accounts", path: "/creator/accounts" },
        { icon: Heart, label: "Saved", path: "/creator/saved" },
        { icon: MessageSquare, label: "Messages", path: "/messages" },
        { icon: Users, label: "Community", path: "/community" },
      ];

  return (
    <aside className="hidden lg:flex w-64 shrink-0 sticky top-16 self-start h-[calc(100vh-4rem)] flex-col border-r border-zinc-200 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <ScrollArea className="flex-1 p-4">
        {/* Main Navigation */}
        <nav className="space-y-1 mb-6">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.path;
            const isMessages = item.label === "Messages";
            const hasUnread = isMessages && unreadCount > 0;
            const activeClass = isBrand
              ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/25 dark:border-cyan-500/20 shadow-sm shadow-cyan-500/10"
              : "gradient-primary text-white shadow-sm shadow-primary/30";
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm",
                  isActive
                    ? activeClass
                    : [
                        "hover:text-foreground hover:bg-secondary",
                        hasUnread
                          ? "font-bold text-foreground"
                          : "font-medium text-muted-foreground",
                      ],
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {hasUnread && !isActive && (
                  <span className="min-w-[18px] h-[18px] bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center px-1 leading-none shrink-0">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* My Communities (brand only) */}
        {isBrand && (
          <div className="border-t border-zinc-200 dark:border-zinc-800/50 pt-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                My Communities
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setShowInput((v) => !v)}
                title="New list"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {showInput && (
              <div className="mb-2 flex gap-1">
                <input
                  autoFocus
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreate();
                    if (e.key === "Escape") { setShowInput(false); setNewListName(""); }
                  }}
                  placeholder="List name…"
                  maxLength={60}
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-lg bg-secondary border border-transparent focus:border-primary/50 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleCreate}
                  disabled={creating || !newListName.trim()}
                  className="text-xs px-2 py-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 transition-colors"
                >
                  {creating ? "…" : "Add"}
                </button>
              </div>
            )}

            {communityLists.length > 0 ? (
              <div className="space-y-0.5">
                {communityLists.map((list) => (
                  <Link
                    key={list.id}
                    href="/community"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <FolderOpen className="w-3.5 h-3.5 text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate text-xs">{list.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {list.memberCount} creator{list.memberCount !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Users className="w-7 h-7 text-muted-foreground mx-auto mb-1.5" />
                <p className="text-xs text-muted-foreground">No lists yet</p>
                <Button
                  variant="link"
                  size="sm"
                  className="text-primary text-xs"
                  onClick={() => setShowInput(true)}
                >
                  Create a list
                </Button>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </aside>
  );
};

export default GroupsPanel;
