import Participant from "./Participant";
import Transaction from "./Transaction";

export default class BalanceSheet {
	public readonly transactions: ReturnType<Transaction["toJSON"]>[];
	public readonly participants: ReturnType<Participant["toJSON"]>[];

	public constructor(transactions: BalanceSheet["transactions"], participants: BalanceSheet["participants"]) {
		this.transactions = transactions;
		this.participants = participants;
	}

	public getTotalCosts() {
		return this.transactions.map((transaction) => transaction.amount * transaction.participants.length).reduce((a, b) => a + b, 0);
	}

	public calculateAvarage(results: Record<string, Record<string, number>>) {
		const amounts = Object.entries(results)
			.map(([, tree]) => Object.entries(tree).map(([, amount]) => amount))
			.reduce((a, b) => [...a, ...b], []);
		return amounts.reduce((a, b) => a + b, 0) / this.participants.length;
	}

	public getResults() {
		const balanceTree = this.getBalanceTree();
		const results = this.calculateDifferences(balanceTree);

		return results;
	}

	public getStringResults(results: Record<string, Record<string, number>>, title: string) {
		let text = `💰 Uitje - ${title}\n\n`;
		const formatter = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "EUR"
		});

		text += Object.entries(results)
			.filter(([, tree]) => Object.values(tree).length > 0)
			.map(
				([id, tree], idx) =>
					`${this.getParticipant(id)?.name ?? `participant-${idx}`} receives:\n${Object.entries(tree)
						.map(
							([uId, amount], indx) =>
								`- ${formatter.format(amount)} from ${this.getParticipant(uId)?.name ?? `participant-${indx}${idx}`}`
						)
						.join("\n")}`
			)
			.join("\n\n");

		return text;
	}

	private getParticipant(id: string): BalanceSheet["participants"][0] | undefined {
		return this.participants.find((participant) => participant.participantId === id);
	}

	private getBalanceTree() {
		const balance: Record<string, Record<string, number>> = {};

		// Add all transactions to the balance tree
		for (const participant of this.participants) {
			// Make sure the total balance per transaction is correct
			const transactions = this.transactions.filter((transaction) => transaction.paidBy.participantId === participant.participantId);
			const costs = transactions.map((transaction) => this.getTransactionCosts(transaction)).reduce((a, b) => this.mergeTree(a, b), {});
			balance[participant.participantId] = costs;
		}

		return balance;
	}

	private getTransactionCosts(transaction: BalanceSheet["transactions"][0]) {
		const tree = transaction.participants.map((participant) => ({ [participant.participantId]: transaction.amount }));
		return tree.reduce((a, b) => ({ ...a, ...b }), {});
	}

	private mergeTree(treeA: Record<string, number>, treeB: Record<string, number>) {
		Object.keys(treeB).forEach((key) => {
			treeA[key] ??= 0;
			treeA[key] += treeB[key];
		});

		return treeA;
	}

	private calculateDifferences(balance: Record<string, Record<string, number>>) {
		const roundAmount = (amount: number) => Number(amount.toFixed(2));

		for (const [name, requested] of Object.entries(balance)) {
			Object.entries(requested).forEach(([user, amount]) => {
				const data = balance[user][name];
				if (data) {
					const newAmount = data - amount;
					if (newAmount < 0) {
						delete balance[user][name]; // Remove the participant receiving the amount
						balance[name][user] = -roundAmount(newAmount); // move negative results to the other participant
						return;
					}

					if (newAmount === 0) {
						delete balance[user][name];
						delete balance[name][user];
						return;
					}

					balance[user][name] = roundAmount(newAmount); // Make sure only 2 digits are returned
					delete balance[name][user];
				}
			});
		}

		return balance;
	}
}
