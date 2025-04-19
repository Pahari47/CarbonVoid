-- CreateTable
CREATE TABLE "SustainabilityReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "suggestions" TEXT[],
    "metrics" JSONB NOT NULL,

    CONSTRAINT "SustainabilityReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SustainabilityReport" ADD CONSTRAINT "SustainabilityReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
