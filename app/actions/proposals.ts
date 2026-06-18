"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role, ApplicationStatus } from "@/lib/generated/prisma";
import { headers } from "next/headers";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export interface ProposalWithDetails {
  id: string;
  status: string;
  rate: number;
  coverLetter: string | null;
  selectedPlatform: string | null;
  brandNote: string | null;
  createdAt: string;
  campaign: {
    id: string;
    title: string;
    budget: number;
  };
  creator: {
    id: string;
    userId: string;
    name: string | null;
    avatarUrl: string | null;
    niche: string | null;
    primaryPlatform: string | null;
    totalFollowers: number;
  };
}

// Brand: get all applications for their campaigns
export async function getProposalsAction(): Promise<{
  data: ProposalWithDetails[];
  error: string | null;
}> {
  const session = await getSession();
  if (!session) return { data: [], error: "Unauthorized" };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, brandProfile: { select: { id: true } } },
  });

  if (!user || user.role !== Role.BRAND || !user.brandProfile) {
    return { data: [], error: "Brand profile not found" };
  }

  const applications = await db.application.findMany({
    where: {
      campaign: { brandProfileId: user.brandProfile.id },
    },
    include: {
      campaign: { select: { id: true, title: true, budget: true } },
      creator: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const data: ProposalWithDetails[] = applications.map((a) => ({
    id: a.id,
    status: a.status,
    rate: a.proposedRate,
    coverLetter: a.coverLetter,
    selectedPlatform: a.selectedPlatform ?? null,
    brandNote: a.brandNote ?? null,
    createdAt: a.createdAt.toISOString(),
    campaign: {
      id: a.campaign.id,
      title: a.campaign.title,
      budget: a.campaign.budget,
    },
    creator: {
      id: a.creator.id,
      userId: a.creator.userId,
      name: a.creator.user.name,
      avatarUrl: a.creator.user.image,
      niche: a.creator.niche,
      primaryPlatform: a.creator.primaryPlatform,
      totalFollowers: a.creator.totalFollowers,
    },
  }));

  return { data, error: null };
}

// Brand: approve or reject an application
export async function updateProposalStatusAction(
  proposalId: string,
  status: "ACCEPTED" | "REJECTED",
  rejectionReason?: string,
): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
      name: true,
      brandProfile: { select: { id: true, companyName: true } },
    },
  });

  if (!user || user.role !== Role.BRAND || !user.brandProfile) {
    return { error: "Brand profile not found" };
  }

  const application = await db.application.findFirst({
    where: {
      id: proposalId,
      campaign: { brandProfileId: user.brandProfile.id },
    },
    include: {
      creator: { select: { userId: true } },
      campaign: { select: { title: true, id: true } },
    },
  });

  if (!application) return { error: "Application not found" };

  const reason = rejectionReason?.trim() || null;

  await db.application.update({
    where: { id: proposalId },
    data: {
      status: status === "ACCEPTED" ? ApplicationStatus.ACCEPTED : ApplicationStatus.REJECTED,
      ...(status === "REJECTED" && reason ? { brandNote: reason } : {}),
    },
  });

  const brandName = user.brandProfile.companyName ?? user.name ?? "The brand";
  const notifType = status === "ACCEPTED" ? "PROPOSAL_ACCEPTED" : "PROPOSAL_REJECTED";
  const notifTitle =
    status === "ACCEPTED"
      ? `Your proposal for "${application.campaign.title}" was accepted! 🎉`
      : `Your proposal for "${application.campaign.title}" was not accepted.`;
  const notifBody =
    status === "ACCEPTED"
      ? `${brandName} wants to work with you. Check your applications to get started.`
      : reason
        ? `${brandName} left a note: "${reason}"`
        : "Don't give up — keep applying to other campaigns.";

  await db.notification.create({
    data: {
      userId: application.creator.userId,
      type: notifType,
      title: notifTitle,
      body: notifBody,
      link: `/creator/applications`,
    },
  });

  return { error: null };
}

// Brand: active collaborations (accepted proposals) for dashboard widget
export interface ActiveCollaboration {
  proposalId: string;
  campaignId: string;
  campaignTitle: string;
  rate: number;
  selectedPlatform: string | null;
  acceptedAt: string;
  creator: {
    userId: string;
    name: string | null;
    avatarUrl: string | null;
    niche: string | null;
    primaryPlatform: string | null;
  };
}

export async function getActiveCollaborationsAction(): Promise<{
  data: ActiveCollaboration[];
  error: string | null;
}> {
  const session = await getSession();
  if (!session) return { data: [], error: "Unauthorized" };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, brandProfile: { select: { id: true } } },
  });

  if (!user || user.role !== Role.BRAND || !user.brandProfile) {
    return { data: [], error: "Brand profile not found" };
  }

  const accepted = await db.application.findMany({
    where: {
      status: ApplicationStatus.ACCEPTED,
      campaign: { brandProfileId: user.brandProfile.id },
    },
    include: {
      campaign: { select: { id: true, title: true } },
      creator: {
        include: { user: { select: { id: true, name: true, image: true } } },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  return {
    data: accepted.map((a) => ({
      proposalId: a.id,
      campaignId: a.campaign.id,
      campaignTitle: a.campaign.title,
      rate: a.proposedRate,
      selectedPlatform: a.selectedPlatform ?? null,
      acceptedAt: a.updatedAt.toISOString(),
      creator: {
        userId: a.creator.userId,
        name: a.creator.user.name,
        avatarUrl: a.creator.user.image,
        niche: a.creator.niche,
        primaryPlatform: a.creator.primaryPlatform,
      },
    })),
    error: null,
  };
}

// Creator: submit an application for a campaign
export async function sendProposalAction(input: {
  campaignId: string;
  rate: number;
  coverLetter?: string;
}): Promise<{ error: string | null; proposalId?: string }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true, creatorProfile: { select: { id: true } } },
  });

  if (!user || user.role !== Role.CREATOR || !user.creatorProfile) {
    return { error: "Creator profile not found" };
  }

  const existing = await db.application.findFirst({
    where: {
      campaignId: input.campaignId,
      creatorProfileId: user.creatorProfile.id,
    },
  });
  if (existing) return { error: "You have already applied to this campaign" };

  const campaign = await db.campaign.findUnique({
    where: { id: input.campaignId },
    include: { brand: { include: { user: { select: { id: true } } } } },
  });
  if (!campaign) return { error: "Campaign not found" };

  const application = await db.application.create({
    data: {
      campaignId: input.campaignId,
      creatorProfileId: user.creatorProfile.id,
      proposedRate: input.rate,
      coverLetter: input.coverLetter ?? null,
      status: ApplicationStatus.PENDING,
    },
  });

  await db.notification.create({
    data: {
      userId: campaign.brand.user.id,
      type: "PROPOSAL_RECEIVED",
      title: `New proposal for "${campaign.title}"`,
      body: `${user.name ?? "A creator"} submitted a proposal at $${input.rate}.`,
      link: `/brand/proposals`,
    },
  });

  return { error: null, proposalId: application.id };
}
