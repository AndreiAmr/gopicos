/*
  Warnings:

  - Added the required column `alwaysOpen` to the `Spot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entryAmount` to the `Spot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `equipmentRequired` to the `Spot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasCoverage` to the `Spot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPaid` to the `Spot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modality` to the `Spot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Spot" ADD COLUMN     "alwaysOpen" BOOLEAN NOT NULL,
ADD COLUMN     "coordinates" INTEGER[],
ADD COLUMN     "entryAmount" TEXT NOT NULL,
ADD COLUMN     "equipmentRequired" BOOLEAN NOT NULL,
ADD COLUMN     "hasCoverage" BOOLEAN NOT NULL,
ADD COLUMN     "isPaid" BOOLEAN NOT NULL,
ADD COLUMN     "modality" TEXT NOT NULL;
