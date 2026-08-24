"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  getNotificationsAction,
  type NotificationItem,
} from "@/app/actions/notifications";

interface StreamPayload {
  notifications: NotificationItem[];
  unreadCount: number;
}

interface UseNotificationStreamResult {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  /** Force an immediate re-fetch (e.g. after mark-as-read). */
  refetch: () => Promise<void>;
  /** Optimistically patch a single notification in local state. */
  patchNotification: (id: string, patch: Partial<NotificationItem>) => void;
  /** Optimistically mark every notification as read in local state. */
  markAllReadLocally: () => void;
}

export function useNotificationStream(): UseNotificationStreamResult {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const esRef = useRef<EventSource | null>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const applyPayload = useCallback((payload: StreamPayload) => {
    setNotifications(payload.notifications);
    setUnreadCount(payload.unreadCount);
    setLoading(false);
  }, []);

  const patchNotification = useCallback(
    (id: string, patch: Partial<NotificationItem>) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...patch } : n)),
      );
    },
    [],
  );

  const markAllReadLocally = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  // Force a fresh fetch (bypasses SSE cache; used after mark-as-read)
  const refetch = useCallback(async () => {
    const result = await getNotificationsAction();
    if (!result.error) {
      applyPayload({ notifications: result.data, unreadCount: result.unreadCount });
    }
  }, [applyPayload]);

  // ── EventSource lifecycle ─────────────────────────────────────────────────

  useEffect(() => {
    // EventSource is browser-only
    if (typeof window === "undefined") return;

    let es: EventSource;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      es = new EventSource("/api/notifications/stream");
      esRef.current = es;

      es.addEventListener("notifications", (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data as string) as StreamPayload;
          applyPayload(payload);
        } catch {
          // malformed JSON — ignore
        }
      });

      es.addEventListener("open", () => {
        setLoading(false);
      });

      es.addEventListener("error", () => {
        // EventSource auto-reconnects, but we guard against rapid loops
        es.close();
        esRef.current = null;
        reconnectTimer = setTimeout(connect, 5_000);
      });
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      esRef.current?.close();
      esRef.current = null;
    };
  }, [applyPayload]);

  return {
    notifications,
    unreadCount,
    loading,
    refetch,
    patchNotification,
    markAllReadLocally,
  };
}
