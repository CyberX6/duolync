import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Plus, Home, Search, MessageSquare, Heart, Sparkles, BarChart3, Link2, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface Group {
  id: string;
  name: string;
  member_count: number;
  cover_image_url: string | null;
}

const GroupsPanel = () => {
  const { profile } = useAuth();
  const pathname = usePathname();
  const [groups, setGroups] = useState<Group[]>([]);

  const isBrand = profile?.user_type === "brand";

  const mainNavItems = isBrand
    ? [
        { icon: Compass, label: "Feed", path: "/feed" },
        { icon: Home, label: "Dashboard", path: "/brand/dashboard" },
        { icon: Search, label: "Discover", path: "/brand/discover" },
        { icon: Sparkles, label: "Smart Match", path: "/brand/smart-match" },
        { icon: Heart, label: "Saved", path: "/brand/saved" },
        { icon: MessageSquare, label: "Messages", path: "/messages" },
        { icon: Users, label: "Community", path: "/community" },
      ]
    : [
        { icon: Compass, label: "Feed", path: "/feed" },
        { icon: Home, label: "Dashboard", path: "/creator/dashboard" },
        { icon: BarChart3, label: "Analytics", path: "/creator/analytics" },
        { icon: Link2, label: "Social Accounts", path: "/creator/accounts" },
        { icon: Heart, label: "Saved", path: "/creator/saved" },
        { icon: MessageSquare, label: "Messages", path: "/messages" },
        { icon: Users, label: "Community", path: "/community" },
      ];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card h-[calc(100vh-4rem)]">
      <ScrollArea className="flex-1 p-4">
        {/* Main Navigation */}
        <nav className="space-y-1 mb-6">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all text-sm",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Groups Section */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Groups
            </h3>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {groups.length > 0 ? (
            <div className="space-y-1">
              {groups.map((group) => (
                <Link
                  key={group.id}
                  href={`/groups/${group.id}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    {group.cover_image_url ? (
                      <img
                        src={group.cover_image_url}
                        alt={group.name}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    ) : (
                      <Users className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{group.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {group.member_count} members
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No groups yet</p>
              <Button variant="link" size="sm" className="text-primary">
                Create or join a group
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default GroupsPanel;
