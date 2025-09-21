/*
  Warnings:

  - The `id` column on the `LocationMarkingType` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `locationMarkingTypeId` on the `Spot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Spot" DROP CONSTRAINT "Spot_locationMarkingTypeId_fkey";

-- DropIndex
DROP INDEX "public"."Spot_locationMarkingTypeId_key";

-- AlterTable
ALTER TABLE "public"."LocationMarkingType" DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "public"."Spot" DROP COLUMN "locationMarkingTypeId",
ADD COLUMN     "locationMarkingTypeId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LocationMarkingType_id_key" ON "public"."LocationMarkingType"("id");

-- AddForeignKey
ALTER TABLE "public"."Spot" ADD CONSTRAINT "Spot_locationMarkingTypeId_fkey" FOREIGN KEY ("locationMarkingTypeId") REFERENCES "public"."LocationMarkingType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
