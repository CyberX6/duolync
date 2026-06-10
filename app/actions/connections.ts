"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { ConnectionStatus } from "@/lib/generated/prisma";
import { revalidatePath } from "next/cache";

async function getCurrentUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.id ?? null;
}

/** Write a notification to a user's bell. Silently no-ops on failure. */
async function notify(userId: string, type: string, title: string, body: string, link: string) {
  try {
    await db.notification.create({ data: { userId, type, title, body, link } });
  } catch {
    // Notification failure must never break the main action
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type ConnectionStatusResult =
  | "none"
  | "pending_sent"
  | "pending_received"
  | "accepted"
  | "rejected";

export interface ConnectionInfo {
  status: ConnectionStatusResult;
  connectionId: string | null;
}

// ── Single status ─────────────────────────────────────────────────────────────

export async function getConnectionStatusAction(
  targetUserId: string,
): Promise<ConnectionInfo> {
  const userId = await getCurrentUserId();
  if (!userId) return { status: "none", connectionId: null };

  const conn = await db.connection.findFirst({
    where: {
      OR: [
        { senderId: userId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: userId },
      ],
    },
  });

  if (!conn) return { status: "none", connectionId: null };
  if (conn.status === ConnectionStatus.ACCEPTED)
    return { status: "accepted", connectionId: conn.id };
  if (conn.status === ConnectionStatus.REJECTED)
    return { status: "rejected", connectionId: conn.id };
  if (conn.senderId === userId)
    return { status: "pending_sent", connectionId: conn.id };
  return { status: "pending_received", connectionId: conn.id };
}

// ── Bulk status fetch (for Discover page, avoids N+1 fetches) ─────────────────

export async function getConnectionStatusesAction(
  targetUserIds: string[],
): Promise<Record<string, ConnectionInfo>> {
  const userId = await getCurrentUserId();
  const result: Record<string, ConnectionInfo> = {};
  for (const id of targetUserIds) result[id] = { status: "none", connectionId: null };
  if (!userId || targetUserIds.length === 0) return result;

  const connections = await db.connection.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId: { in: targetUserIds } },
        { senderId: { in: targetUserIds }, receiverId: userId },
      ],
    },
  });

  for (const conn of connections) {
    const otherId = conn.senderId === userId ? conn.receiverId : conn.senderId;
    let status: ConnectionStatusResult = "none";
    if (conn.status === ConnectionStatus.ACCEPTED) status = "accepted";
    else if (conn.status === ConnectionStatus.REJECTED) status = "rejected";
    else if (conn.senderId === userId) status = "pending_sent";
    else status = "pending_received";
    result[otherId] = { status, connectionId: conn.id };
  }

  return result;
}

// ── Send request ──────────────────────────────────────────────────────────────

export async function sendConnectionRequestAction(
  receiverId: string,
): Promise<{ error: string | null; connectionId: string | null }> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Unauthorized", connectionId: null };
  if (userId === receiverId)
    return { error: "Cannot connect to yourself", connectionId: null };

  // Guard: make sure the receiver is a real DB user (not a seed/demo profile)
  const receiverExists = await db.user.findUnique({
    where: { id: receiverId },
    select: { id: true },
  });
  if (!receiverExists) return { error: "This profile is a demo and cannot be connected to.", connectionId: null };

  const existing = await db.connection.findFirst({
    where: {
      OR: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    },
  });

  if (existing) {
    if (existing.status === ConnectionStatus.ACCEPTED)
      return { error: "Already connected", connectionId: existing.id };

    // ── Key fix: if WE sent it and it's PENDING, just return the id (no error) ──
    if (
      existing.status === ConnectionStatus.PENDING &&
      existing.senderId === userId
    ) {
      return { error: null, connectionId: existing.id };
    }

    // If the other person sent it and we hit Connect too, surface that state
    if (
      existing.status === ConnectionStatus.PENDING &&
      existing.receiverId === userId
    ) {
      return { error: null, connectionId: existing.id };
    }

    // Rejected — allow re-send
    const updated = await db.connection.update({
      where: { id: existing.id },
      data: { status: ConnectionStatus.PENDING, senderId: userId, receiverId },
    });

    // Notify receiver
    const sender = await db.user.findUnique({ where: { id: userId }, select: { name: true } });
    await notify(
      receiverId,
      "CONNECTION_REQUEST",
      `${sender?.name ?? "Someone"} wants to connect`,
      "You have a new connection request.",
      `/profile/${userId}`,
    );

    revalidatePath("/brand/discover");
    revalidatePath("/community");
    return { error: null, connectionId: updated.id };
  }

  const conn = await db.connection.create({
    data: { senderId: userId, receiverId, status: ConnectionStatus.PENDING },
  });

  // Notify receiver
  const sender = await db.user.findUnique({ where: { id: userId }, select: { name: true } });
  await notify(
    receiverId,
    "CONNECTION_REQUEST",
    `${sender?.name ?? "Someone"} wants to connect`,
    "You have a new connection request.",
    `/profile/${userId}`,
  );

  revalidatePath("/brand/discover");
  revalidatePath("/community");
  return { error: null, connectionId: conn.id };
}

