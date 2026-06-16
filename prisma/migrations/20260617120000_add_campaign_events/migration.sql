-- CreateEnum
CREATE TYPE "CampaignEventType" AS ENUM ('POST', 'STORY', 'MEETING', 'DEADLINE');

-- CreateEnum
CREATE TYPE "CampaignEventStatus" AS ENUM ('SCHEDULED', 'GOING_LIVE', 'QUEUED', 'SYNCED', 'PENDING', 'DONE');

-- CreateTable
CREATE TABLE "CampaignEvent" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "title" TEXT,
    "type" "CampaignEventType" NOT NULL,
    "platform" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" "CampaignEventStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CampaignEvent_campaignId_idx" ON "CampaignEvent"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignEvent_scheduledAt_idx" ON "CampaignEvent"("scheduledAt");

-- AddForeignKey
ALTER TABLE "CampaignEvent" ADD CONSTRAINT "CampaignEvent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
