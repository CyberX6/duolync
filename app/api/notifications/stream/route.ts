import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { NotificationItem } from "@/app/actions/notifications";

// ── Force Node.js runtime so ReadableStream + setInterval work correctly ──────
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── DB helper (no "use server" — runs in Node.js API route context) ───────────

interface NotifPayload {
  notifications: NotificationItem[];
  unreadCount: number;
}

async function queryNotifications(userId: string): Promise<NotifPayload> {
  const rows = await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  const unreadCount = rows.filter((n) => !n.read).length;

  // Enrich CONNECTION_REQUEST rows with connectionId + senderAvatar
  const connReqRows = rows.filter((n) => n.type === "CONNECTION_REQUEST");
  const senderIds = connReqRows
    .map((n) => n.link?.replace("/profile/", ""))
    .filter((id): id is string => typeof id === "string" && id.length > 0);

  type ConnRow = { id: string; senderId: string };
  type UserRow = { id: string; image: string | null };
  let pendingConns: ConnRow[] = [];
  let senderUsers: UserRow[] = [];

  if (senderIds.length > 0) {
    [pendingConns, senderUsers] = await Promise.all([
      db.connection.findMany({
        where: { senderId: { in: senderIds }, receiverId: userId, status: "PENDING" },
        select: { id: true, senderId: true },
      }),
      db.user.findMany({
        where: { id: { in: senderIds } },
        select: { id: true, image: true },
      }),
    ]);
  }

  const connBySender = new Map(pendingConns.map((c) => [c.senderId, c.id]));
  const avatarBySender = new Map(senderUsers.map((u) => [u.id, u.image]));

  const notifications: NotificationItem[] = rows.map((n) => {
    const senderId = n.link?.replace("/profile/", "") ?? null;
    const isConn = n.type === "CONNECTION_REQUEST" && senderId;
    return {
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      read: n.read,
      link: n.link,
      createdAt: n.createdAt.toISOString(),
      connectionId: isConn ? (connBySender.get(senderId!) ?? null) : null,
      senderAvatar: isConn ? (avatarBySender.get(senderId!) ?? null) : null,
      senderUserId: isConn ? senderId : null,
    };
  });

  return { notifications, unreadCount };
}

// ── SSE helper ────────────────────────────────────────────────────────────────

function encode(event: string, data: unknown): Uint8Array {
  return new TextEncoder().encode(
    `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
  );
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  // Authenticate BEFORE entering the stream — headers() is request-scoped
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  // Snapshot to detect meaningful changes (avoids re-renders on identical data)
  let lastUnread = -1;
  let lastIds = "";

  const stream = new ReadableStream({
    async start(controller) {
      const push = (event: string, data: unknown) => {
        try {
          controller.enqueue(encode(event, data));
        } catch {
          // controller already closed
        }
      };

      // Retry directive — EventSource will reconnect after 5 s on drop
      controller.enqueue(new TextEncoder().encode("retry: 5000\n\n"));

      // ── Initial snapshot ────────────────────────────────────────────────
      try {
        const payload = await queryNotifications(userId);
        lastUnread = payload.unreadCount;
        lastIds = payload.notifications.map((n) => n.id).join(",");
        push("notifications", payload);
      } catch {
        controller.close();
        return;
      }

      // ── Poll every 10 s — only push when something changed ──────────────
      const interval = setInterval(async () => {
        try {
          const payload = await queryNotifications(userId);
          const newIds = payload.notifications.map((n) => n.id).join(",");

          if (payload.unreadCount !== lastUnread || newIds !== lastIds) {
            lastUnread = payload.unreadCount;
            lastIds = newIds;
            push("notifications", payload);
          } else {
            // Heartbeat to prevent proxy/load-balancer timeouts
            push("ping", { ts: Date.now() });
          }
        } catch {
          clearInterval(interval);
          controller.close();
        }
      }, 10_000);

      // ── Clean up when the client disconnects ────────────────────────────
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        try { controller.close(); } catch { /* already closed */ }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-store, no-transform",
      Connection: "keep-alive",
      // Disable Nginx/Vercel response buffering
      "X-Accel-Buffering": "no",
    },
  });
}
