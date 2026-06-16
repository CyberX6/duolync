-- Campaign: content format options for creators
ALTER TABLE "Campaign" ADD COLUMN IF NOT EXISTS "contentFormats" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Application: negotiation / collaboration fields
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "negotiatedRate" DOUBLE PRECISION;
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "contentFormats" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "brandNote" TEXT;

-- Indexes (safe if already created via db push)
CREATE INDEX IF NOT EXISTS "Campaign_brandProfileId_idx" ON "Campaign"("brandProfileId");
CREATE INDEX IF NOT EXISTS "Campaign_status_idx" ON "Campaign"("status");
CREATE INDEX IF NOT EXISTS "Application_campaignId_status_idx" ON "Application"("campaignId", "status");
