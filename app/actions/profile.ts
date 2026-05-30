"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
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
      bio: true,
      niche: true,
      primaryPlatform: true,
      location: true,
      companyName: true,
      industry: true,
      website: true,
      brandAccountType: true,
      totalFollowers: true,
      avgEngagementRate: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    user_id: user.id,
    user_type: (user.role ?? "creator") as "brand" | "creator",
    email: user.email,
    full_name: user.name ?? null,
    avatar_url: user.image ?? null,
    bio: user.bio ?? null,
    brand_account_type: (user.brandAccountType ?? null) as
      | "company"
      | "personal"
      | null,
    company_name: user.companyName ?? null,
    industry: user.industry ?? null,
    website: user.website ?? null,
    niche: user.niche ?? null,
    primary_platform: (user.primaryPlatform ?? null) as FullProfile["primary_platform"],
    location: user.location ?? null,
    languages: ["English"],
    total_followers: user.totalFollowers,
    avg_engagement_rate: user.avgEngagementRate,
    hasCompletedOnboarding: user.hasCompletedOnboarding,
  };
}

export interface OnboardingData {
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

export async function completeOnboardingAction(
  data: OnboardingData,
): Promise<{ error: string | null }> {
  const session = await getSessionOrNull();
  if (!session) return { error: "Unauthorized" };

  await db.user.update({
    where: { id: session.user.id },
    data: {
      hasCompletedOnboarding: true,
      bio: data.bio ?? null,
      niche: data.niche ?? null,
      primaryPlatform: data.primaryPlatform ?? null,
      location: data.location ?? null,
      brandAccountType: data.brandAccountType ?? null,
      companyName: data.companyName ?? null,
      industry: data.industry ?? null,
      website: data.website ?? null,
    },
  });

  return { error: null };
}

export async function updateProfileAction(data: {
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

  await db.user.update({
    where: { id: session.user.id },
    data,
  });

  return { error: null };
}
