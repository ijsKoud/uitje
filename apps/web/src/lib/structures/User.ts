import { User as iUser } from "@prisma/client";
import prisma from "../prisma";
import Uitje from "./Uitje";
import { Session } from "next-auth";

export default class User {
	/** The username of the user */
	public name: string;

	/** The profile picture of the user */
	public picture: string | null;

	/** The unique identifier of the user */
	public readonly userId: string;

	public uitjes: Map<string, Uitje> = new Map();

	public constructor(data: Pick<iUser, "name" | "image" | "id">) {
		this.name = data.name ?? "";
		this.picture = data.image;
		this.userId = data.id;
	}

	public getUitjes(): Uitje[] {
		return [...this.uitjes.values()];
	}

	public toJSON() {
		return {
			name: this.name,
			picture: this.picture,
			userId: this.userId
		};
	}

	public static async getUser(userId: string) {
		const user = await prisma.user.findFirst({
			where: { id: userId },
			include: { Participant: true }
		});

		if (!user) return;

		const uitjes = await prisma.uitje.findMany({ where: { uitjeId: { in: user.Participant.map((participant) => participant.uitjeId) } } });
		const userInstance = new User(user);

		uitjes.forEach((data) => {
			const participant = user.Participant.find((participant) => participant.uitjeId === data.uitjeId)!;
			const uitje = new Uitje(data, [participant], userInstance);
			userInstance.uitjes.set(data.uitjeId, uitje);
		});

		return userInstance;
	}

	public static getUserFromSession(session: Session | null) {
		if (!session?.user) return null;
		return new User({ name: session.user.name || null, image: session.user.image || null, id: session.userId });
	}
}
