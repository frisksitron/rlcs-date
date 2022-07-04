/*
  Warnings:

  - You are about to drop the column `score` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "score",
ADD COLUMN     "blueScore" TEXT,
ADD COLUMN     "orangeScore" TEXT;
