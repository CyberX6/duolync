"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Role,
  ApplicationStatus,
  CampaignEventType,
  CampaignEventStatus,
  ContractStatus,
  EventUpdateStatus,
} from "@/lib/generated/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CalendarPartnerData {
  userId: string;
  name: string;
  image: string | null;
  role: "BRAND" | "CREATOR";
  companyName?: string | null;
  niche?: string | null;
  totalFollowers?: number | null;
}

export interface EventUpdateData {
  id: string;
  status: string;
  title: string | null;
  platform: string | null;
  scheduledAt: string | null;
  createdAt: string;
  requestedBy: CalendarPartnerData;
}

export interface CalendarEventData {
  id: string;
  campaignId: string;
  campaignTitle: string;
  title: string | null;
  type: string;
  platform: string | null;
  scheduledAt: string;
  status: string;
  isSynthetic?: boolean;
  creatorProfileId?: string | null;
  partner?: CalendarPartnerData | null;
  hasPendingUpdate?: boolean;
}

export interface CalendarEventDetailData extends CalendarEventData {
  pendingUpdate: EventUpdateData | null;
  updateHistory: EventUpdateData[];
  createdBy: CalendarPartnerData;
  campaignImageUrl: string | null;
}

export interface CreateEventInput {
  campaignId: string;
  type: "POST" | "STORY" | "MEETING";
  platform?: string;
  title?: string;
  scheduledAt: string;
  status?: string;
  creatorProfileId?: string;
}

export interface RequestEventUpdateInput {
  eventId: string;
  title?: string;
  platform?: string;
  scheduledAt?: string;
}

// ── Auth helpers ──────────────────────────────────────────────────────────────

type SessionUser = {
  id: string;
  role: Role;
  brandProfile: { id: string } | null;
  creatorProfile: { id: string } | null;
};

async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      role: true,
      brandProfile: { select: { id: true } },
      creatorProfile: { select: { id: true } },
    },
  });
  if (!user) return null;
  return user;
}

const eventInclude = {
  campaign: {
    select: {
      title: true,
      deadline: true,
      brandProfileId: true,
      imageUrl: true,
      brand: {
        select: {
          companyName: true,
          user: { select: { id: true, name: true, image: true, role: true } },
        },
      },
    },
  },
  creator: {
    select: {
      id: true,
      niche: true,
      totalFollowers: true,
      user: { select: { id: true, name: true, image: true, role: true } },
    },
  },
  createdBy: { select: { id: true, name: true, image: true, role: true } },
  updates: {
    where: { status: EventUpdateStatus.PENDING },
    take: 1,
    orderBy: { createdAt: "desc" as const },
    select: { id: true },
  },
} as const;

type RawEvent = {
  id: string;
  campaignId: string;
  creatorProfileId: string | null;
  title: string | null;
  type: CampaignEventType;
  platform: string | null;
  scheduledAt: Date;
  status: CampaignEventStatus;
  campaign: {
    title: string;
    imageUrl: string | null;
    brand: {
      companyName: string;
      user: { id: string; name: string | null; image: string | null; role: Role };
    };
  };
  creator: {
    id: string;
    niche: string | null;
    totalFollowers: number;
    user: { id: string; name: string | null; image: string | null; role: Role };
  } | null;
  createdBy: { id: string; name: string | null; image: string | null; role: Role };
  updates: { id: string }[];
};

function mapPartner(
  user: { id: string; name: string | null; image: string | null; role: Role },
  companyName?: string | null,
  niche?: string | null,
  totalFollowers?: number | null,
): CalendarPartnerData {
  return {
    userId: user.id,
    name: user.name ?? "User",
    image: user.image,
    role: user.role,
    companyName: companyName ?? null,
    niche: niche ?? null,
    totalFollowers: totalFollowers ?? null,
  };
}

function resolvePartner(event: RawEvent, viewerUserId: string): CalendarPartnerData | null {
  const brandUser = event.campaign.brand.user;
  const creator = event.creator;
  const creatorUser = creator?.user;

  if (viewerUserId === brandUser.id && creatorUser) {
    return mapPartner(creatorUser, null, creator?.niche, creator?.totalFollowers);
  }
  if (creatorUser && viewerUserId === creatorUser.id) {
    return mapPartner(brandUser, event.campaign.brand.companyName);
  }
  if (viewerUserId === brandUser.id) {
    return creatorUser ? mapPartner(creatorUser, null, creator?.niche, creator?.totalFollowers) : null;
  }
  return mapPartner(brandUser, event.campaign.brand.companyName);
}

