-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "teamIds" TEXT NOT NULL,
    "clanNames" TEXT NOT NULL,
    "teamMembers" TEXT NOT NULL,
    "maps" TEXT NOT NULL,
    "wins" TEXT NOT NULL,
    "thirdPlaceEnabled" BOOLEAN NOT NULL,
    "thirdPlaceWinIndex" INTEGER NOT NULL,
    "thirdPlaceMaps" TEXT NOT NULL
);
