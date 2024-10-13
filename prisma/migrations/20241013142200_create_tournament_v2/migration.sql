-- CreateTable
CREATE TABLE "TournamentV2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "teamsSerialized" TEXT NOT NULL,
    "matchesSerialized" TEXT NOT NULL,
    "optionsSerialized" TEXT NOT NULL
);
