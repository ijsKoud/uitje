/*
  Warnings:

  - Added the required column `uitjeId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "uitjeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_uitjeId_fkey" FOREIGN KEY ("uitjeId") REFERENCES "Uitje"("uitje_id") ON DELETE RESTRICT ON UPDATE CASCADE;
