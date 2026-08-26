-- ──────────────────────────────────────────────────────────────────────────────
-- Migration: add_apify_and_missing_schema
-- Adds all schema additions that were missing from previous migrations.
-- Every statement is wrapped in a DO block so the migration is fully idempotent
-- and safe to run against databases in any intermediate state.
-- ──────────────────────────────────────────────────────────────────────────────

-- ── 1. New enums ──────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE "CampaignStatus" AS ENUM (
    'DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED',
    'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'SUBMITTED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "ApplicationStatus" AS ENUM (
    'PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "NotificationType" AS ENUM (
    'CAMPAIGN_UPDATE', 'APPLICATION_UPDATE', 'MESSAGE', 'SYSTEM'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── 2. Campaign — missing columns ─────────────────────────────────────────────

DO $$ BEGIN
  ALTER TABLE "Campaign" ADD COLUMN "imageUrl" TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Campaign" ADD COLUMN "deadline" TIMESTAMP(3);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Campaign" ADD COLUMN "requirements" TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Campaign" ADD COLUMN "briefDescription" TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Campaign" ADD COLUMN "goal" TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Campaign" ADD COLUMN "dosAndDonts" TEXT;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Campaign" ADD COLUMN "platforms" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Campaign" ADD COLUMN "minFollowers" INTEGER;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Campaign" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- Convert Campaign.status from TEXT to CampaignStatus enum (skip if already enum).
DO $$ BEGIN
  ALTER TABLE "Campaign"
    ALTER COLUMN "status" TYPE "CampaignStatus"
    USING "status"::"CampaignStatus";
EXCEPTION WHEN others THEN NULL; END $$;

-- ── 3. Application — status type upgrade & missing column ─────────────────────

-- Convert Application.status to ApplicationStatus enum if the table exists.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Application') THEN
    ALTER TABLE "Application"
      ALTER COLUMN "status" TYPE "ApplicationStatus"
      USING "status"::"ApplicationStatus";
  END IF;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Application" ADD COLUMN "selectedPlatform" TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
         WHEN undefined_table   THEN NULL; END $$;

-- ── 4. CreatorProfile — Apify analytics columns ───────────────────────────────

DO $$ BEGIN
  ALTER TABLE "CreatorProfile" ADD COLUMN "followerCount" INTEGER;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "CreatorProfile" ADD COLUMN "averageEngagement" DOUBLE PRECISION;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "CreatorProfile" ADD COLUMN "topNiches" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "CreatorProfile" ADD COLUMN "lastSyncedAt" TIMESTAMP(3);
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "CreatorProfile" ADD COLUMN "connectedPlatforms" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- ── 5. SocialPost — new table ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "SocialPost" (
    "id"               TEXT NOT NULL,
    "creatorProfileId" TEXT NOT NULL,
    "platform"         TEXT NOT NULL,
    "postUrl"          TEXT,
    "imageUrl"         TEXT,
    "caption"          TEXT,
    "likes"            INTEGER,
    "comments"         INTEGER,
    "views"            INTEGER,
    "engagementRate"   DOUBLE PRECISION,
    "postedAt"         TIMESTAMP(3),
    "fetchedAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialPost_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SocialPost_creatorProfileId_platform_idx"
    ON "SocialPost"("creatorProfileId", "platform");

DO $$ BEGIN
  ALTER TABLE "SocialPost"
    ADD CONSTRAINT "SocialPost_creatorProfileId_fkey"
    FOREIGN KEY ("creatorProfileId") REFERENCES "CreatorProfile"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── 6. Invitation — new table ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Invitation" (
    "id"             TEXT NOT NULL,
    "campaignId"     TEXT NOT NULL,
    "brandProfileId" TEXT NOT NULL,
    "creatorUserId"  TEXT NOT NULL,
    "message"        TEXT,
    "proposedBudget" DOUBLE PRECISION,
    "status"         "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Invitation_campaignId_creatorUserId_key"
    ON "Invitation"("campaignId", "creatorUserId");

CREATE INDEX IF NOT EXISTS "Invitation_creatorUserId_status_idx"
    ON "Invitation"("creatorUserId", "status");

CREATE INDEX IF NOT EXISTS "Invitation_brandProfileId_idx"
    ON "Invitation"("brandProfileId");

DO $$ BEGIN
  ALTER TABLE "Invitation"
    ADD CONSTRAINT "Invitation_campaignId_fkey"
    FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Invitation"
    ADD CONSTRAINT "Invitation_brandProfileId_fkey"
    FOREIGN KEY ("brandProfileId") REFERENCES "BrandProfile"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "Invitation"
    ADD CONSTRAINT "Invitation_creatorUserId_fkey"
    FOREIGN KEY ("creatorUserId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── 7. RateLimitEvent — new table ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "RateLimitEvent" (
    "id"         TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimitEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "RateLimitEvent_identifier_createdAt_idx"
    ON "RateLimitEvent"("identifier", "createdAt");
