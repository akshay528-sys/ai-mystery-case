-- CreateTable
CREATE TABLE "CaseAttempt" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "caseId" INTEGER NOT NULL,
    "suspect" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseAttempt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CaseAttempt" ADD CONSTRAINT "CaseAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseAttempt" ADD CONSTRAINT "CaseAttempt_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "MysteryCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
