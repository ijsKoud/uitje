import { Participant as iParticipant } from "@prisma/client";
import Uitje from "./Uitje";
import User from "./User";

export default class Participant {
	/** The unique identifier for this participant */
	public readonly participantId: string;

	/** The name of the participant */
	public name: string;

	/** The uitje this participant is associated to */
	public readonly uitje: Uitje;

	/** The user connected to this participant */
	public user: User | null;

	public constructor(data: iParticipant, uitje: Uitje, user?: User) {
		this.participantId = data.participantId;
		this.name = data.name;
		this.uitje = uitje;
		this.user = user || null;
	}

	public toJSON() {
		return {
			participantId: this.participantId,
			name: this.name,
			user: this.user?.toJSON(),
			uitjeId: this.uitje.uitjeId
		};
	}
}
