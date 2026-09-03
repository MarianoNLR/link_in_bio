/*
  Warnings:

  - A unique constraint covering the columns `[userId,position]` on the table `Link` will be added. If there are existing duplicate values, this will fail.
  - Made the column `title` on table `Link` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Link_userId_idx";

-- DropIndex
DROP INDEX "Link_userId_position_idx";

-- AlterTable
ALTER TABLE "Link" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "position" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Link_userId_position_key" ON "Link"("userId", "position");
