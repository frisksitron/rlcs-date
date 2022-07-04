-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "roundName" TEXT NOT NULL,
    "team1Name" TEXT NOT NULL,
    "team2Name" TEXT NOT NULL,
    "team1Tag" TEXT NOT NULL,
    "team2Tag" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "qualifiedForChampionship" BOOLEAN NOT NULL,
    "qualifiedForWildcard" BOOLEAN NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
