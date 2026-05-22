-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_meal_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "mealId" TEXT,
    "mealDate" TEXT NOT NULL,
    "quantity" REAL NOT NULL DEFAULT 1,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "meal_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "meal_entries_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_meal_entries" ("createdAt", "deletedAt", "id", "mealDate", "mealId", "notes", "quantity", "updatedAt", "userId") SELECT "createdAt", "deletedAt", "id", "mealDate", "mealId", "notes", "quantity", "updatedAt", "userId" FROM "meal_entries";
DROP TABLE "meal_entries";
ALTER TABLE "new_meal_entries" RENAME TO "meal_entries";
CREATE INDEX "meal_entries_userId_mealDate_idx" ON "meal_entries"("userId", "mealDate");
CREATE INDEX "meal_entries_mealId_idx" ON "meal_entries"("mealId");
CREATE INDEX "meal_entries_deletedAt_idx" ON "meal_entries"("deletedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
