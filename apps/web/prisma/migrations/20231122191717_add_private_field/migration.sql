/*
  Warnings:

  - You are about to drop the column `private` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "private";

-- AlterTable
ALTER TABLE "Uitje" ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT true;
