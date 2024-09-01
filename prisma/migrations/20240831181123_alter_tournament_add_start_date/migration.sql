-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
INSERT INTO "new_Tournament" ("clanNames", "createdAt", "id", "maps", "teamIds", "teamMembers", "thirdPlaceEnabled", "thirdPlaceMaps", "thirdPlaceWinIndex", "title", "userId", "wins") SELECT "clanNames", "createdAt", "id", "maps", "teamIds", "teamMembers", "thirdPlaceEnabled", "thirdPlaceMaps", "thirdPlaceWinIndex", "title", "userId", "wins" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
