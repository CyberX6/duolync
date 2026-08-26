"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string | null;
  read: boolean;
  link: string | null;
  createdAt: string;
  // Populated for CONNECTION_REQUEST type so the bell can render Accept/Ignore
  connectionId: string | null;
  senderAvatar: string | null;
  senderUserId: string | null;
}

export async function getNotificationsAction(): Promise<{
  data: NotificationItem[];
  unreadCount: number;
  error: string | null;
}> {
  try {
    const session = await getSession();
    if (!session) return { data: [], unreadCount: 0, error: "Unauthorized" };

    const notifications = await db.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 15,
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    // ── Enrich CONNECTION_REQUEST notifications ───────────────────────────────
    // Extract senderIds from links like "/profile/<userId>"
    const connReqNotifs = notifications.filter((n) => n.type === "CONNECTION_REQUEST");
    const senderIds = connReqNotifs
      .map((n) => n.link?.replace("/profile/", ""))
      .filter((id): id is string => typeof id === "string" && id.length > 0);

    type ConnRow = { id: string; senderId: string };
    type UserRow = { id: string; image: string | null };

    // Single parallel fetch: pending connections + sender avatars
    let pendingConns: ConnRow[] = [];
    let senderUsers: UserRow[] = [];

    if (senderIds.length > 0) {
      [pendingConns, senderUsers] = await Promise.all([
        db.connection.findMany({
          where: {
            senderId: { in: senderIds },
            receiverId: session.user.id,
            status: "PENDING",
          },
          select: { id: true, senderId: true },
        }),
        db.user.findMany({
          where: { id: { in: senderIds } },
          select: { id: true, image: true },
        }),
      ]);
    }

    const connBySender = new Map<string, string>(
      pendingConns.map((c) => [c.senderId, c.id]),
    );
    const avatarBySender = new Map<string, string | null>(
      senderUsers.map((u) => [u.id, u.image]),
    );

    return {
      data: notifications.map((n) => {
        const senderId = n.link?.replace("/profile/", "") ?? null;
        const isConnReq = n.type === "CONNECTION_REQUEST" && senderId;
        return {
          id: n.id,
          type: n.type,
          title: n.title,
          body: n.body,
          read: n.read,
          link: n.link,
          createdAt: n.createdAt.toISOString(),
          connectionId: isConnReq ? (connBySender.get(senderId!) ?? null) : null,
          senderAvatar: isConnReq ? (avatarBySender.get(senderId!) ?? null) : null,
          senderUserId: isConnReq ? senderId : null,
        };
      }),
      unreadCount,
      error: null,
    };
  } catch (err) {
    console.error("[getNotificationsAction]:", err);
    return { data: [], unreadCount: 0, error: "Failed to load notifications" };
  }
}

export async function markNotificationsReadAction(
  ids?: string[],
): Promise<{ error: string | null }> {
  try {
    const session = await getSession();
    if (!session) return { error: "Unauthorized" };

    if (ids && ids.length > 0) {
      await db.notification.updateMany({
        where: { id: { in: ids }, userId: session.user.id },
        data: { read: true },
      });
    } else {
      await db.notification.updateMany({
        where: { userId: session.user.id, read: false },
        data: { read: true },
      });
    }

    return { error: null };
  } catch (err) {
    console.error("[markNotificationsReadAction]:", err);
    return { error: "Failed to mark notifications as read" };
  }
}
