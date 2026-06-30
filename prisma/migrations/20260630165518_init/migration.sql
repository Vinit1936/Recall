-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('LEETCODE');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "ProblemStatus" AS ENUM ('ACTIVE', 'MASTERED', 'RETIRED');

-- CreateEnum
CREATE TYPE "Confidence" AS ENUM ('CLEAN', 'SHAKY', 'STRUGGLED');

-- CreateEnum
CREATE TYPE "RevisionType" AS ENUM ('REGULAR', 'RECHECK');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL DEFAULT 'LEETCODE',
    "problemNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "topic" TEXT NOT NULL,
    "dateSolved" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "status" "ProblemStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "nextRevisionAt" TIMESTAMP(3) NOT NULL,
    "revisionCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Revision" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "revisedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confidence" "Confidence" NOT NULL,
    "type" "RevisionType" NOT NULL DEFAULT 'REGULAR',
    "stepBefore" INTEGER NOT NULL,
    "stepAfter" INTEGER NOT NULL,

    CONSTRAINT "Revision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreakLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StreakLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Problem_userId_status_nextRevisionAt_idx" ON "Problem"("userId", "status", "nextRevisionAt");

-- CreateIndex
CREATE INDEX "Problem_userId_topic_idx" ON "Problem"("userId", "topic");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_userId_platform_problemNumber_key" ON "Problem"("userId", "platform", "problemNumber");

-- CreateIndex
CREATE INDEX "Revision_problemId_idx" ON "Revision"("problemId");

-- CreateIndex
CREATE UNIQUE INDEX "StreakLog_userId_date_key" ON "StreakLog"("userId", "date");

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
