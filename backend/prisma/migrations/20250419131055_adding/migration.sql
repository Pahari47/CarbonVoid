-- CreateTable
CREATE TABLE "DeclutterLog" (
    "id" TEXT NOT NULL,
    "suggestions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeclutterLog_pkey" PRIMARY KEY ("id")
);
