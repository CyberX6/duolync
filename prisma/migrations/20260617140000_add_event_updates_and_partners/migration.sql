-- CreateEnum
CREATE TYPE "EventUpdateStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "CampaignEvent" ADD COLUMN "creatorProfileId" TEXT;

-- CreateTable
CREATE TABLE "CampaignEventUpdate" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "status" "EventUpdateStatus" NOT NULL DEFAULT 'PENDING',
    "title" TEXT,
    "platform" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "CampaignEventUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CampaignEvent_creatorProfileId_idx" ON "CampaignEvent"("creatorProfileId");

-- CreateIndex
CREATE INDEX "CampaignEventUpdate_eventId_idx" ON "CampaignEventUpdate"("eventId");

-- CreateIndex
CREATE INDEX "CampaignEventUpdate_eventId_status_idx" ON "CampaignEventUpdate"("eventId", "status");

-- CreateIndex
CREATE INDEX "CampaignEventUpdate_requestedById_idx" ON "CampaignEventUpdate"("requestedById");

-- AddForeignKey
ALTER TABLE "CampaignEvent" ADD CONSTRAINT "CampaignEvent_creatorProfileId_fkey" FOREIGN KEY ("creatorProfileId") REFERENCES "CreatorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignEvent" ADD CONSTRAINT "CampaignEvent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignEventUpdate" ADD CONSTRAINT "CampaignEventUpdate_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "CampaignEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignEventUpdate" ADD CONSTRAINT "CampaignEventUpdate_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignEventUpdate" ADD CONSTRAINT "CampaignEventUpdate_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
