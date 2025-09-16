-- CreateEnum
CREATE TYPE "public"."QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'FILL_IN_THE_BLANK');

-- CreateEnum
CREATE TYPE "public"."AssessmentType" AS ENUM ('INITIAL', 'REPAIR', 'SRS_QUIZ');

-- CreateEnum
CREATE TYPE "public"."NodeStatus" AS ENUM ('NOT_STARTED', 'WEAKNESS', 'MASTERED');

-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Domain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KnowledgeNode" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "KnowledgeNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Question" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" "public"."QuestionType" NOT NULL DEFAULT 'MULTIPLE_CHOICE',
    "explanation" TEXT,
    "knowledgeNodeId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Choice" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "Choice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Assessment" (
    "id" TEXT NOT NULL,
    "type" "public"."AssessmentType" NOT NULL DEFAULT 'INITIAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAnswer" (
    "id" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assessmentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedChoiceId" TEXT,

    CONSTRAINT "UserAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserNodeProgress" (
    "status" "public"."NodeStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "lastAssessedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "knowledgeNodeId" TEXT NOT NULL,

    CONSTRAINT "UserNodeProgress_pkey" PRIMARY KEY ("userId","knowledgeNodeId")
);

-- CreateTable
CREATE TABLE "public"."RepairTask" (
    "id" TEXT NOT NULL,
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "miniProjectSubmission" TEXT,
    "userId" TEXT NOT NULL,
    "knowledgeNodeId" TEXT NOT NULL,

    CONSTRAINT "RepairTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SRSItem" (
    "id" TEXT NOT NULL,
    "nextReviewAt" TIMESTAMP(3) NOT NULL,
    "interval" INTEGER NOT NULL,
    "easeFactor" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "SRSItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_Prerequisites" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Prerequisites_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_name_key" ON "public"."Domain"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SRSItem_userId_questionId_key" ON "public"."SRSItem"("userId", "questionId");

-- CreateIndex
CREATE INDEX "_Prerequisites_B_index" ON "public"."_Prerequisites"("B");

-- AddForeignKey
ALTER TABLE "public"."KnowledgeNode" ADD CONSTRAINT "KnowledgeNode_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "public"."Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_knowledgeNodeId_fkey" FOREIGN KEY ("knowledgeNodeId") REFERENCES "public"."KnowledgeNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Choice" ADD CONSTRAINT "Choice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assessment" ADD CONSTRAINT "Assessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAnswer" ADD CONSTRAINT "UserAnswer_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "public"."Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAnswer" ADD CONSTRAINT "UserAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAnswer" ADD CONSTRAINT "UserAnswer_selectedChoiceId_fkey" FOREIGN KEY ("selectedChoiceId") REFERENCES "public"."Choice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserNodeProgress" ADD CONSTRAINT "UserNodeProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserNodeProgress" ADD CONSTRAINT "UserNodeProgress_knowledgeNodeId_fkey" FOREIGN KEY ("knowledgeNodeId") REFERENCES "public"."KnowledgeNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RepairTask" ADD CONSTRAINT "RepairTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RepairTask" ADD CONSTRAINT "RepairTask_knowledgeNodeId_fkey" FOREIGN KEY ("knowledgeNodeId") REFERENCES "public"."KnowledgeNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SRSItem" ADD CONSTRAINT "SRSItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SRSItem" ADD CONSTRAINT "SRSItem_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_Prerequisites" ADD CONSTRAINT "_Prerequisites_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."KnowledgeNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_Prerequisites" ADD CONSTRAINT "_Prerequisites_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."KnowledgeNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
