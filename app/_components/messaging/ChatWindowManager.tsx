"use client";

/**
 * ChatWindowManager — renders all open floating chat windows anchored
 * to the bottom-right of the viewport. Sits above everything (z-[9999]).
 * Rendered once in _providers.tsx so it's always present regardless of route.
 */

import { cn } from "@/lib/utils";
import { useMessaging } from "./MessagingContext";
import ChatWindow from "./ChatWindow";

export default function ChatWindowManager() {
  const { chatWindows, closeChatWindow, toggleMinimize } = useMessaging();

  if (chatWindows.length === 0) return null;

  return (
    <div
      className="fixed bottom-0 right-4 flex items-end gap-2.5 z-[9999] pointer-events-none"
      aria-label="Active chat windows"
    >
      {chatWindows.map((w, i) => (
        <div
          key={w.userId}
          className={cn(
            "pointer-events-auto",
            // On mobile only the most-recently opened window is visible
            // (others would all claim full-screen, stacking unreadably).
            i < chatWindows.length - 1 ? "max-sm:hidden" : "",
          )}
        >
          <ChatWindow
            window={w}
            onClose={closeChatWindow}
            onMinimize={toggleMinimize}
          />
        </div>
      ))}
    </div>
  );
}
