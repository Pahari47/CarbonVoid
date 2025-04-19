/*
  Warnings:

  - Added the required column `co2e` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "co2e" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "resolution" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserFootprintCache" (
    "userId" TEXT NOT NULL,
    "totalCO2e" DOUBLE PRECISION NOT NULL,
    "activityCount" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFootprintCache_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "UserFootprintCache_totalCO2e_idx" ON "UserFootprintCache"("totalCO2e");

-- CreateIndex
CREATE INDEX "Activity_userId_idx" ON "Activity"("userId");

-- CreateIndex
CREATE INDEX "Activity_createdAt_idx" ON "Activity"("createdAt");

-- AddForeignKey
ALTER TABLE "UserFootprintCache" ADD CONSTRAINT "UserFootprintCache_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