function mapEvent(event: RawEvent, viewerUserId: string, isSynthetic = false): CalendarEventData {
  return {
    id: event.id,
    campaignId: event.campaignId,
    campaignTitle: event.campaign.title,
    title: event.title,
    type: event.type,
    platform: event.platform,
    scheduledAt: event.scheduledAt.toISOString(),
    status: event.status,
    isSynthetic,
    creatorProfileId: event.creatorProfileId,
    partner: resolvePartner(event, viewerUserId),
    hasPendingUpdate: event.updates.length > 0,
  };
}

function buildSyntheticDeadline(
  campaignId: string,
  campaignTitle: string,
  deadline: Date,
): CalendarEventData {
  return {
    id: `deadline-${campaignId}`,
    campaignId,
    campaignTitle,
    title: "Campaign Deadline",
    type: "DEADLINE",
    platform: null,
    scheduledAt: deadline.toISOString(),
    status: "SCHEDULED",
    isSynthetic: true,
  };
}

async function assertBrandOwnsCampaign(brandProfileId: string, campaignId: string) {
  return db.campaign.findFirst({
    where: { id: campaignId, brandProfileId },
    select: { id: true, title: true, deadline: true },
  });
}

async function assertCreatorCanViewCampaign(creatorProfileId: string, campaignId: string) {
  const [application, contract] = await Promise.all([
    db.application.findFirst({
      where: {
        campaignId,
        creatorProfileId,
        status: {
          in: [ApplicationStatus.ACCEPTED, ApplicationStatus.UNDER_REVIEW, ApplicationStatus.PENDING],
        },
      },
    }),
    db.contract.findFirst({
      where: {
        campaignId,
        creatorProfileId,
        status: { in: [ContractStatus.PENDING, ContractStatus.ACTIVE] },
      },
    }),
  ]);
  return !!(application || contract);
}

async function getEventAccess(eventId: string, user: SessionUser) {
  const event = await db.campaignEvent.findUnique({
    where: { id: eventId },
    include: {
      campaign: { select: { brandProfileId: true, id: true } },
    },
  });
  if (!event) return null;

  const isBrand =
    user.role === Role.BRAND &&
    user.brandProfile &&
    event.campaign.brandProfileId === user.brandProfile.id;

  const isCreator =
    user.role === Role.CREATOR &&
    user.creatorProfile &&
    (await assertCreatorCanViewCampaign(user.creatorProfile.id, event.campaignId));

  if (!isBrand && !isCreator) return null;
  return { event, isBrand, isCreator };
}

function revalidateCalendarPaths(campaignId: string) {
  revalidatePath("/creator/dashboard");
  revalidatePath("/brand/dashboard");
  revalidatePath(`/brand/campaigns/${campaignId}`);
  revalidatePath(`/creator/campaigns/${campaignId}`);
}

async function fetchEventsForCampaigns(
  campaignIds: string[],
  viewerUserId: string,
  rangeStart?: Date,
  rangeEnd?: Date,
): Promise<CalendarEventData[]> {
  if (campaignIds.length === 0) return [];

  const dateFilter =
    rangeStart && rangeEnd
      ? { scheduledAt: { gte: rangeStart, lte: rangeEnd } }
      : {};

  const [events, campaigns] = await Promise.all([
    db.campaignEvent.findMany({
      where: { campaignId: { in: campaignIds }, ...dateFilter },
      include: eventInclude,
      orderBy: { scheduledAt: "asc" },
    }),
    db.campaign.findMany({
      where: { id: { in: campaignIds }, deadline: { not: null } },
      select: { id: true, title: true, deadline: true },
    }),
  ]);

  const mapped = events.map((e) => mapEvent(e as RawEvent, viewerUserId));
  const hasDeadlineEvent = new Set(
    events.filter((e) => e.type === CampaignEventType.DEADLINE).map((e) => e.campaignId),
  );

  for (const c of campaigns) {
    if (!c.deadline || hasDeadlineEvent.has(c.id)) continue;
    const deadline = c.deadline;
    if (rangeStart && rangeEnd && (deadline < rangeStart || deadline > rangeEnd)) continue;
    mapped.push(buildSyntheticDeadline(c.id, c.title, deadline));
  }

  return mapped.sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
  );
}

