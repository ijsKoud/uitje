"use client";

import ParticipantInstance from "@/lib/structures/Participant";
import { Avatar, AvatarFallback } from "@uitje/ui/avatar";
import { Button } from "@uitje/ui/button";
import React from "react";
import { removeParticipant } from "../server-actions";
import { useRouter } from "next/navigation";

const Participant: React.FC<ReturnType<ParticipantInstance["toJSON"]>> = ({ name, participantId, uitjeId }) => {
	const avatarCharacter = name.split("")[0];
	const router = useRouter();

	async function onClick() {
		await removeParticipant(participantId, uitjeId);
		router.refresh();
	}

	return (
		<div className="flex items-center justify-between min-w-[320px]">
			<div className="flex items-center gap-x-2">
				<Avatar>
					<AvatarFallback>{avatarCharacter}</AvatarFallback>
				</Avatar>

				<span className="text-5">{name}</span>
			</div>

			<Button variant="destructive" onClick={onClick}>
				Remove
			</Button>
		</div>
	);
};

export default Participant;
