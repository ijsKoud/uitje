"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { getTransactionSchema } from "./validator";
import { MAX_UITJE_TRANSACTIONS } from "@/lib/constants/limits";
import { formatISO } from "date-fns";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/nextAuth";

export async function transactionCreateFormHandler(values: z.infer<ReturnType<typeof getTransactionSchema>>, uitjeId: string) {
	const session = await getServerSession(AuthOptions);
	if (!session || !session.user) return;

	const count = await prisma.transaction.count({ where: { uitjeId } });
	if (count >= MAX_UITJE_TRANSACTIONS) throw new Error("Exceeding transaction limit.");

	const participant = await prisma.participant.findFirst({ where: { uitjeId, userId: session.userId } });
	if (!participant) return;

	const amount = values.type === "total" ? Number((values.amount / values.participants.length).toFixed(2)) : values.amount;
	await prisma.transaction.create({
		data: {
			amount,
			uitjeId,
			date: formatISO(values.date),
			description: values.description,
			paidById: values.paidBy,
			participants: { connect: values.participants.map((participantId) => ({ participantId })) }
		}
	});
}

export async function transactionEditFormHandler(values: z.infer<ReturnType<typeof getTransactionSchema>>, transactionId: string) {
	const session = await getServerSession(AuthOptions);
	if (!session || !session.user) return;

	const transaction = await prisma.transaction.findFirst({ where: { transactionId } });
	if (!transaction) return;

	const participant = await prisma.participant.findFirst({ where: { uitjeId: transaction.uitjeId, userId: session.userId } });
	if (!participant) return;

	const amount = values.type === "total" ? Number((values.amount / values.participants.length).toFixed(2)) : values.amount;
	await prisma.transaction.update({
		where: { transactionId, uitjeId: transaction.uitjeId },
		data: {
			amount,
			date: formatISO(values.date),
			description: values.description,
			paidById: values.paidBy,
			participants: { set: values.participants.map((participantId) => ({ participantId })) }
		}
	});
}

export async function deleteTransactionHandler(transactionId: string, uitjeId: string) {
	const session = await getServerSession(AuthOptions);
	if (!session || !session.user) return;

	const participant = await prisma.participant.findFirst({ where: { uitjeId, userId: session.userId } });
	if (!participant) return;

	await prisma.transaction.delete({ where: { transactionId, uitjeId } });
}

export async function deleteTransactionsHandler(transactionIds: string[], uitjeId: string) {
	const session = await getServerSession(AuthOptions);
	if (!session || !session.user) return;

	const participant = await prisma.participant.findFirst({ where: { uitjeId, userId: session.userId } });
	if (!participant) return;

	await prisma.transaction.deleteMany({ where: { transactionId: { in: transactionIds }, uitjeId } });
}

export async function addParticipant(values: { name: string; userId?: string | undefined }, uitjeId: string) {
	const session = await getServerSession(AuthOptions);
	if (!session || !session.user) return;

	const participant = await prisma.participant.findFirst({ where: { uitjeId, userId: session.userId } });
	if (!participant) return;

	await prisma.participant.create({ data: { ...values, uitjeId } });
}

export async function removeParticipant(participantId: string, uitjeId: string) {
	const session = await getServerSession(AuthOptions);
	if (!session || !session.user) return;

	const participant = await prisma.participant.findFirst({ where: { uitjeId, userId: session.userId } });
	if (!participant) return;

	await prisma.participant.delete({ where: { participantId, uitjeId } });
}

export async function updateUitje(title: string, visibility: boolean, uitjeId: string) {
	const session = await getServerSession(AuthOptions);
	if (!session || !session.user) return;

	const participant = await prisma.participant.findFirst({ where: { uitjeId, userId: session.userId } });
	if (!participant) return;

	await prisma.uitje.update({ where: { uitjeId }, data: { title, private: visibility } });
}

export async function deleteUitje(uitjeId: string) {
	const session = await getServerSession(AuthOptions);
	if (!session || !session.user) return;

	const participant = await prisma.participant.findFirst({ where: { uitjeId, userId: session.userId } });
	if (!participant) return;

	await prisma.uitje.delete({ where: { uitjeId } });
}
