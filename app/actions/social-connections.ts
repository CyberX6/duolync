"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function removePlatformAction(
  platform: string,
): Promise<{ error: string | null }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { error: "Unauthorized" };

    const creatorProfile = await db.creatorProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true, connectedPlatforms: true },
    });
    if (!creatorProfile) return { error: "Profile not found" };

    // Remove PlatformStats rows for this platform
    await db.platformStats.deleteMany({
      where: { userId: session.user.id, platform },
    });

    // Remove SocialPosts for this platform
    await db.socialPost.deleteMany({
      where: { creatorProfileId: creatorProfile.id, platform },
    });

    // Remove from connectedPlatforms array
    const updated = creatorProfile.connectedPlatforms.filter((p) => p !== platform);

    // Re-aggregate total followers from remaining platforms
    const remaining = await db.platformStats.findMany({
      where: { userId: session.user.id },
      select: { followerCount: true, engagementRate: true },
    });
    const totalFollowers = remaining.reduce((sum, s) => sum + (s.followerCount ?? 0), 0);
    const avgEng =
      remaining.length > 0
        ? remaining.reduce((sum, s) => sum + (s.engagementRate ?? 0), 0) / remaining.length
        : 0;

    await db.creatorProfile.update({
      where: { userId: session.user.id },
      data: {
        connectedPlatforms: updated,
        followerCount: totalFollowers || null,
        averageEngagement: remaining.length > 0 ? parseFloat(avgEng.toFixed(2)) : null,
        lastSyncedAt: updated.length === 0 ? null : undefined,
      },
    });

    revalidatePath("/creator/presence");
    revalidatePath("/creator/dashboard");

    return { error: null };
  } catch (err) {
    console.error("[removePlatformAction]:", err);
    return { error: "Failed to remove platform" };
  }
}
