import { Button } from "@uitje/ui/button";
import { CheckIcon } from "lucide-react";
import React from "react";

interface Props {
	isInvite: boolean;
	name: string;
	removeUser: () => void;
}

const UserField: React.FC<Props> = ({ isInvite, name, removeUser }) => {
	return (
		<Button
			variant="outline"
			onClick={removeUser}
			className="flex items-center justify-between w-full hocus:bg-destructive hocus:border-destructive"
		>
			<span>{name}</span>
			{isInvite && (
				<span className="flex items-center">
					<CheckIcon className="mr-1 h-4 w-4" /> Invite
				</span>
			)}
		</Button>
	);
};

export default UserField;
