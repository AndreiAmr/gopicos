/*
  Warnings:

  - A unique constraint covering the columns `[locationMarkingTypeId]` on the table `Spot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `locationMarkingTypeId` to the `Spot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Spot" ADD COLUMN     "locationMarkingTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."LocationMarkingType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LocationMarkingType_id_key" ON "public"."LocationMarkingType"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Spot_locationMarkingTypeId_key" ON "public"."Spot"("locationMarkingTypeId");

-- AddForeignKey
ALTER TABLE "public"."Spot" ADD CONSTRAINT "Spot_locationMarkingTypeId_fkey" FOREIGN KEY ("locationMarkingTypeId") REFERENCES "public"."LocationMarkingType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
