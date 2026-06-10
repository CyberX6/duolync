-- CreateTable
CREATE TABLE "CommunityList" (
    "id" TEXT NOT NULL,
    "brandProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunityListMember" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "creatorUserId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunityListMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunityList_brandProfileId_idx" ON "CommunityList"("brandProfileId");

-- CreateIndex
CREATE INDEX "CommunityListMember_listId_idx" ON "CommunityListMember"("listId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityListMember_listId_creatorUserId_key" ON "CommunityListMember"("listId", "creatorUserId");

-- AddForeignKey
ALTER TABLE "CommunityList" ADD CONSTRAINT "CommunityList_brandProfileId_fkey" FOREIGN KEY ("brandProfileId") REFERENCES "BrandProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityListMember" ADD CONSTRAINT "CommunityListMember_listId_fkey" FOREIGN KEY ("listId") REFERENCES "CommunityList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
