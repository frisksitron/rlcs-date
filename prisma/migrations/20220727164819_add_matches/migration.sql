/*
  Warnings:

  - The `startTime` column on the `Match` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `liquipediaPageId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "liquipediaPageId" INTEGER NOT NULL,
ALTER COLUMN "roundName" DROP NOT NULL,
ALTER COLUMN "team1Name" DROP NOT NULL,
ALTER COLUMN "team2Name" DROP NOT NULL,
ALTER COLUMN "team1Tag" DROP NOT NULL,
ALTER COLUMN "team2Tag" DROP NOT NULL,
DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIMESTAMP(3),
ALTER COLUMN "score" DROP NOT NULL,
ALTER COLUMN "score" SET DATA TYPE TEXT;
