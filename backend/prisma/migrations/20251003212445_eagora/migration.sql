/*
  Warnings:

  - You are about to drop the column `alwaysOpen` on the `Spot` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Spot` table. All the data in the column will be lost.
  - You are about to drop the column `coordinates` on the `Spot` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Spot` table. All the data in the column will be lost.
  - You are about to drop the column `entryAmount` on the `Spot` table. All the data in the column will be lost.
  - You are about to drop the column `equipmentRequired` on the `Spot` table. All the data in the column will be lost.
  - You are about to drop the column `hasCoverage` on the `Spot` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Spot` table. All the data in the column will be lost.
  - You are about to drop the column `isPaid` on the `Spot` table. All the data in the column will be lost.
  - You are about to drop the column `locationMarkingTypeId` on the `Spot` table. All the data in the column will be lost.
  - You are about to drop the column `modality` on the `Spot` table. All the data in the column will be lost.
  - You are about to drop the column `openingHours` on the `Spot` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Spot" DROP CONSTRAINT "Spot_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Spot" DROP CONSTRAINT "Spot_locationMarkingTypeId_fkey";

-- AlterTable
ALTER TABLE "public"."Spot" DROP COLUMN "alwaysOpen",
DROP COLUMN "authorId",
DROP COLUMN "coordinates",
DROP COLUMN "description",
DROP COLUMN "entryAmount",
DROP COLUMN "equipmentRequired",
DROP COLUMN "hasCoverage",
DROP COLUMN "images",
DROP COLUMN "isPaid",
DROP COLUMN "locationMarkingTypeId",
DROP COLUMN "modality",
DROP COLUMN "openingHours";
