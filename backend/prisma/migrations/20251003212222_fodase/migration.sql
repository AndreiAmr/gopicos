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
    "locationMarkingTypeId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "public"."LocationMarkingType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "public"."User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Spot_id_key" ON "public"."Spot"("id");

-- CreateIndex
CREATE UNIQUE INDEX "LocationMarkingType_id_key" ON "public"."LocationMarkingType"("id");

-- AddForeignKey
ALTER TABLE "public"."Spot" ADD CONSTRAINT "Spot_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Spot" ADD CONSTRAINT "Spot_locationMarkingTypeId_fkey" FOREIGN KEY ("locationMarkingTypeId") REFERENCES "public"."LocationMarkingType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
