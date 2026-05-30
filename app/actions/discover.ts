"use server";

import { db } from "@/lib/db";
import type { Creator } from "@/app/_components/discovery/ProfileDrawer";
import type { BrandProfile } from "@/app/_components/discovery/ProfilesContext";

export async function getCreatorsAction(): Promise<Creator[]> {
  const users = await db.user.findMany({
    where: { role: "creator", hasCompletedOnboarding: true },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      niche: true,
      totalFollowers: true,
      avgEngagementRate: true,
      primaryPlatform: true,
      location: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return users.map((u) => ({
    id: u.id,
    full_name: u.name ?? "Creator",
    avatar_url: u.image ?? null,
    bio: u.bio ?? null,
    niche: u.niche ?? null,
    total_followers: u.totalFollowers,
    avg_engagement_rate: u.avgEngagementRate,
    primary_platform: (u.primaryPlatform ?? null) as Creator["primary_platform"],
    location: u.location ?? null,
    languages: ["English"],
    verified: false,
    platforms: u.primaryPlatform
      ? {
          [u.primaryPlatform]:
            u.totalFollowers > 0
              ? `${Math.round(u.totalFollowers / 1000)}K`
              : "0",
        }
      : {},
  }));
}

export async function getBrandsAction(): Promise<BrandProfile[]> {
  const users = await db.user.findMany({
    where: { role: "brand", hasCompletedOnboarding: true },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      companyName: true,
      industry: true,
      website: true,
      brandAccountType: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return users.map((u) => ({
    id: u.id,
    company_name: u.companyName ?? u.name ?? "Brand",
    full_name: u.name ?? "Brand",
    avatar_url: u.image ?? null,
    bio: u.bio ?? null,
    industry: u.industry ?? "Other",
    website: u.website ?? null,
    brand_account_type: u.brandAccountType ?? null,
    looking_for: u.industry ? [u.industry] : [],
  }));
}
