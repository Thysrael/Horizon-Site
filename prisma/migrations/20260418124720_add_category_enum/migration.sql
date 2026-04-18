/*
  Warnings:

  - Changed the type of `category` on the `sources` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('GENERAL', 'AI_ML', 'SYSTEMS', 'SECURITY', 'PL', 'WEBDEV', 'EMBEDDED', 'DEV_ECOSYSTEM', 'EMERGING_TECH', 'INDUSTRY', 'SCIENCE');

-- AlterTable
ALTER TABLE "sources" DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL;

-- CreateIndex
CREATE INDEX "sources_category_idx" ON "sources"("category");
