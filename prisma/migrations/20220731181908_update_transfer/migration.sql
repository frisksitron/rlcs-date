-- AlterTable
ALTER TABLE "Transfer" ADD COLUMN     "source" TEXT,
ALTER COLUMN "oldTeamName" DROP NOT NULL,
ALTER COLUMN "oldTeamTag" DROP NOT NULL;
