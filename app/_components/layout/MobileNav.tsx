"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X, Home, Search, MessageSquare, Heart, Sparkles,
  BarChart3, Link2, Compass, FileText, Users, Megaphone, Mail, Radio,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMessaging } from "@/app/_components/messaging/MessagingContext";
import { getPendingApplicationsCountAction } from "@/app/actions/brand-applications";
import { getPendingInvitationsCountAction } from "@/app/actions/invitations";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const MobileNav = ({ open, onClose }: MobileNavProps) => {
  const { profile } = useAuth();
  const { unreadCount } = useMessaging();
  const pathname = usePathname();
  const isBrand = profile?.user_type === "brand";
  const [pendingApplications, setPendingApplications] = useState(0);
  const [pendingInvitations, setPendingInvitations] = useState(0);

  useEffect(() => {
    if (isBrand) {
      getPendingApplicationsCountAction()
        .then((res) => setPendingApplications(res.count))
        .catch(() => {});
      return;
    }
    getPendingInvitationsCountAction()
      .then((res) => setPendingInvitations(res.count))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBrand]);

  useEffect(() => {
    if (!isBrand) return;
    getPendingApplicationsCountAction()
      .then((res) => setPendingApplications(res.count))
      .catch(() => setPendingApplications(0));
  }, [isBrand]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const mainNavItems = isBrand
    ? [
        { icon: Compass, label: "Feed", path: "/feed" },
        { icon: Home, label: "Dashboard", path: "/brand/dashboard" },
        { icon: Search, label: "Discover", path: "/brand/discover" },
        { icon: Sparkles, label: "Smart Match", path: "/brand/smart-match" },
        { icon: FileText, label: "Proposals", path: "/brand/proposals" },
        { icon: Megaphone, label: "Campaigns", path: "/brand/campaigns" },
        { icon: Heart, label: "Saved", path: "/brand/saved" },
        { icon: MessageSquare, label: "Messages", path: "/messages" },
        { icon: Users, label: "Community", path: "/community" },
      ]
    : [
        { icon: Compass, label: "Feed", path: "/feed" },
        { icon: Home, label: "Dashboard", path: "/creator/dashboard" },
        { icon: Search, label: "Discover", path: "/creator/discover" },
        { icon: Megaphone, label: "Campaigns", path: "/creator/campaigns" },
        { icon: FileText, label: "My Applications", path: "/creator/applications" },
        { icon: Mail, label: "Invitations", path: "/creator/invitations" },
        { icon: BarChart3, label: "Analytics", path: "/creator/analytics" },
        { icon: Link2, label: "Social Accounts", path: "/creator/accounts" },
        { icon: Heart, label: "Saved", path: "/creator/saved" },
        { icon: MessageSquare, label: "Messages", path: "/messages" },
        { icon: Users, label: "Community", path: "/community" },
      ];

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col lg:hidden shadow-2xl">
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-base leading-none">D</span>
            </div>
            <span
              className="font-display font-bold text-lg tracking-tight"
              style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Duolync
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role badge */}
        {profile && (
          <div className="px-4 pt-3 pb-1">
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border tracking-wide",
                isBrand
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/25"
                  : "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/25",
              )}
            >
              {isBrand ? "Brand Account" : "Creator Account"}
            </span>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
            const isMessages = item.label === "Messages";
            const isCampaigns = item.label === "Campaigns" && isBrand;
            const isInvitations = item.label === "Invitations" && !isBrand;
            const hasUnreadMsg = isMessages && unreadCount > 0;
            const hasPendingApps = isCampaigns && pendingApplications > 0;
            const hasPendingInvites = isInvitations && pendingInvitations > 0;
            const hasBadge = hasUnreadMsg || hasPendingApps || hasPendingInvites;
            const badgeCount = isMessages ? unreadCount : isCampaigns ? pendingApplications : pendingInvitations;
            const activeClass = isBrand
              ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/25 dark:border-cyan-500/20"
              : "gradient-primary text-white shadow-sm shadow-primary/30";
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-sm",
                  isActive
                    ? activeClass
                    : [
                        "hover:text-foreground hover:bg-secondary",
                        hasBadge ? "font-bold text-foreground" : "font-medium text-muted-foreground",
                      ],
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {hasBadge && !isActive && (
                  <span className="min-w-[18px] h-[18px] bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center px-1 leading-none shrink-0">
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info at bottom */}
        {profile && (
          <div className="px-4 py-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-secondary shrink-0">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                    {(profile.full_name ?? "U")[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{profile.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileNav;
