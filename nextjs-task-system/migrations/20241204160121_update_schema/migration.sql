-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "assignedToUserId" INTEGER,
    "assignedToGroupId" INTEGER,
    "dueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "priority" INTEGER NOT NULL,
    CONSTRAINT "Task_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_assignedToGroupId_fkey" FOREIGN KEY ("assignedToGroupId") REFERENCES "Group" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
