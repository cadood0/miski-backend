/*
  Warnings:

  - The `stock` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('inStock', 'lowStock', 'outOfStock');

-- CreateEnum
CREATE TYPE "Badge" AS ENUM ('bestSeller', 'new', 'limited');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "badge" "Badge",
ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "family" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "notesBase" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "notesHeart" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "notesTop" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "volume" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "stock",
ADD COLUMN     "stock" "StockStatus" NOT NULL DEFAULT 'inStock';
