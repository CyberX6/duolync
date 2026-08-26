-- ──────────────────────────────────────────────────────────────────────────────
-- Migration: fix_schema_drift_and_relations
--
-- Corrects three classes of drift found auditing the live database against
-- prisma/schema.prisma. Idempotent so it is safe to re-run.
--
--   1. Array columns were created nullable, but Prisma declares them
--      `String[] @default([])` (NOT NULL). Reading a NULL into a non-nullable
--      list field makes the query engine throw at runtime.
--   2. Contract.brandProfileId had no foreign key and no Prisma relation.
--   3. CommunityListMember.creatorUserId had no foreign key, which already
--      allowed orphaned rows to accumulate when users were deleted.
-- ──────────────────────────────────────────────────────────────────────────────

-- ── 1. Backfill NULLs, then enforce NOT NULL on list columns ──────────────────

UPDATE "Campaign"       SET "platforms"          = ARRAY[]::TEXT[] WHERE "platforms"          IS NULL;
UPDATE "Campaign"       SET "contentFormats"     = ARRAY[]::TEXT[] WHERE "contentFormats"     IS NULL;
UPDATE "Application"    SET "contentFormats"     = ARRAY[]::TEXT[] WHERE "contentFormats"     IS NULL;
UPDATE "CreatorProfile" SET "topNiches"          = ARRAY[]::TEXT[] WHERE "topNiches"          IS NULL;
UPDATE "CreatorProfile" SET "connectedPlatforms" = ARRAY[]::TEXT[] WHERE "connectedPlatforms" IS NULL;

ALTER TABLE "Campaign"       ALTER COLUMN "platforms"          SET NOT NULL;
ALTER TABLE "Campaign"       ALTER COLUMN "platforms"          SET DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Campaign"       ALTER COLUMN "contentFormats"     SET NOT NULL;
ALTER TABLE "Campaign"       ALTER COLUMN "contentFormats"     SET DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Application"    ALTER COLUMN "contentFormats"     SET NOT NULL;
ALTER TABLE "Application"    ALTER COLUMN "contentFormats"     SET DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "CreatorProfile" ALTER COLUMN "topNiches"          SET NOT NULL;
ALTER TABLE "CreatorProfile" ALTER COLUMN "topNiches"          SET DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "CreatorProfile" ALTER COLUMN "connectedPlatforms" SET NOT NULL;
ALTER TABLE "CreatorProfile" ALTER COLUMN "connectedPlatforms" SET DEFAULT ARRAY[]::TEXT[];

-- ── 2. Contract → BrandProfile foreign key ────────────────────────────────────

DELETE FROM "Contract" c
  WHERE NOT EXISTS (SELECT 1 FROM "BrandProfile" b WHERE b.id = c."brandProfileId");

DO $$ BEGIN
  ALTER TABLE "Contract"
    ADD CONSTRAINT "Contract_brandProfileId_fkey"
    FOREIGN KEY ("brandProfileId") REFERENCES "BrandProfile"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "Contract_brandProfileId_idx"   ON "Contract"("brandProfileId");
CREATE INDEX IF NOT EXISTS "Contract_creatorProfileId_idx" ON "Contract"("creatorProfileId");
CREATE INDEX IF NOT EXISTS "Contract_campaignId_idx"       ON "Contract"("campaignId");

-- ── 3. CommunityListMember → User foreign key ─────────────────────────────────

-- Remove rows orphaned while no foreign key was enforcing referential integrity.
DELETE FROM "CommunityListMember" m
  WHERE NOT EXISTS (SELECT 1 FROM "User" u WHERE u.id = m."creatorUserId");

DO $$ BEGIN
  ALTER TABLE "CommunityListMember"
    ADD CONSTRAINT "CommunityListMember_creatorUserId_fkey"
    FOREIGN KEY ("creatorUserId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "CommunityListMember_creatorUserId_idx"
  ON "CommunityListMember"("creatorUserId");

-- ── 4. PlatformStats uniqueness ───────────────────────────────────────────────

-- Collapse any duplicate (userId, platform) rows, keeping the most recent.
DELETE FROM "PlatformStats" p
  WHERE EXISTS (
    SELECT 1 FROM "PlatformStats" q
    WHERE q."userId" = p."userId"
      AND q."platform" = p."platform"
      AND (q."fetchedAt", q.id) > (p."fetchedAt", p.id)
  );

CREATE UNIQUE INDEX IF NOT EXISTS "PlatformStats_userId_platform_key"
  ON "PlatformStats"("userId", "platform");
