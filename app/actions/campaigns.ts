"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role, ConnectionStatus, CampaignStatus } from "@/lib/generated/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getBrandProfile() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, brandProfile: { select: { id: true } } },
  });
  if (!user || user.role !== Role.BRAND || !user.brandProfile) return null;
  return { userId: session.user.id, profileId: user.brandProfile.id };
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CampaignData {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  deadline: string | null;
  imageUrl: string | null;
  platforms: string[];
  contentFormats: string[];
  createdAt: string;
  updatedAt: string;
  proposalCount: number;
}

export interface ConnectedCreator {
  userId: string;
  name: string;
  avatarUrl: string | null;
  niche: string | null;
  primaryPlatform: string | null;
  totalFollowers: number;
}

// ── Actions ───────────────────────────────────────────────────────────────────

export async function getBrandCampaignsAction(): Promise<{
  data: CampaignData[];
  error: string | null;
}> {
  const brand = await getBrandProfile();
  if (!brand) return { data: [], error: "Unauthorized" };

  const campaigns = await db.campaign.findMany({
    where: { brandProfileId: brand.profileId },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  return {
    data: campaigns.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      budget: c.budget,
      status: c.status,
      deadline: c.deadline?.toISOString() ?? null,
      imageUrl: c.imageUrl ?? null,
      contentFormats: c.contentFormats ?? [],
      platforms: c.platforms ?? [],
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      proposalCount: c._count.applications,
    })),
    error: null,
  };
}

export async function createCampaignAction(input: {
  title: string;
  description: string;
  budget: number;
  status: string;
  deadline?: string | null;
  imageUrl?: string | null;
  platforms?: string[];
  contentFormats?: string[];
}): Promise<{ data: CampaignData | null; error: string | null }> {
  const brand = await getBrandProfile();
  if (!brand) return { data: null, error: "Unauthorized" };

  const title = input.title.trim();
  const description = input.description.trim();
  if (!title || title.length > 120) return { data: null, error: "Title must be 1–120 characters." };
  if (!description) return { data: null, error: "Description is required." };
  if (input.budget <= 0) return { data: null, error: "Budget must be positive." };
  const validStatuses = Object.values(CampaignStatus) as string[];
  if (!validStatuses.includes(input.status))
    return { data: null, error: "Invalid status." };

  const campaign = await db.campaign.create({
    data: {
      brandProfileId: brand.profileId,
      title,
      description,
      budget: input.budget,
      status: input.status as CampaignStatus,
      deadline: input.deadline ? new Date(input.deadline) : null,
      imageUrl: input.imageUrl ?? null,
      platforms: input.platforms ?? [],
      contentFormats: input.contentFormats ?? [],
    },
    include: { _count: { select: { applications: true } } },
  });

  revalidatePath("/brand/campaigns");
  return {
    data: {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      budget: campaign.budget,
      status: campaign.status,
      deadline: campaign.deadline?.toISOString() ?? null,
      imageUrl: campaign.imageUrl ?? null,
      platforms: campaign.platforms ?? [],
      contentFormats: campaign.contentFormats ?? [],
      createdAt: campaign.createdAt.toISOString(),
      updatedAt: campaign.updatedAt.toISOString(),
      proposalCount: campaign._count.applications,
    },
    error: null,
  };
}

