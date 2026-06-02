"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@/lib/generated/prisma";
import { fromPrismaRole } from "@/lib/roles";
import { headers } from "next/headers";

export interface FullProfile {
  id: string;
  user_id: string;
  user_type: "brand" | "creator";
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  brand_account_type: "company" | "personal" | null;
  company_name: string | null;
  industry: string | null;
  website: string | null;
  niche: string | null;
  primary_platform:
    | "youtube"
    | "tiktok"
    | "instagram"
    | "twitter"
    | "twitch"
    | "linkedin"
    | null;
  location: string | null;
  languages: string[];
  total_followers: number;
  avg_engagement_rate: number;
  hasCompletedOnboarding: boolean;
}

async function getSessionOrNull() {
  return auth.api.getSession({ headers: await headers() });
}

export async function getMyProfileAction(): Promise<FullProfile | null> {
  const session = await getSessionOrNull();
  if (!session) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      hasCompletedOnboarding: true,
      brandProfile: {
        select: {
          bio: true,
          companyName: true,
          industry: true,
          website: true,
          brandAccountType: true,
          location: true,
        },
      },
      creatorProfile: {
        select: {
          bio: true,
          niche: true,
          primaryPlatform: true,
          location: true,
          totalFollowers: true,
          avgEngagementRate: true,
        },
      },
    },
  });

  if (!user) return null;

  const userType = fromPrismaRole(user.role);
  const brand = user.brandProfile;
  const creator = user.creatorProfile;

  return {
    id: user.id,
    user_id: user.id,
    user_type: userType,
    email: user.email,
    full_name: user.name ?? null,
    avatar_url: user.image ?? null,
    bio: (userType === "brand" ? brand?.bio : creator?.bio) ?? null,
    brand_account_type: (brand?.brandAccountType ?? null) as
      | "company"
      | "personal"
      | null,
    company_name: brand?.companyName ?? null,
    industry: brand?.industry ?? null,
    website: brand?.website ?? null,
    niche: creator?.niche ?? null,
    primary_platform: (creator?.primaryPlatform ?? null) as FullProfile["primary_platform"],
    location: (userType === "brand" ? brand?.location : creator?.location) ?? null,
    languages: ["English"],
    total_followers: creator?.totalFollowers ?? 0,
    avg_engagement_rate: creator?.avgEngagementRate ?? 0,
    hasCompletedOnboarding: user.hasCompletedOnboarding,
  };
}

export interface OnboardingData {
  imageUrl?: string;
  // Creator
  niche?: string;
  primaryPlatform?: string;
  location?: string;
  // Brand
  brandAccountType?: string;
  companyName?: string;
  industry?: string;
  website?: string;
  // Shared
  bio?: string;
}

export async function updateAvatarAction(
  imageUrl: string | null,
): Promise<{ error: string | null }> {
  const session = await getSessionOrNull();
  if (!session) return { error: "Unauthorized" };

  await db.user.update({
    where: { id: session.user.id },
    data: { image: imageUrl },
  });

  return { error: null };
}

export async function updateProfileAction(data: {
  name?: string | null;
  bio?: string | null;
  niche?: string | null;
  primaryPlatform?: string | null;
  location?: string | null;
  companyName?: string | null;
  industry?: string | null;
  website?: string | null;
  brandAccountType?: string | null;
}): Promise<{ error: string | null }> {
  const session = await getSessionOrNull();
  if (!session) return { error: "Unauthorized" };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!user) return { error: "User not found" };

  if (data.name !== undefined) {
    await db.user.update({
      where: { id: session.user.id },
      data: { name: data.name ?? undefined },
    });
  }

  if (user.role === Role.BRAND) {
    await db.brandProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        companyName: data.companyName?.trim() || "Brand",
        industry: data.industry ?? null,
        website: data.website ?? null,
        brandAccountType: data.brandAccountType ?? null,
        bio: data.bio ?? null,
        location: data.location ?? null,
      },
      update: {
        ...(data.companyName !== undefined
          ? { companyName: data.companyName ?? "Brand" }
          : {}),
        ...(data.industry !== undefined ? { industry: data.industry } : {}),
        ...(data.website !== undefined ? { website: data.website } : {}),
        ...(data.brandAccountType !== undefined
          ? { brandAccountType: data.brandAccountType }
          : {}),
        ...(data.bio !== undefined ? { bio: data.bio } : {}),
        ...(data.location !== undefined ? { location: data.location } : {}),
      },
    });
  } else {
    await db.creatorProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        bio: data.bio ?? null,
        niche: data.niche ?? null,
        primaryPlatform: data.primaryPlatform ?? null,
        location: data.location ?? null,
      },
      update: {
        ...(data.bio !== undefined ? { bio: data.bio } : {}),
        ...(data.niche !== undefined ? { niche: data.niche } : {}),
        ...(data.primaryPlatform !== undefined
          ? { primaryPlatform: data.primaryPlatform }
          : {}),
        ...(data.location !== undefined ? { location: data.location } : {}),
      },
    });
  }

  return { error: null };
}
