-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "jobRole" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "applicationDate" DATETIME NOT NULL,
    "lastUpdated" DATETIME NOT NULL,
    "notes" TEXT,
    "salary" TEXT,
    "jobUrl" TEXT,
    "interviewDate" DATETIME,
    "jobPostId" TEXT,
    CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "JobApplication_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_JobApplication" ("applicationDate", "company", "id", "interviewDate", "jobRole", "jobUrl", "lastUpdated", "notes", "salary", "status", "userId") SELECT "applicationDate", "company", "id", "interviewDate", "jobRole", "jobUrl", "lastUpdated", "notes", "salary", "status", "userId" FROM "JobApplication";
DROP TABLE "JobApplication";
ALTER TABLE "new_JobApplication" RENAME TO "JobApplication";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
