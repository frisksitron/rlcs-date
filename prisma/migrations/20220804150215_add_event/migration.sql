/*
  Warnings:

  - You are about to drop the column `liquipediaPageId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `roundName` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `team1Name` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `team1Tag` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `team2Name` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `team2Tag` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "liquipediaPageId",
DROP COLUMN "roundName",
DROP COLUMN "team1Name",
DROP COLUMN "team1Tag",
DROP COLUMN "team2Name",
DROP COLUMN "team2Tag",
ADD COLUMN     "blueTeam" TEXT,
ADD COLUMN     "orangeTeam" TEXT,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Match_id_seq";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "liquipediaUrl" TEXT NOT NULL,
    "isLan" BOOLEAN NOT NULL,
    "region" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