const updateInclude = {
  requestedBy: { select: { id: true, name: true, image: true, role: true } },
} as const;

function mapEventUpdate(
  update: {
    id: string;
    status: EventUpdateStatus;
    title: string | null;
    platform: string | null;
    scheduledAt: Date | null;
    createdAt: Date;
    requestedBy: { id: string; name: string | null; image: string | null; role: Role };
  },
): EventUpdateData {
  return {
    id: update.id,
    status: update.status,
    title: update.title,
    platform: update.platform,
    scheduledAt: update.scheduledAt?.toISOString() ?? null,
    createdAt: update.createdAt.toISOString(),
    requestedBy: mapPartner(update.requestedBy),
  };
}

// ── Fetch actions ─────────────────────────────────────────────────────────────

export async function getCreatorCalendarEventsAction(
  month?: number,
  year?: number,
): Promise<{ data: CalendarEventData[]; error: string | null }> {
  const user = await getSessionUser();
  if (!user || user.role !== Role.CREATOR || !user.creatorProfile) {
    return { data: [], error: "Unauthorized" };
  }

  const creatorId = user.creatorProfile.id;

  const [applications, contracts] = await Promise.all([
    db.application.findMany({
      where: {
        creatorProfileId: creatorId,
        status: {
          in: [ApplicationStatus.ACCEPTED, ApplicationStatus.UNDER_REVIEW, ApplicationStatus.PENDING],
        },
      },
      select: { campaignId: true },
    }),
    db.contract.findMany({
      where: {
        creatorProfileId: creatorId,
        status: { in: [ContractStatus.PENDING, ContractStatus.ACTIVE] },
      },
      select: { campaignId: true },
    }),
  ]);

  const campaignIds = [
    ...new Set([
      ...applications.map((a) => a.campaignId),
      ...contracts.map((c) => c.campaignId),
    ]),
  ];

  let rangeStart: Date | undefined;
  let rangeEnd: Date | undefined;
  if (month !== undefined && year !== undefined) {
    rangeStart = new Date(year, month, 1);
    rangeEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);
  }

  const data = await fetchEventsForCampaigns(campaignIds, user.id, rangeStart, rangeEnd);
  return { data, error: null };
}

export async function getBrandCalendarEventsAction(
  month?: number,
  year?: number,
): Promise<{ data: CalendarEventData[]; error: string | null }> {
  const user = await getSessionUser();
  if (!user || user.role !== Role.BRAND || !user.brandProfile) {
    return { data: [], error: "Unauthorized" };
  }

  const campaigns = await db.campaign.findMany({
    where: { brandProfileId: user.brandProfile.id },
    select: { id: true },
  });

  let rangeStart: Date | undefined;
  let rangeEnd: Date | undefined;
  if (month !== undefined && year !== undefined) {
    rangeStart = new Date(year, month, 1);
    rangeEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);
  }

  const data = await fetchEventsForCampaigns(
    campaigns.map((c) => c.id),
    user.id,
    rangeStart,
    rangeEnd,
  );
  return { data, error: null };
}

export async function getCampaignEventsAction(
  campaignId: string,
): Promise<{ data: CalendarEventData[]; error: string | null }> {
  const user = await getSessionUser();
  if (!user) return { data: [], error: "Unauthorized" };

  if (user.role === Role.BRAND && user.brandProfile) {
    const campaign = await assertBrandOwnsCampaign(user.brandProfile.id, campaignId);
    if (!campaign) return { data: [], error: "Campaign not found" };
  } else if (user.role === Role.CREATOR && user.creatorProfile) {
    const canView = await assertCreatorCanViewCampaign(user.creatorProfile.id, campaignId);
    if (!canView) return { data: [], error: "Unauthorized" };
  } else {
    return { data: [], error: "Unauthorized" };
  }

  const data = await fetchEventsForCampaigns([campaignId], user.id);
  return { data, error: null };
}

