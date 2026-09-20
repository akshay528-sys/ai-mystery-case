-- CreateTable
CREATE TABLE "MysteryCase" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "suspects" JSONB NOT NULL,
    "clues" JSONB NOT NULL,
    "solution" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER NOT NULL,

    CONSTRAINT "MysteryCase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MysteryCase" ADD CONSTRAINT "MysteryCase_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
