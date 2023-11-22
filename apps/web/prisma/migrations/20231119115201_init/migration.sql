-- CreateTable
CREATE TABLE "Transaction" (
    "transaction_id" TEXT NOT NULL,
    "paid_by_id" TEXT NOT NULL,
    "description" VARCHAR(256),
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "Uitje" (
    "uitje_id" TEXT NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" VARCHAR(128) NOT NULL,

    CONSTRAINT "Uitje_pkey" PRIMARY KEY ("uitje_id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "participant_id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "uitjeId" TEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("participant_id")
);

-- CreateTable
CREATE TABLE "_ParticipantToTransaction" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transaction_id_key" ON "Transaction"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "Uitje_uitje_id_key" ON "Uitje"("uitje_id");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_participant_id_key" ON "Participant"("participant_id");

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantToTransaction_AB_unique" ON "_ParticipantToTransaction"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantToTransaction_B_index" ON "_ParticipantToTransaction"("B");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_uitjeId_fkey" FOREIGN KEY ("uitjeId") REFERENCES "Uitje"("uitje_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantToTransaction" ADD CONSTRAINT "_ParticipantToTransaction_A_fkey" FOREIGN KEY ("A") REFERENCES "Participant"("participant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantToTransaction" ADD CONSTRAINT "_ParticipantToTransaction_B_fkey" FOREIGN KEY ("B") REFERENCES "Transaction"("transaction_id") ON DELETE CASCADE ON UPDATE CASCADE;
