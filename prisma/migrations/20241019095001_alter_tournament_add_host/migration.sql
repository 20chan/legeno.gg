-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TournamentV2" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "host" TEXT NOT NULL DEFAULT '',
    "optionsSerialized" TEXT NOT NULL,
    "teamsSerialized" TEXT NOT NULL,
    "matchesSerialized" TEXT NOT NULL
);
INSERT INTO "new_TournamentV2" ("createdAt", "id", "matchesSerialized", "optionsSerialized", "startDate", "teamsSerialized", "title", "userId") SELECT "createdAt", "id", "matchesSerialized", "optionsSerialized", "startDate", "teamsSerialized", "title", "userId" FROM "TournamentV2";
DROP TABLE "TournamentV2";
ALTER TABLE "new_TournamentV2" RENAME TO "TournamentV2";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