export async function getCalendarEventDetailAction(
  eventId: string,
): Promise<{ data: CalendarEventDetailData | null; error: string | null }> {
  const user = await getSessionUser();
  if (!user) return { data: null, error: "Unauthorized" };

  const access = await getEventAccess(eventId, user);
  if (!access) return { data: null, error: "Event not found" };

  const event = await db.campaignEvent.findUnique({
    where: { id: eventId },
    include: {
      ...eventInclude,
      updates: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: updateInclude,
      },
    },
  });
  if (!event) return { data: null, error: "Event not found" };

  const pending = event.updates.find((u) => u.status === EventUpdateStatus.PENDING) ?? null;
  const base = mapEvent(event as RawEvent, user.id);

  return {
    data: {
      ...base,
      createdBy: mapPartner(event.createdBy),
      pendingUpdate: pending ? mapEventUpdate(pending) : null,
      updateHistory: event.updates
        .filter((u) => u.status !== EventUpdateStatus.PENDING)
        .map(mapEventUpdate),
      campaignImageUrl: event.campaign.imageUrl ?? null,
    },
    error: null,
  };
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export async function createCampaignEventAction(
  input: CreateEventInput,
): Promise<{ data: CalendarEventData | null; error: string | null }> {
  const user = await getSessionUser();
  if (!user || user.role !== Role.BRAND || !user.brandProfile) {
    return { data: null, error: "Unauthorized" };
  }

  const campaign = await assertBrandOwnsCampaign(user.brandProfile.id, input.campaignId);
  if (!campaign) return { data: null, error: "Campaign not found" };

  const scheduledAt = new Date(input.scheduledAt);
  if (isNaN(scheduledAt.getTime())) {
    return { data: null, error: "Invalid date" };
  }

  if (input.creatorProfileId) {
    const app = await db.application.findFirst({
      where: {
        campaignId: input.campaignId,
        creatorProfileId: input.creatorProfileId,
        status: ApplicationStatus.ACCEPTED,
      },
    });
    if (!app) {
      return { data: null, error: "Creator must have an accepted application for this campaign" };
    }
  }

  const event = await db.campaignEvent.create({
    data: {
      campaignId: input.campaignId,
      creatorProfileId: input.creatorProfileId ?? null,
      type: input.type as CampaignEventType,
      platform: input.platform ?? null,
      title: input.title ?? null,
      scheduledAt,
      status: (input.status as CampaignEventStatus) ?? CampaignEventStatus.SCHEDULED,
      createdById: user.id,
    },
    include: eventInclude,
  });

  revalidateCalendarPaths(input.campaignId);
  return { data: mapEvent(event as RawEvent, user.id), error: null };
}

export async function requestEventUpdateAction(
  input: RequestEventUpdateInput,
): Promise<{ data: EventUpdateData | null; error: string | null }> {
  const user = await getSessionUser();
  if (!user) return { data: null, error: "Unauthorized" };

  const access = await getEventAccess(input.eventId, user);
  if (!access) return { data: null, error: "Event not found" };

  if (!input.title && !input.platform && !input.scheduledAt) {
    return { data: null, error: "At least one field must be changed" };
  }

  const existingPending = await db.campaignEventUpdate.findFirst({
    where: { eventId: input.eventId, status: EventUpdateStatus.PENDING },
  });
  if (existingPending) {
    return { data: null, error: "A change request is already pending approval" };
  }

  let scheduledAt: Date | undefined;
  if (input.scheduledAt) {
    scheduledAt = new Date(input.scheduledAt);
    if (isNaN(scheduledAt.getTime())) {
      return { data: null, error: "Invalid date" };
    }
  }

  const update = await db.campaignEventUpdate.create({
    data: {
      eventId: input.eventId,
      requestedById: user.id,
      title: input.title ?? null,
      platform: input.platform ?? null,
      scheduledAt: scheduledAt ?? null,
    },
    include: updateInclude,
  });

  revalidateCalendarPaths(access.event.campaignId);
  return { data: mapEventUpdate(update), error: null };
}

