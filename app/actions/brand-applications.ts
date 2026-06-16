"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role, ApplicationStatus } from "@/lib/generated/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// ── Auth helper ───────────────────────────────────────────────────────────────

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

export interface ApplicationDetail {
  id: string;
  status: string;
  proposedRate: number;
  negotiatedRate: number | null;
  contentFormats: string[];
  brandNote: string | null;
  coverLetter: string | null;
  createdAt: string;
  updatedAt: string;
  creator: {
    profileId: string;
    userId: string;
    name: string | null;
    avatarUrl: string | null;
    niche: string | null;
    primaryPlatform: string | null;
    totalFollowers: number;
    bio: string | null;
  };
}

export interface CampaignDetailData {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  deadline: string | null;
  imageUrl: string | null;
  platforms: string[];
  contentFormats: string[];
  requirements: string | null;
  createdAt: string;
  applications: ApplicationDetail[];
  stats: {
    total: number;
    pending: number;
    underReview: number;
    accepted: number;
    rejected: number;
  };
}

// ── Actions ───────────────────────────────────────────────────────────────────

export async function getCampaignDetailAction(campaignId: string): Promise<{
  data: CampaignDetailData | null;
  error: string | null;
}> {
  try {
    const brand = await getBrandProfile();
    if (!brand) return { data: null, error: "Unauthorized" };

    const campaign = await db.campaign.findFirst({
      where: { id: campaignId, brandProfileId: brand.profileId },
      include: {
        applications: {
          include: {
            creator: {
              include: {
                user: { select: { id: true, name: true, image: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!campaign) return { data: null, error: "Campaign not found." };

    const applications: ApplicationDetail[] = campaign.applications.map((a) => ({
      id: a.id,
      status: a.status,
      proposedRate: a.proposedRate,
      negotiatedRate: a.negotiatedRate,
      contentFormats: a.contentFormats ?? [],
      brandNote: a.brandNote,
      coverLetter: a.coverLetter,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
      creator: {
        profileId: a.creator.id,
        userId: a.creator.userId,
        name: a.creator.user.name,
        avatarUrl: a.creator.user.image,
        niche: a.creator.niche,
        primaryPlatform: a.creator.primaryPlatform,
        totalFollowers: a.creator.totalFollowers,
        bio: a.creator.bio,
      },
    }));

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
        requirements: campaign.requirements,
        createdAt: campaign.createdAt.toISOString(),
        applications,
        stats: {
          total: applications.length,
          pending: applications.filter((a) => a.status === "PENDING").length,
          underReview: applications.filter((a) => a.status === "UNDER_REVIEW").length,
          accepted: applications.filter((a) => a.status === "ACCEPTED").length,
          rejected: applications.filter((a) => a.status === "REJECTED").length,
        },
      },
      error: null,
    };
  } catch (err) {
    console.error("getCampaignDetailAction:", err);
    return { data: null, error: "Failed to load campaign. Please try again." };
  }
}

export async function updateApplicationAction(
  applicationId: string,
  input: {
    status: "PENDING" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";
    negotiatedRate?: number | null;
    contentFormats?: string[];
    brandNote?: string | null;
  },
): Promise<{ error: string | null }> {
  try {
    const brand = await getBrandProfile();
    if (!brand) return { error: "Unauthorized" };

    const application = await db.application.findFirst({
      where: {
        id: applicationId,
        campaign: { brandProfileId: brand.profileId },
      },
      include: {
        creator: { select: { userId: true } },
        campaign: { select: { id: true, title: true } },
      },
    });

    if (!application) return { error: "Application not found." };

    await db.application.update({
      where: { id: applicationId },
      data: {
        status: input.status as ApplicationStatus,
        ...(input.negotiatedRate !== undefined && { negotiatedRate: input.negotiatedRate }),
        ...(input.contentFormats !== undefined && { contentFormats: input.contentFormats }),
        ...(input.brandNote !== undefined && { brandNote: input.brandNote }),
      },
    });

    // Notify creator only on meaningful status changes
    if (input.status === "ACCEPTED" || input.status === "REJECTED" || input.status === "UNDER_REVIEW") {
      const notifMap = {
        ACCEPTED: {
          title: `Your application for "${application.campaign.title}" was accepted! 🎉`,
          body: "Congratulations! The brand wants to work with you.",
        },
        REJECTED: {
          title: `Your application for "${application.campaign.title}" was not selected.`,
          body: "Don't give up — keep applying to other campaigns.",
        },
        UNDER_REVIEW: {
          title: `Your application for "${application.campaign.title}" is under review.`,
          body: "The brand is reviewing your application.",
        },
      };
      const notif = notifMap[input.status as keyof typeof notifMap];
      if (notif) {
        await db.notification.create({
          data: {
            userId: application.creator.userId,
            type: "APPLICATION_UPDATE",
            title: notif.title,
            body: notif.body,
            link: `/creator/applications`,
          },
        });
      }
    }

    revalidatePath(`/brand/campaigns/${application.campaign.id}`);
    revalidatePath("/brand/proposals");
    return { error: null };
  } catch (err) {
    console.error("updateApplicationAction:", err);
    return { error: "Failed to update application. Please try again." };
  }
}

export async function getPendingApplicationsCountAction(): Promise<{
  count: number;
  error: string | null;
}> {
  const brand = await getBrandProfile();
  if (!brand) return { count: 0, error: null };

  const count = await db.application.count({
    where: {
      campaign: { brandProfileId: brand.profileId },
      status: ApplicationStatus.PENDING,
    },
  });

  return { count, error: null };
}
