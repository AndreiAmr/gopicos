-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Spot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "modality" TEXT NOT NULL,
    "equipmentRequired" BOOLEAN NOT NULL,
    "isPaid" BOOLEAN NOT NULL,
    "alwaysOpen" BOOLEAN NOT NULL,
    "entryAmount" TEXT,
    "openingHours" TEXT,
    "hasCoverage" BOOLEAN NOT NULL,
    "coordinates" JSONB NOT NULL,
    "images" TEXT[],
    "markingType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "public"."SpotReview" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "spotId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "public"."User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Spot_id_key" ON "public"."Spot"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SpotReview_id_key" ON "public"."SpotReview"("id");

-- AddForeignKey
ALTER TABLE "public"."Spot" ADD CONSTRAINT "Spot_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SpotReview" ADD CONSTRAINT "SpotReview_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SpotReview" ADD CONSTRAINT "SpotReview_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "public"."Spot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SpotReview" ADD CONSTRAINT "SpotReview_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."SpotReview"("id") ON DELETE SET NULL ON UPDATE CASCADE;
