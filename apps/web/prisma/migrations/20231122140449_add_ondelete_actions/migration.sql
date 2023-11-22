-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_uitjeId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_uitjeId_fkey";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_uitjeId_fkey" FOREIGN KEY ("uitjeId") REFERENCES "Uitje"("uitje_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_uitjeId_fkey" FOREIGN KEY ("uitjeId") REFERENCES "Uitje"("uitje_id") ON DELETE CASCADE ON UPDATE CASCADE;
