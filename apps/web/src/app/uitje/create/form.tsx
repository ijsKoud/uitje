"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@uitje/ui/form";
import { Input } from "@uitje/ui/input";
import { MultiStepFormList, MultiStepFormNavigation } from "@/components/MultiStepForm";
import { Popover, PopoverContent, PopoverTrigger } from "@uitje/ui/popover";
import { Button } from "@uitje/ui/button";
import { cn } from "@uitje/utils";
import { CalendarIcon, Loader2Icon, PlusCircleIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@uitje/ui/calendar";
import UserField from "./user-field";
import CreateUserDialog from "@/components/create-user-dialog";
import { formSubmitHandler } from "./server-actions";
import { formSchema } from "./validator";
import { useRouter } from "next/navigation";
import { useToast } from "@uitje/ui/use-toast";
import { Switch } from "@uitje/ui/switch";

interface Props {
	userId: string;
	name: string;
}

const CreateForm: React.FC<Props> = ({ userId, name }) => {
	const router = useRouter();
	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			date: new Date(),
			private: true,
			participants: [{ userId, name }]
		}
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const uitje = await formSubmitHandler(values, userId);
			router.push(`/uitje/${uitje.uitjeId}`);
		} catch (error) {
			toast({ variant: "destructive", title: "Unable to create new uitje", description: "Something went wrong, please try again later." });
		}
	}

	async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
		if ((ev.nativeEvent as SubmitEvent).submitter?.id !== "uitje-create-form") return;
		await form.handleSubmit(onSubmit)(ev);
	}

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit}>
				<MultiStepFormList>
					<div className="space-y-8">
						<h1 className="-mb-4 text-8 font-bold leading-8">Create a new uitje</h1>

						<FormField
							key="create-field-1-page-1"
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input placeholder="7-day trip to London" {...field} />
									</FormControl>
									<FormDescription>What the event was about.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							key="create-field-2-page-1"
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													className={cn("justify-start text-left font-normal", !field.value && "text-muted-foreground")}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
												</Button>
											</FormControl>
										</PopoverTrigger>

										<PopoverContent className="w-auto p-0">
											<Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
										</PopoverContent>
									</Popover>
									<FormDescription>The day the event took place.</FormDescription>
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
					</div>

					<div className="space-y-8">
						<h1 className="-mb-4 text-8 font-bold leading-8">Add participanting people</h1>

						<FormField
							key="create-field-1-page-2"
							control={form.control}
							name="participants"
							render={({ field }) => (
								<FormItem>
									<div className="mb-4">
										<Input
											value={field.value.find((user) => user.userId === userId)?.name ?? ""}
											onChange={(ctx) =>
												field.onChange([
													{ userId, name: ctx.currentTarget.value },
													...field.value.filter((user) => user.userId !== userId)
												])
											}
										/>
										<FormDescription>Your own name for this uitje.</FormDescription>
									</div>

									{field.value
										.filter((user) => user.userId !== userId)
										.map((user, idx) => (
											<UserField
												key={idx}
												name={user.name}
												isInvite={Boolean(user.userId)}
												removeUser={() => field.onChange(field.value.filter((u) => u.name !== user.name))}
											/>
										))}

									<FormControl>
										<CreateUserDialog
											existingUsers={field.value ?? []}
											onChange={(user) => field.onChange([user, ...field.value])}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</MultiStepFormList>

				<MultiStepFormNavigation
					className="mt-8"
					submit={
						<Button
							key="create-form-submit-button"
							id="uitje-create-form"
							type="submit"
							disabled={form.formState.isSubmitting || !form.formState.isValid}
						>
							{form.formState.isSubmitting ? (
								<Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<PlusCircleIcon className="mr-2 h-4 w-4" />
							)}{" "}
							Create uitje
						</Button>
					}
				/>
			</form>
		</Form>
	);
};

export default CreateForm;
