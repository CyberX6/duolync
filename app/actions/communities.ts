"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@/lib/generated/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function getBrandProfile() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, brandProfile: { select: { id: true } } },
  });
  if (!user || user.role !== Role.BRAND || !user.brandProfile) return null;
  return user.brandProfile;
}

export interface CommunityListWithCount {
  id: string;
  name: string;
  createdAt: string;
  memberCount: number;
  memberUserIds: string[];
}

export async function getCommunityListsAction(): Promise<{
  data: CommunityListWithCount[];
  error: string | null;
}> {
  const brand = await getBrandProfile();
  if (!brand) return { data: [], error: "Unauthorized" };

  const lists = await db.communityList.findMany({
    where: { brandProfileId: brand.id },
    include: { members: { select: { creatorUserId: true } } },
    orderBy: { createdAt: "asc" },
  });

  return {
    data: lists.map((l) => ({
      id: l.id,
      name: l.name,
      createdAt: l.createdAt.toISOString(),
      memberCount: l.members.length,
      memberUserIds: l.members.map((m) => m.creatorUserId),
    })),
    error: null,
  };
}

export async function createCommunityListAction(
  name: string,
): Promise<{ data: CommunityListWithCount | null; error: string | null }> {
  const brand = await getBrandProfile();
  if (!brand) return { data: null, error: "Unauthorized" };

  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 60)
    return { data: null, error: "List name must be 1–60 characters" };

  const list = await db.communityList.create({
    data: { brandProfileId: brand.id, name: trimmed },
    include: { members: { select: { creatorUserId: true } } },
  });

  return {
    data: {
      id: list.id,
      name: list.name,
      createdAt: list.createdAt.toISOString(),
      memberCount: 0,
      memberUserIds: [],
    },
    error: null,
  };
}

export async function deleteCommunityListAction(
  listId: string,
): Promise<{ error: string | null }> {
  const brand = await getBrandProfile();
  if (!brand) return { error: "Unauthorized" };

  const list = await db.communityList.findFirst({
    where: { id: listId, brandProfileId: brand.id },
  });
  if (!list) return { error: "List not found" };

  await db.communityList.delete({ where: { id: listId } });
  revalidatePath("/community");
  return { error: null };
}

export async function addCreatorToListAction(
  listId: string,
  creatorUserId: string,
): Promise<{ error: string | null }> {
  const brand = await getBrandProfile();
  if (!brand) return { error: "Unauthorized" };

  const list = await db.communityList.findFirst({
    where: { id: listId, brandProfileId: brand.id },
  });
  if (!list) return { error: "List not found" };

  await db.communityListMember.upsert({
    where: { listId_creatorUserId: { listId, creatorUserId } },
    create: { listId, creatorUserId },
    update: {},
  });
  revalidatePath("/community");
  revalidatePath("/brand/discover");
  return { error: null };
}

export async function removeCreatorFromListAction(
  listId: string,
  creatorUserId: string,
): Promise<{ error: string | null }> {
  const brand = await getBrandProfile();
  if (!brand) return { error: "Unauthorized" };

  const list = await db.communityList.findFirst({
    where: { id: listId, brandProfileId: brand.id },
  });
  if (!list) return { error: "List not found" };

  await db.communityListMember.deleteMany({
    where: { listId, creatorUserId },
  });
  revalidatePath("/community");
  revalidatePath("/brand/discover");
  return { error: null };
}