// ── Accept ────────────────────────────────────────────────────────────────────

export async function acceptConnectionAction(
  connectionId: string,
): Promise<{ error: string | null }> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Unauthorized" };

  const conn = await db.connection.findFirst({
    where: { id: connectionId, receiverId: userId, status: ConnectionStatus.PENDING },
  });
  if (!conn) return { error: "Connection request not found" };

  await db.connection.update({
    where: { id: connectionId },
    data: { status: ConnectionStatus.ACCEPTED },
  });

  // Notify the original sender
  const receiver = await db.user.findUnique({ where: { id: userId }, select: { name: true } });
  await notify(
    conn.senderId,
    "CONNECTION_ACCEPTED",
    `${receiver?.name ?? "Someone"} accepted your request`,
    "You are now connected.",
    `/profile/${userId}`,
  );

  revalidatePath("/community");
  revalidatePath("/profile/[id]", "page");
  return { error: null };
}

// ── Reject ────────────────────────────────────────────────────────────────────

export async function rejectConnectionAction(
  connectionId: string,
): Promise<{ error: string | null }> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Unauthorized" };

  const conn = await db.connection.findFirst({
    where: { id: connectionId, receiverId: userId, status: ConnectionStatus.PENDING },
  });
  if (!conn) return { error: "Connection request not found" };

  await db.connection.update({
    where: { id: connectionId },
    data: { status: ConnectionStatus.REJECTED },
  });
  return { error: null };
}

// ── Withdraw (sender cancels pending request) ─────────────────────────────────

export async function withdrawConnectionAction(
  connectionId: string,
): Promise<{ error: string | null }> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Unauthorized" };

  await db.connection.deleteMany({
    where: { id: connectionId, senderId: userId },
  });
  revalidatePath("/brand/discover");
  return { error: null };
}

// ── Remove (either party removes accepted connection) ─────────────────────────

export async function removeConnectionAction(
  connectionId: string,
): Promise<{ error: string | null }> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Unauthorized" };

  await db.connection.deleteMany({
    where: {
      id: connectionId,
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
  });
  revalidatePath("/community");
  revalidatePath("/profile/[id]", "page");
  return { error: null };
}

// ── List connections ──────────────────────────────────────────────────────────

export interface ConnectionUser {
  userId: string;
  name: string;
  image: string | null;
  userType: string;
  connectionId: string;
}

export async function getConnectionsAction(): Promise<{
  connections: ConnectionUser[];
  pendingReceived: ConnectionUser[];
  pendingSent: ConnectionUser[];
  error: string | null;
}> {
  const userId = await getCurrentUserId();
  if (!userId)
    return { connections: [], pendingReceived: [], pendingSent: [], error: "Unauthorized" };

  const all = await db.connection.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
      status: { not: ConnectionStatus.REJECTED },
    },
    include: {
      sender: { select: { id: true, name: true, image: true, role: true } },
      receiver: { select: { id: true, name: true, image: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const toUser = (
    u: { id: string; name: string | null; image: string | null; role: string },
    connId: string,
  ): ConnectionUser => ({
    userId: u.id,
    name: u.name ?? "Unknown",
    image: u.image,
    userType: u.role.toLowerCase(),
    connectionId: connId,
  });

  const connections: ConnectionUser[] = [];
  const pendingReceived: ConnectionUser[] = [];
  const pendingSent: ConnectionUser[] = [];

  for (const conn of all) {
    const other = conn.senderId === userId ? conn.receiver : conn.sender;
    const user = toUser(
      other as { id: string; name: string | null; image: string | null; role: string },
      conn.id,
    );
    if (conn.status === ConnectionStatus.ACCEPTED) connections.push(user);
    else if (conn.status === ConnectionStatus.PENDING) {
      if (conn.senderId === userId) pendingSent.push(user);
      else pendingReceived.push(user);
    }
  }

  return { connections, pendingReceived, pendingSent, error: null };
}

export async function getConnectionCountAction(userId: string): Promise<number> {
  return db.connection.count({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
      status: ConnectionStatus.ACCEPTED,
    },
  });
}
