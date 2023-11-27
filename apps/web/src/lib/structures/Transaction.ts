import { Transaction as iTransaction, Participant as iParticipant } from "@prisma/client";
import Participant from "./Participant";

export default class Transaction {
	/** The unique identifier of this transaction */
	public readonly transactionId: string;

	/** The date the transaction was made */
	public paidAt: Date;

	/** The amount that was paid per participant */
	public amount: number;

	/** The transaction description */
	public description: string;

	public paidBy: Participant;

	public participants: Participant[];

	public constructor(data: iTransaction & { participants: iParticipant[] }, participants: Participant[]) {
		this.transactionId = data.transactionId;
		this.amount = data.amount;
		this.description = data.description;
		this.paidAt = data.date;

		this.paidBy = participants.find((participant) => participant.participantId === data.paidById)!;
		this.participants = participants.filter((participant) => data.participants.some((ppt) => ppt.participantId === participant.participantId));
	}

	public toJSON() {
		return {
			transactionId: this.transactionId,
			uitjeId: this.paidBy.uitje.uitjeId,
			paidAt: this.paidAt,
			amount: this.amount,
			description: this.description,
			paidBy: this.paidBy.toJSON(),
			participants: this.participants.map((participant) => participant.toJSON())
		};
	}
}
