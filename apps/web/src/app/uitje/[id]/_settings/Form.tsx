"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@uitje/ui/form";
import { Input } from "@uitje/ui/input";
import { Switch } from "@uitje/ui/switch";
import { Button } from "@uitje/ui/button";
import { CogIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteUitje, updateUitje } from "../server-actions";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@uitje/ui/alert-dialog";

const schema = z.object({
	title: string({ required_error: "Description is a required field." }).max(128, "The maximum description length is 128 characters."),
	private: z.boolean()
});

interface Props {
	title: string;
	visibility: boolean;
	uitjeId: string;
}

const SettingsForm: React.FC<Props> = ({ title, visibility, uitjeId }) => {
	const router = useRouter();
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		values: { private: visibility, title }
	});

	async function onSubmit(values: z.infer<typeof schema>) {
		await updateUitje(values.title, values.private, uitjeId);
		router.refresh();
	}

	async function deleteUitjeHandler() {
		await deleteUitje(uitjeId);
		router.push("/uitjes");
	}

	return (
		<div>
			<h2 className="text-6 font-semibold">Configuration</h2>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Uitje Description</FormLabel>
								<FormControl>
									<Input placeholder="Dinner" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="private"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center justify-between rounded-lg border border-muted p-4">
								<div className="space-y-0.5">
									<FormLabel className="text-base">Public</FormLabel>
									<FormDescription>Allow people to view the uitje without an invite.</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={field.value ? false : true}
										onCheckedChange={(checked) => field.onChange(checked ? false : true)}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<div className="space-x-2">
						<Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
							{form.formState.isSubmitting ? (
								<Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<CogIcon className="mr-2 h-4 w-4" />
							)}{" "}
							Update
						</Button>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button type="button" variant="destructive">
									<Trash2Icon className="mr-2 h-4 w-4" /> Delete uitje
								</Button>
							</AlertDialogTrigger>

							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete the this uitje.
									</AlertDialogDescription>
								</AlertDialogHeader>

								<AlertDialogFooter>
									<AlertDialogCancel type="button">Cancel</AlertDialogCancel>
									<AlertDialogAction type="button" onClick={deleteUitjeHandler}>
										Continue
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default SettingsForm;
