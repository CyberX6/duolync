"use server";

import { db } from "@/lib/db";
import { Role } from "@/lib/generated/prisma";
import type { Creator } from "@/app/_components/discovery/ProfileDrawer";
import type { BrandProfile } from "@/app/_components/discovery/ProfilesContext";

export async function getCreatorsAction(): Promise<Creator[]> {
  const users = await db.user.findMany({
    where: {
      role: Role.CREATOR,
      hasCompletedOnboarding: true,
      creatorProfile: { isNot: null },
    },
    select: {
      id: true,
      name: true,
      image: true,
      creatorProfile: {
        select: {
          bio: true,
          niche: true,
          totalFollowers: true,
          avgEngagementRate: true,
          primaryPlatform: true,
          location: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return users.map((u) => {
    const profile = u.creatorProfile!;
    return {
      id: u.id,
      full_name: u.name ?? "Creator",
      avatar_url: u.image ?? null,
      bio: profile.bio ?? null,
      niche: profile.niche ?? null,
      total_followers: profile.totalFollowers,
      avg_engagement_rate: profile.avgEngagementRate,
      primary_platform: (profile.primaryPlatform ?? null) as Creator["primary_platform"],
      location: profile.location ?? null,
      languages: ["English"],
      verified: false,
      platforms: profile.primaryPlatform
        ? {
            [profile.primaryPlatform]:
              profile.totalFollowers > 0
                ? `${Math.round(profile.totalFollowers / 1000)}K`
                : "0",
          }
        : {},
    };
  });
}

export async function getBrandsAction(): Promise<BrandProfile[]> {
  const users = await db.user.findMany({
    where: {
      role: Role.BRAND,
      hasCompletedOnboarding: true,
      brandProfile: { isNot: null },
    },
    select: {
      id: true,
      name: true,
      image: true,
      brandProfile: {
        select: {
          bio: true,
          companyName: true,
          industry: true,
          website: true,
          brandAccountType: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return users.map((u) => {
    const profile = u.brandProfile!;
    return {
      id: u.id,
      company_name: profile.companyName ?? u.name ?? "Brand",
      full_name: u.name ?? "Brand",
      avatar_url: u.image ?? null,
      bio: profile.bio ?? null,
      industry: profile.industry ?? "Other",
      website: profile.website ?? null,
      brand_account_type: profile.brandAccountType ?? null,
      looking_for: profile.industry ? [profile.industry] : [],
    };
  });
}
