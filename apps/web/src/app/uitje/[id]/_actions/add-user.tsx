"use client";

import CreateUserDialog from "@/components/create-user-dialog";
import { Button } from "@uitje/ui/button";
import { MailPlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
	onSubmit: (values: any) => Promise<void>;
	users: {
		name: string;
		userId?: string | undefined;
	}[];
}

const AddUser: React.FC<Props> = ({ onSubmit, users }) => {
	const router = useRouter();

	async function onSubmitHandler(values: any) {
		await onSubmit(values);
		router.refresh();
	}
	return (
		<CreateUserDialog onChange={onSubmitHandler} existingUsers={users}>
			<Button variant="secondary">
				<MailPlusIcon className="mr-2 h-4 w-4" /> Invite
			</Button>
		</CreateUserDialog>
	);
};

export default AddUser;
