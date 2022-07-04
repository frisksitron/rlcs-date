/*
  Warnings:

  - The `blueScore` column on the `Match` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `orangeScore` column on the `Match` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "blueScore",
ADD COLUMN     "blueScore" INTEGER,
DROP COLUMN "orangeScore",
ADD COLUMN     "orangeScore" INTEGER;
