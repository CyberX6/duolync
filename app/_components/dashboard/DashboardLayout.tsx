import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Search,
  MessageSquare,
  Heart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  BarChart3,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/app/_components/theme/ThemeToggle";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { profile, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isBrand = profile?.user_type === "brand";

  const brandNavItems = [
    { icon: Home, label: "Dashboard", path: "/brand/dashboard" },
    { icon: Search, label: "Discover", path: "/brand/discover" },
    { icon: Sparkles, label: "Smart Match", path: "/brand/smart-match" },
    { icon: Heart, label: "Saved", path: "/brand/saved" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: Users, label: "Community", path: "/community" },
  ];

  const creatorNavItems = [
    { icon: Home, label: "Dashboard", path: "/creator/dashboard" },
    { icon: BarChart3, label: "Analytics", path: "/creator/analytics" },
    { icon: Link2, label: "Social Accounts", path: "/creator/accounts" },
    { icon: Heart, label: "Saved", path: "/creator/saved" },
    { icon: MessageSquare, label: "Messages", path: "/messages" },
    { icon: Users, label: "Community", path: "/community" },
  ];

  const navItems = isBrand ? brandNavItems : creatorNavItems;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 transition-colors duration-300 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800/50 transform transition-transform duration-300 lg:transform-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800/50 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
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
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
                    isActive
                      ? isBrand
                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/25 dark:border-cyan-500/20"
                        : "bg-primary text-primary-foreground"
                      : "text-zinc-500 dark:text-muted-foreground hover:text-zinc-900 dark:hover:text-foreground hover:bg-zinc-100 dark:hover:bg-secondary"
                  )}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800/50">
            <div className="flex items-center justify-between px-4 mb-4">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                Appearance
              </span>
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-3 mb-4 px-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || ""}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                    {profile?.full_name
                      ? profile.full_name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                      : "D"}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{profile?.full_name || "User"}</div>
                <div className="text-xs text-muted-foreground capitalize">{profile?.user_type}</div>
              </div>
            </div>

            <div className="space-y-1">
              <Link
                href={isBrand ? "/brand/settings" : "/creator/settings"}
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Settings size={18} />
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut size={18} />
                Log out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800/50 px-4 py-3 flex items-center justify-between transition-colors duration-300">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <Menu size={24} />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
              <span className="text-white font-bold leading-none">D</span>
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
          </Link>
          <ThemeToggle />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
