"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/app/_components/theme/ThemeContext";
import { ProfilesProvider } from "@/app/_components/discovery/ProfilesContext";
import { FavoritesProvider } from "@/app/_components/favorites/FavoritesContext";
import { MessagingProvider } from "@/app/_components/messaging/MessagingContext";
import ChatWindowManager from "@/app/_components/messaging/ChatWindowManager";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
