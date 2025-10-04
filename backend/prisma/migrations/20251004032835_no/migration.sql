/*
  Warnings:

  - Added the required column `alwaysOpen` to the `Spot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Spot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coordinates` to the `Spot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Spot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `equipmentRequired` to the `Spot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasCoverage` to the `Spot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPaid` to the `Spot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locationMarkingTypeId` to the `Spot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modality` to the `Spot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Spot" ADD COLUMN     "alwaysOpen" BOOLEAN NOT NULL,
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "coordinates" JSONB NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "entryAmount" TEXT,
ADD COLUMN     "equipmentRequired" BOOLEAN NOT NULL,
ADD COLUMN     "hasCoverage" BOOLEAN NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "isPaid" BOOLEAN NOT NULL,
ADD COLUMN     "locationMarkingTypeId" INTEGER NOT NULL,
ADD COLUMN     "modality" TEXT NOT NULL,
ADD COLUMN     "openingHours" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Spot" ADD CONSTRAINT "Spot_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Spot" ADD CONSTRAINT "Spot_locationMarkingTypeId_fkey" FOREIGN KEY ("locationMarkingTypeId") REFERENCES "public"."LocationMarkingType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
