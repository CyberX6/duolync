"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@/lib/generated/prisma";
import { headers } from "next/headers";

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export interface ProposalWithDetails {
  id: string;
  status: string;
  rate: number;
  coverLetter: string | null;
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

// Brand: get all proposals for their campaigns
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

  const proposals = await db.proposal.findMany({
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

  const data: ProposalWithDetails[] = proposals.map((p) => ({
    id: p.id,
    status: p.status,
    rate: p.rate,
    coverLetter: p.coverLetter,
    createdAt: p.createdAt.toISOString(),
    campaign: {
      id: p.campaign.id,
      title: p.campaign.title,
      budget: p.campaign.budget,
    },
    creator: {
      id: p.creator.id,
      userId: p.creator.userId,
      name: p.creator.user.name,
      avatarUrl: p.creator.user.image,
      niche: p.creator.niche,
      primaryPlatform: p.creator.primaryPlatform,
      totalFollowers: p.creator.totalFollowers,
    },
  }));

  return { data, error: null };
}

// Brand: approve or reject a proposal
export async function updateProposalStatusAction(
  proposalId: string,
  status: "ACCEPTED" | "REJECTED",
): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, brandProfile: { select: { id: true } } },
  });

  if (!user || user.role !== Role.BRAND || !user.brandProfile) {
    return { error: "Brand profile not found" };
  }

  // Verify this proposal belongs to this brand's campaign
  const proposal = await db.proposal.findFirst({
    where: {
      id: proposalId,
      campaign: { brandProfileId: user.brandProfile.id },
    },
    include: {
      creator: { select: { userId: true } },
      campaign: { select: { title: true } },
    },
  });

  if (!proposal) return { error: "Proposal not found" };

  await db.proposal.update({
    where: { id: proposalId },
    data: { status },
  });

  // Notify the creator
  const notifTitle =
    status === "ACCEPTED"
      ? `Your proposal for "${proposal.campaign.title}" was accepted!`
      : `Your proposal for "${proposal.campaign.title}" was not accepted.`;

  await db.notification.create({
    data: {
      userId: proposal.creator.userId,
      type: status === "ACCEPTED" ? "PROPOSAL_ACCEPTED" : "PROPOSAL_REJECTED",
      title: notifTitle,
      body:
        status === "ACCEPTED"
          ? "Congratulations! The brand wants to work with you."
          : "Don't give up — keep applying to other campaigns.",
      link: `/creator/dashboard`,
    },
  });

  return { error: null };
}

// Creator: send a proposal on a campaign
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

  // Check for duplicate
  const existing = await db.proposal.findFirst({
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

  const proposal = await db.proposal.create({
    data: {
      campaignId: input.campaignId,
      creatorProfileId: user.creatorProfile.id,
      rate: input.rate,
      coverLetter: input.coverLetter ?? null,
      status: "PENDING",
    },
  });

  // Notify the brand
  await db.notification.create({
    data: {
      userId: campaign.brand.user.id,
      type: "PROPOSAL_RECEIVED",
      title: `New proposal for "${campaign.title}"`,
      body: `${user.name ?? "A creator"} submitted a proposal at $${input.rate}.`,
      link: `/brand/proposals`,
    },
  });

  return { error: null, proposalId: proposal.id };
}
