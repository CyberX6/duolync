"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export interface ConversationSummary {
  otherUserId: string;
  otherUserName: string;
  otherUserAvatarUrl: string | null;
  otherUserType: "brand" | "creator";
  lastMessage: string | null;
  lastMessageAt: string;
  /** senderId of the most-recent message — used by the client to detect unread threads. */
  lastMessageSenderId: string | null;
}

export interface DBMessage {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  senderRole: "brand" | "creator";
  senderName: string;
  senderAvatarUrl: string | null;
}

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function sendMessageAction(
  receiverId: string,
  text: string,
): Promise<{ error: string | null }> {
  const trimmed = text.trim();
  if (!trimmed) return { error: "Message cannot be empty" };

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  await db.message.create({
    data: { senderId: session.user.id, receiverId, text: trimmed },
  });

  return { error: null };
}

export async function getConversationsAction(): Promise<ConversationSummary[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  const currentUserId = session.user.id;

  const messages = await db.message.findMany({
    where: {
      OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
    },
    include: {
      sender: { select: { id: true, name: true, image: true, role: true } },
      receiver: { select: { id: true, name: true, image: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const seen = new Set<string>();
  const conversations: ConversationSummary[] = [];

  for (const msg of messages) {
    const other =
      msg.senderId === currentUserId ? msg.receiver : msg.sender;
    if (seen.has(other.id)) continue;
    seen.add(other.id);

    conversations.push({
      otherUserId: other.id,
      otherUserName: other.name ?? "User",
      otherUserAvatarUrl: other.image ?? null,
      otherUserType: ((other.role ?? "creator") as "brand" | "creator"),
      lastMessage: msg.text,
      lastMessageAt: msg.createdAt.toISOString(),
      lastMessageSenderId: msg.senderId,
    });
  }

  return conversations;
}

// ─── User search / preview ────────────────────────────────────────────────────

export interface UserPreview {
  id: string;
  name: string;
  avatarUrl: string | null;
  userType: "brand" | "creator";
}

export async function searchUsersAction(query: string): Promise<UserPreview[]> {
  if (query.trim().length < 2) return [];

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  const users = await db.user.findMany({
    where: {
      hasCompletedOnboarding: true,
      id: { not: session.user.id },
      OR: [
        { name: { contains: query.trim(), mode: "insensitive" } },
        { companyName: { contains: query.trim(), mode: "insensitive" } },
      ],
    },
    select: { id: true, name: true, image: true, role: true, companyName: true },
    take: 8,
  });

  return users.map((u) => ({
    id: u.id,
    name:
      (u.role === "brand" ? u.companyName : null) ?? u.name ?? "User",
    avatarUrl: u.image ?? null,
    userType: (u.role ?? "creator") as "brand" | "creator",
  }));
}

export async function getUserPreviewAction(
  userId: string,
): Promise<UserPreview | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, image: true, role: true, companyName: true },
  });

  if (!user) return null;

  return {
    id: user.id,
    name:
      (user.role === "brand" ? user.companyName : null) ?? user.name ?? "User",
    avatarUrl: user.image ?? null,
    userType: (user.role ?? "creator") as "brand" | "creator",
  };
}

// ─────────────────────────────────────────────────────────────────────────────

export async function getConversationAction(
  otherUserId: string,
): Promise<DBMessage[]> {
  const session = await requireSession();
  const currentUserId = session.user.id;

  const messages = await db.message.findMany({
    where: {
      OR: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    },
    include: {
      sender: { select: { id: true, name: true, image: true, role: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return messages.map((m) => ({
    id: m.id,
    text: m.text,
    senderId: m.senderId,
    receiverId: m.receiverId,
    createdAt: m.createdAt.toISOString(),
    senderRole: ((m.sender.role ?? "creator") as "brand" | "creator"),
    senderName: m.sender.name ?? "User",
    senderAvatarUrl: m.sender.image ?? null,
  }));
}