export async function updateCampaignAction(
  campaignId: string,
  input: {
    title?: string;
    description?: string;
    budget?: number;
    status?: string;
    deadline?: string | null;
    imageUrl?: string | null;
    platforms?: string[];
    contentFormats?: string[];
  },
): Promise<{ data: CampaignData | null; error: string | null }> {
  const brand = await getBrandProfile();
  if (!brand) return { data: null, error: "Unauthorized" };

  const existing = await db.campaign.findFirst({
    where: { id: campaignId, brandProfileId: brand.profileId },
  });
  if (!existing) return { data: null, error: "Campaign not found." };

  const title = input.title?.trim();
  if (title !== undefined && (title.length === 0 || title.length > 120))
    return { data: null, error: "Title must be 1–120 characters." };
  if (input.budget !== undefined && input.budget <= 0)
    return { data: null, error: "Budget must be positive." };
  const validStatuses = Object.values(CampaignStatus) as string[];
  if (input.status && !validStatuses.includes(input.status))
    return { data: null, error: "Invalid status." };

  const updated = await db.campaign.update({
    where: { id: campaignId },
    data: {
      ...(title !== undefined && { title }),
      ...(input.description !== undefined && { description: input.description.trim() }),
      ...(input.budget !== undefined && { budget: input.budget }),
      ...(input.status !== undefined && { status: input.status as CampaignStatus }),
      ...(input.deadline !== undefined && {
        deadline: input.deadline ? new Date(input.deadline) : null,
      }),
      ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
      ...(input.platforms !== undefined && { platforms: input.platforms }),
      ...(input.contentFormats !== undefined && { contentFormats: input.contentFormats }),
    },
    include: { _count: { select: { applications: true } } },
  });

  revalidatePath("/brand/campaigns");
  return {
    data: {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      budget: updated.budget,
      status: updated.status,
      deadline: updated.deadline?.toISOString() ?? null,
      imageUrl: updated.imageUrl ?? null,
      platforms: updated.platforms ?? [],
      contentFormats: updated.contentFormats ?? [],
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      proposalCount: updated._count.applications,
    },
    error: null,
  };
}

export async function deleteCampaignAction(
  campaignId: string,
): Promise<{ error: string | null }> {
  const brand = await getBrandProfile();
  if (!brand) return { error: "Unauthorized" };

  const existing = await db.campaign.findFirst({
    where: { id: campaignId, brandProfileId: brand.profileId },
  });
  if (!existing) return { error: "Campaign not found." };

  await db.campaign.delete({ where: { id: campaignId } });
  revalidatePath("/brand/campaigns");
  return { error: null };
}

export interface BrandDashboardStats {
  activeCampaigns: number;
  savedCreators: number;
  activeConversations: number;
}

export async function getBrandDashboardStatsAction(): Promise<{
  data: BrandDashboardStats;
  error: string | null;
}> {
  const brand = await getBrandProfile();
  if (!brand) {
    return {
      data: { activeCampaigns: 0, savedCreators: 0, activeConversations: 0 },
      error: "Unauthorized",
    };
  }

  const [activeCampaigns, savedCreators, activeConversations] = await Promise.all([
    db.campaign.count({
      where: {
        brandProfileId: brand.profileId,
        status: CampaignStatus.ACTIVE,
      },
    }),
    db.cRMLead.count({
      where: { brandProfileId: brand.profileId },
    }),
    db.message.findMany({
      where: {
        OR: [{ senderId: brand.userId }, { receiverId: brand.userId }],
      },
      select: { senderId: true, receiverId: true },
      distinct: ["senderId", "receiverId"],
    }).then((rows) => {
      const partners = new Set<string>();
      for (const r of rows) {
        const other = r.senderId === brand.userId ? r.receiverId : r.senderId;
        partners.add(other);
      }
      return partners.size;
    }),
  ]);

  return {
    data: { activeCampaigns, savedCreators, activeConversations },
    error: null,
  };
}

export async function getCampaignConnectionsAction(): Promise<{
  data: ConnectedCreator[];
  error: string | null;
}> {
  const brand = await getBrandProfile();
  if (!brand) return { data: [], error: "Unauthorized" };

  const connections = await db.connection.findMany({
    where: {
      status: ConnectionStatus.ACCEPTED,
      OR: [
        { senderId: brand.userId },
        { receiverId: brand.userId },
      ],
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
          creatorProfile: {
            select: { niche: true, primaryPlatform: true, totalFollowers: true },
          },
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          image: true,
          creatorProfile: {
            select: { niche: true, primaryPlatform: true, totalFollowers: true },
          },
        },
      },
    },
  });

  const creators: ConnectedCreator[] = connections
    .map((conn) => {
      const other = conn.senderId === brand.userId ? conn.receiver : conn.sender;
      if (!other.creatorProfile) return null;
      return {
        userId: other.id,
        name: other.name ?? "Unknown",
        avatarUrl: other.image,
        niche: other.creatorProfile.niche,
        primaryPlatform: other.creatorProfile.primaryPlatform,
        totalFollowers: other.creatorProfile.totalFollowers,
      };
    })
    .filter((c): c is ConnectedCreator => c !== null);

  return { data: creators, error: null };
}
