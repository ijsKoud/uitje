import { Uitje as iUitje, Participant as iParticipant } from "@prisma/client";
import User from "./User";
import Participant from "./Participant";
import Transaction from "./Transaction";
import prisma from "../prisma";

export default class Uitje {
	/** The unique identifier of the uitje */
	public readonly uitjeId: string;

	/** The creation date of this uitje */
	public readonly createdAt: Date;

	/** The description of this uitje */
	public title: string;

	/** Whether the uitje is private or not */
	public private: boolean;

	/** The participants of this uitje */
	public participants: Participant[];

	/** The transactions for this uitje */
	public transactions: Transaction[] = [];

	/** The owner of this uitje */
	public owner?: Participant;
	public ownerId: string;

	private _user?: Participant;

	public constructor(data: iUitje, participants: iParticipant[], user?: User | undefined) {
		this.uitjeId = data.uitjeId;
		this.createdAt = data.createdAt;
		this.title = data.title;
		this.ownerId = data.owner;
		this.private = data.private;

		this.participants = participants.map((data) => new Participant(data, this, data.userId === user?.userId ? user : undefined));
		this._user = this.participants.find((participant) => participant.user && participant.user.userId === user?.userId);
		this.owner = this.participants.find((participant) => participant.participantId === data.owner);
	}

	public async fetchTransactions() {
		const transactions = await prisma.transaction.findMany({ where: { uitjeId: this.uitjeId }, include: { participants: true } });
		this.transactions = transactions.map((data) => new Transaction(data, this.participants));
	}

	public isOwner(): boolean {
		return this.ownerId === this._user?.participantId;
	}

	public getUrl(): string {
		return `/uitje/${this.uitjeId}`;
	}

	public getSelf() {
		return this._user || null;
	}

	public isParticipant() {
		if (!this._user) return false;
		return this.participants.some((participant) => participant.participantId === this._user?.participantId);
	}

	public static async getUitje(uitjeId: string, user?: User | undefined | null) {
		const uitje = await prisma.uitje.findFirst({ where: { uitjeId }, include: { participants: true } });
		if (!uitje) return null;

		const uitjeInstance = new Uitje(uitje, uitje.participants, user || undefined);
		await uitjeInstance.fetchTransactions();

		return uitjeInstance;
	}

	public static async getTitle(uitjeId: string) {
		const uitje = await prisma.uitje.findFirst({ where: { uitjeId }, select: { title: true } });
		return uitje?.title || null;
	}
}

export interface CreateTransactionData {
	description: string;
	date: Date;
	amount: number;
	participants: string[];
	paidBy: string;
}