export async function approveEventUpdateAction(
  updateId: string,
): Promise<{ data: CalendarEventDetailData | null; error: string | null }> {
  const user = await getSessionUser();
  if (!user) return { data: null, error: "Unauthorized" };

  const update = await db.campaignEventUpdate.findUnique({
    where: { id: updateId },
    include: {
      event: { include: { campaign: { select: { brandProfileId: true, id: true } } } },
      requestedBy: { select: { id: true } },
    },
  });
  if (!update || update.status !== EventUpdateStatus.PENDING) {
    return { data: null, error: "Update request not found" };
  }

  if (update.requestedById === user.id) {
    return { data: null, error: "You cannot approve your own change request" };
  }

  const access = await getEventAccess(update.eventId, user);
  if (!access) return { data: null, error: "Unauthorized" };

  const applyData: {
    title?: string;
    platform?: string | null;
    scheduledAt?: Date;
  } = {};
  if (update.title !== null) applyData.title = update.title;
  if (update.platform !== null) applyData.platform = update.platform;
  if (update.scheduledAt !== null) applyData.scheduledAt = update.scheduledAt;

  await db.$transaction([
    db.campaignEvent.update({
      where: { id: update.eventId },
      data: applyData,
    }),
    db.campaignEventUpdate.update({
      where: { id: updateId },
      data: {
        status: EventUpdateStatus.APPROVED,
        reviewedById: user.id,
        reviewedAt: new Date(),
      },
    }),
  ]);

  revalidateCalendarPaths(update.event.campaign.id);
  return getCalendarEventDetailAction(update.eventId);
}

export async function rejectEventUpdateAction(
  updateId: string,
): Promise<{ data: CalendarEventDetailData | null; error: string | null }> {
  const user = await getSessionUser();
  if (!user) return { data: null, error: "Unauthorized" };

  const update = await db.campaignEventUpdate.findUnique({
    where: { id: updateId },
    include: {
      event: { include: { campaign: { select: { id: true } } } },
      requestedBy: { select: { id: true } },
    },
  });
  if (!update || update.status !== EventUpdateStatus.PENDING) {
    return { data: null, error: "Update request not found" };
  }

  if (update.requestedById === user.id) {
    return { data: null, error: "You cannot reject your own change request" };
  }

  const access = await getEventAccess(update.eventId, user);
  if (!access) return { data: null, error: "Unauthorized" };

  await db.campaignEventUpdate.update({
    where: { id: updateId },
    data: {
      status: EventUpdateStatus.REJECTED,
      reviewedById: user.id,
      reviewedAt: new Date(),
    },
  });

  revalidateCalendarPaths(update.event.campaign.id);
  return getCalendarEventDetailAction(update.eventId);
}

export async function updateCampaignEventAction(input: {
  id: string;
  status?: string;
}): Promise<{ data: CalendarEventData | null; error: string | null }> {
  const user = await getSessionUser();
  if (!user) return { data: null, error: "Unauthorized" };

  const access = await getEventAccess(input.id, user);
  if (!access) return { data: null, error: "Event not found" };

  if (!input.status) {
    return {
      data: null,
      error: "Direct edits require approval — use requestEventUpdateAction for schedule or title changes",
    };
  }

  if (input.status !== "DONE") {
    return { data: null, error: "Only status can be updated directly" };
  }

  const event = await db.campaignEvent.update({
    where: { id: input.id },
    data: { status: input.status as CampaignEventStatus },
    include: eventInclude,
  });

  revalidateCalendarPaths(access.event.campaignId);
  return { data: mapEvent(event as RawEvent, user.id), error: null };
}

export async function deleteCampaignEventAction(
  id: string,
): Promise<{ error: string | null }> {
  const user = await getSessionUser();
  if (!user || user.role !== Role.BRAND || !user.brandProfile) {
    return { error: "Unauthorized" };
  }

  const existing = await db.campaignEvent.findUnique({
    where: { id },
    include: { campaign: { select: { brandProfileId: true, id: true } } },
  });
  if (!existing || existing.campaign.brandProfileId !== user.brandProfile.id) {
    return { error: "Event not found" };
  }

  await db.campaignEvent.delete({ where: { id } });

  revalidateCalendarPaths(existing.campaign.id);
  return { error: null };
}
