-- CreateTable
CREATE TABLE "Cell" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "aislesCount" INTEGER NOT NULL,
    "locationsPerAisle" INTEGER NOT NULL,
    "levelsPerLocation" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Aisle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "isOdd" BOOLEAN NOT NULL DEFAULT true,
    "cellId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Aisle_cellId_fkey" FOREIGN KEY ("cellId") REFERENCES "Cell" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bay" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "aisleId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Bay_aisleId_fkey" FOREIGN KEY ("aisleId") REFERENCES "Aisle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "position" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "isPicking" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "aisleId" INTEGER NOT NULL,
    "bayId" INTEGER NOT NULL,
    "blockReasonId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Location_aisleId_fkey" FOREIGN KEY ("aisleId") REFERENCES "Aisle" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Location_bayId_fkey" FOREIGN KEY ("bayId") REFERENCES "Bay" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Location_blockReasonId_fkey" FOREIGN KEY ("blockReasonId") REFERENCES "BlockReason" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BlockReason" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permanent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Obstacle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "aisleId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Obstacle_aisleId_fkey" FOREIGN KEY ("aisleId") REFERENCES "Aisle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_LocationToObstacle" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_LocationToObstacle_A_fkey" FOREIGN KEY ("A") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LocationToObstacle_B_fkey" FOREIGN KEY ("B") REFERENCES "Obstacle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Cell_number_key" ON "Cell"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Aisle_cellId_number_isOdd_key" ON "Aisle"("cellId", "number", "isOdd");

-- CreateIndex
CREATE UNIQUE INDEX "Bay_aisleId_number_key" ON "Bay"("aisleId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Location_bayId_position_level_key" ON "Location"("bayId", "position", "level");

-- CreateIndex
CREATE UNIQUE INDEX "BlockReason_code_key" ON "BlockReason"("code");

-- CreateIndex
CREATE UNIQUE INDEX "_LocationToObstacle_AB_unique" ON "_LocationToObstacle"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationToObstacle_B_index" ON "_LocationToObstacle"("B");
