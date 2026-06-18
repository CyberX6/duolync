"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface SocialPostItem {
  id: string;
  platform: string;
  postUrl: string | null;
  imageUrl: string | null;
  caption: string | null;
  likes: number | null;
  comments: number | null;
  views: number | null;
  postedAt: string | null;
}

export async function getSocialPostsAction(): Promise<{
  data: SocialPostItem[];
  error: string | null;
}> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { data: [], error: "Unauthorized" };

  const creator = await db.creatorProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      socialPosts: {
        orderBy: { fetchedAt: "desc" },
        take: 9,
        select: {
          id: true,
          platform: true,
          postUrl: true,
          imageUrl: true,
          caption: true,
          likes: true,
          comments: true,
          views: true,
          postedAt: true,
        },
      },
    },
  });

  if (!creator) return { data: [], error: null };

  return {
    data: creator.socialPosts.map((p) => ({
      ...p,
      postedAt: p.postedAt?.toISOString() ?? null,
    })),
    error: null,
  };
}

export async function deletePostAction(postId: string): Promise<{ error: string | null }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const creator = await db.creatorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!creator) return { error: "Profile not found" };

  await db.socialPost.deleteMany({
    where: { id: postId, creatorProfileId: creator.id },
  });

  revalidatePath("/creator/presence");

  return { error: null };
}
