-- CreateTable
CREATE TABLE "Transfer" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "players" TEXT NOT NULL,
    "oldTeamName" TEXT NOT NULL,
    "oldTeamTag" TEXT NOT NULL,
    "newTeamName" TEXT,
    "newTeamTag" TEXT,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);
