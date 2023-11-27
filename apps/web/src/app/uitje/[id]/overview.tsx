"use client";

import BalanceSheet from "@/lib/structures/BalanceSheet";
import React, { useEffect, useState } from "react";
import ShareDialog from "./_actions/share-dialog";

interface Props {
	participants: BalanceSheet["participants"];
	transactions: BalanceSheet["transactions"];
	title: string;
}

const Overview: React.FC<Props> = ({ participants, transactions, title }) => {
	const [results, setResults] = useState<ReturnType<BalanceSheet["getResults"]>>({});
	const [stringResults, setStringResults] = useState("");
	const [totalCosts, setTotalCosts] = useState(0);
	const [avarage, setAvarage] = useState(0);

	useEffect(() => {
		const balanceSheet = new BalanceSheet(transactions, participants);
		const res = balanceSheet.getResults();
		setResults(res);
		setStringResults(balanceSheet.getStringResults(res, title));
		setTotalCosts(balanceSheet.getTotalCosts());
		setAvarage(balanceSheet.calculateAvarage(res));
	}, [participants, transactions, title]);

	return (
		<div className="flex justify-between max-lg:flex-col max-lg:items-center gap-y-4">
			<div className="space-y-4">
				{Object.entries(results)
					.filter(([, resultTree]) => Boolean(Object.keys(resultTree).length))
					.map(([id, resultTree]) => (
						<div key={id} className="min-w-[285px]">
							<p className="font-semibold text-5">
								<ParticipantTitle participant={participants.find((participant) => participant.participantId === id)} />{" "}
								<span>receives</span>
							</p>
							<ul className="list-disc list-inside">
								{Object.entries(resultTree).map(([uId, amount]) => (
									<li key={uId}>
										<span>
											<Amount amount={amount} /> from{" "}
										</span>
										<ParticipantTitle participant={participants.find((participant) => participant.participantId === uId)} />
									</li>
								))}
							</ul>
						</div>
					))}
			</div>

			<div className="space-y-1">
				<p>
					<span className="font-semibold">Total costs</span>: <Amount amount={totalCosts} />
				</p>
				<p>
					<span className="font-semibold">Avarage amount per participant</span>: <Amount amount={avarage} />
				</p>
				<ShareDialog results={stringResults} />
			</div>
		</div>
	);
};

const ParticipantTitle: React.FC<{ participant: Props["participants"][0] | undefined }> = ({ participant }) => {
	return <span>{participant?.name ?? ""}</span>;
};

const Amount: React.FC<{ amount: number }> = ({ amount }) => {
	const formatted = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "EUR"
	}).format(amount);
	return <span>{formatted}</span>;
};

export default Overview;
