"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/app/_components/theme/ThemeContext";
import { ProfilesProvider } from "@/app/_components/discovery/ProfilesContext";
import { FavoritesProvider } from "@/app/_components/favorites/FavoritesContext";
import { MessagingProvider } from "@/app/_components/messaging/MessagingContext";
import ChatWindowManager from "@/app/_components/messaging/ChatWindowManager";
import { AuthHoldScreen } from "@/app/_components/auth/AuthHoldScreen";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Do not hydrate the auth/session tree on the server. Better Auth's
  // useSession plus session-gated UI produce a different hook path on the
  // first client pass (React #310) if this tree SSR's and then remounts.
  if (!mounted) {
    return <AuthHoldScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <TooltipProvider>
            <ThemeProvider>
              {/* Feature contexts — nested inside AuthProvider so they can call useAuth() */}
              <ProfilesProvider>
                <FavoritesProvider>
                  <MessagingProvider>
                    <Toaster />
                    <Sonner />
                    {children}
                    {/* Global floating chat windows — rendered outside page content */}
                    <ChatWindowManager />
                  </MessagingProvider>
                </FavoritesProvider>
              </ProfilesProvider>
            </ThemeProvider>
          </TooltipProvider>
        </AuthProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}
