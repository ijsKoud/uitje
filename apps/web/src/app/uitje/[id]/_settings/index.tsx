import Uitje from "@/lib/structures/Uitje";
import React from "react";
import Participant from "./Participant";
import Form from "./Form";

interface Props {
	uitje: Uitje;
}

const Settings: React.FC<Props> = ({ uitje }) => {
	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-y-1 max-lg:items-center">
				<h2 className="text-6 font-semibold">Participants</h2>
				<div className="flex flex-wrap justify-between gap-y-2 max-lg:flex-nowrap max-lg:flex-col">
					{uitje.participants.map((participant) => (
						<Participant key={participant.participantId} {...participant.toJSON()} />
					))}
				</div>
			</div>

			<Form title={uitje.title} visibility={uitje.private} uitjeId={uitje.uitjeId} />
		</div>
	);
};

export default Settings;
