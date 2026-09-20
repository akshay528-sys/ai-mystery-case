-- CreateTable
CREATE TABLE "Interrogation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "caseId" INTEGER NOT NULL,
    "suspect" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interrogation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Interrogation" ADD CONSTRAINT "Interrogation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interrogation" ADD CONSTRAINT "Interrogation_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "MysteryCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
