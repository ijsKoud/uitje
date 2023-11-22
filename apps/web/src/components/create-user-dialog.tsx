"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@uitje/ui/dialog";
import { Button } from "@uitje/ui/button";
import { UserPlus2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@uitje/ui/form";
import { Input } from "@uitje/ui/input";
import { findUser } from "@/lib/server-actions";
import { useToast } from "@uitje/ui/use-toast";

interface Props {
	onChange: (user: { name: string; userId?: string | undefined }) => void;
	existingUsers: { name: string; userId?: string | undefined }[];
}

const CreateUserDialog: React.FC<Props> = ({ onChange, existingUsers }) => {
	const { toast } = useToast();
	const [open, setOpen] = useState(false);

	const formSchema = z.object({
		name: z
			.string({ required_error: "Name is a required field" })
			.max(128, "The maximum name length is 128 characters.")
			.refine((arg) => !existingUsers.some((user) => user.name === arg), "The name has to be unique"),
		userId: z.string().optional()
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema)
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!values.userId) {
			onChange({ name: values.name, userId: undefined });
			form.reset({ name: "", userId: "" });

			setOpen(false);
			return;
		}

		try {
			const user = await findUser(values.userId);
			if (!user) return form.setError("userId", { message: "An user with the provided id cannot be found." });

			onChange({ name: values.name, userId: user.id });
			form.reset({ name: "", userId: "" });
			setOpen(false);
		} catch (error) {
			toast({ variant: "destructive", title: "Failed to find an user", description: "Something went wrong, please try again later." });
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button type="button" variant="secondary">
					<UserPlus2Icon className="mr-2 h-4 w-4" /> Add participant
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogTitle>Add a participant</DialogTitle>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Daan Klarenbeek" {...field} />
									</FormControl>
									<FormDescription>The name of the participant</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="userId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>UserId</FormLabel>
									<FormControl>
										<Input placeholder="ijsKoud" {...field} />
									</FormControl>
									<FormDescription>You can provide an user id to link an external user to this uitje.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							key="create-user-dialog-form-submit-button"
							disabled={!form.formState.isValid || form.formState.isSubmitting}
						>
							<UserPlus2Icon className="mr-2 h-4 w-4" /> Add participant
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateUserDialog;
