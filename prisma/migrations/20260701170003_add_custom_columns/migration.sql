-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "customFields" JSONB DEFAULT '{}';

-- CreateTable
CREATE TABLE "UserColumnConfig" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserColumnConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserColumnConfig_userId_idx" ON "UserColumnConfig"("userId");
