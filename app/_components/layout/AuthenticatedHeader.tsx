"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMessaging } from "@/app/_components/messaging/MessagingContext";
import { ThemeToggle } from "@/app/_components/theme/ThemeToggle";
import type { ConversationSummary } from "@/app/actions/messages";

// ─── Mini avatar for conversation dropdown ────────────────────────────────────

function ConvAvatar({ conv }: { conv: ConversationSummary }) {
  const initials = conv.otherUserName
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
      {conv.otherUserAvatarUrl ? (
        <img
          src={conv.otherUserAvatarUrl}
          alt={conv.otherUserName}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className={cn(
            "w-full h-full flex items-center justify-center text-[11px] font-bold text-white",
            conv.otherUserType === "brand"
              ? "bg-gradient-to-br from-teal-600 to-cyan-600"
              : "bg-gradient-to-br from-violet-600 to-purple-600",
          )}
        >
          {initials}
        </div>
      )}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

const AuthenticatedHeader = () => {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const {
    unreadCount,
    recentConversations,
    isUnread,
    openChatWindow,
  } = useMessaging();

  const [showMsgDropdown, setShowMsgDropdown] = useState(false);
  const msgDropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!showMsgDropdown) return;
    const handler = (e: MouseEvent) => {
      if (
        msgDropdownRef.current &&
        !msgDropdownRef.current.contains(e.target as Node)
      ) {
        setShowMsgDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMsgDropdown]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };

  const dashboardPath =
    profile?.user_type === "brand" ? "/brand/dashboard" : "/creator/dashboard";
  const isBrand = profile?.user_type === "brand";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60 transition-colors duration-300">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href={dashboardPath} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-lg leading-none">D</span>
          </div>
          <span
            className="font-display font-bold text-xl tracking-tight"
            style={{
              background: "linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Duolync
          </span>
        </Link>

        {/* Role badge */}
        {profile && (
          <span
            className={cn(
              "hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border tracking-wide",
              isBrand
                ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25"
                : "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/25",
            )}
          >
            {isBrand ? "Brand Account" : "Creator Account"}
          </span>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* ── Messages icon + Facebook-style dropdown ── */}
          <div ref={msgDropdownRef} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowMsgDropdown((v) => !v)}
              title="Messages"
            >
              <MessageSquare className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center px-0.5 leading-none">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>

            {showMsgDropdown && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/30 z-50 overflow-hidden">
                {/* Dropdown header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <h3 className="font-semibold text-sm">Messages</h3>
                  <Link
                    href="/messages"
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                    onClick={() => setShowMsgDropdown(false)}
                  >
                    See all
                  </Link>
                </div>

                {recentConversations.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto divide-y divide-border/50">
                    {recentConversations.map((conv) => {
                      const unread = isUnread(conv.otherUserId);
                      return (
                        <button
                          key={conv.otherUserId}
                          onClick={() => {
                            openChatWindow({
                              id: conv.otherUserId,
                              full_name: conv.otherUserName,
                              avatar_url: conv.otherUserAvatarUrl,
                              user_type: conv.otherUserType,
                            });
                            setShowMsgDropdown(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                            unread
                              ? "bg-primary/5 hover:bg-primary/10"
                              : "hover:bg-muted/50",
                          )}
                        >
                          <ConvAvatar conv={conv} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span
                                className={cn(
                                  "text-[13px] truncate",
                                  unread
                                    ? "font-bold text-foreground"
                                    : "font-medium text-muted-foreground",
                                )}
                              >
                                {conv.otherUserName}
                              </span>
                              {unread && (
                                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                              )}
                            </div>
                            <p
                              className={cn(
                                "text-xs truncate",
                                unread ? "text-foreground" : "text-muted-foreground",
                              )}
                            >
                              {conv.lastMessage ?? "No messages yet"}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-10 px-4 text-center">
                    <MessageSquare className="w-8 h-8 text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No conversations yet
                    </p>
                    <Link
                      href="/messages"
                      className="mt-2 text-xs text-primary hover:text-primary/80 underline"
                      onClick={() => setShowMsgDropdown(false)}
                    >
                      Start a chat
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <ThemeToggle />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={profile?.avatar_url || undefined}
                    alt={profile?.full_name || ""}
                  />
                  <AvatarFallback className="gradient-primary text-white text-sm font-bold">
                    {profile?.full_name
                      ? profile.full_name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "D"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">
                  {profile?.full_name || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={
                    profile?.user_type === "brand"
                      ? "/brand/settings"
                      : "/creator/settings"
                  }
                >
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
