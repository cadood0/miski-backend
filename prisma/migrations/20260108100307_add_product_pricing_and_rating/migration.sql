/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "updatedAt",
ADD COLUMN     "originalPrice" DOUBLE PRECISION,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "reviews" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "family" DROP DEFAULT,
ALTER COLUMN "imageUrl" DROP DEFAULT,
ALTER COLUMN "notesBase" DROP DEFAULT,
ALTER COLUMN "notesHeart" DROP DEFAULT,
ALTER COLUMN "notesTop" DROP DEFAULT,
ALTER COLUMN "volume" DROP DEFAULT;
