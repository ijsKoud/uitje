"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@uitje/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@uitje/ui/dialog";
import { useToast } from "@uitje/ui/use-toast";
import { CalendarIcon, Loader2Icon, WalletIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { getTransactionSchema } from "../validator";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@uitje/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@uitje/ui/popover";
import { cn } from "@uitje/utils";
import { format } from "date-fns";
import { Calendar } from "@uitje/ui/calendar";
import { Input } from "@uitje/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@uitje/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@uitje/ui/dropdown-menu";
import { ScrollArea } from "@uitje/ui/scroll-area";
import { useRouter } from "next/navigation";
import Transaction from "@/lib/structures/Transaction";
import { transactionEditFormHandler } from "../server-actions";

interface Props {
	participants: { name: string; participantId: string }[];
	transaction: ReturnType<Transaction["toJSON"]>;
}

const EditDialog: React.FC<Props> = ({ participants, transaction }) => {
	const [open, setOpen] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<z.infer<ReturnType<typeof getTransactionSchema>>>({
		resolver: zodResolver(getTransactionSchema(participants.map((participant) => participant.participantId))),
		defaultValues: {
			participants: transaction.participants.map((participant) => participant.participantId),
			description: transaction.description,
			amount: transaction.amount,
			paidBy: transaction.paidBy.participantId,
			date: transaction.paidAt,
			type: "split"
		}
	});

	async function onSubmit(values: z.infer<ReturnType<typeof getTransactionSchema>>) {
		try {
			await transactionEditFormHandler(values, transaction.transactionId);
			router.refresh();
			setOpen(false);
		} catch (err) {
			console.error(err);
			toast({ variant: "destructive", title: "Unable to add transaction", description: "Something went wrong, please try again later." });
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild onSelect={(ev) => ev.preventDefault()}>
				<DropdownMenuItem>Edit transaction</DropdownMenuItem>
			</DialogTrigger>

			<DialogContent>
				<DialogTitle>Edit transaction &apos;{transaction.description}&apos;</DialogTitle>

				<ScrollArea className="max-h-[80vh]">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Input placeholder="Mc Donalds for Dinner" {...field} />
										</FormControl>
										<FormDescription>What the transaction was about.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
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
										<FormDescription>The day the transaction was made.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Amount</FormLabel>
										<div className="flex items-center gap-x-2">
											<FormControl>
												<Input
													placeholder="€35.00"
													type="number"
													{...field}
													onChange={(ctx) => field.onChange(Number(ctx.currentTarget.value))}
												/>
											</FormControl>

											<FormField
												control={form.control}
												name="type"
												render={({ field }) => (
													<FormItem className="w-full">
														<Select value={field.value} onValueChange={field.onChange}>
															<FormControl>
																<SelectTrigger>
																	<SelectValue />
																</SelectTrigger>
															</FormControl>

															<SelectContent>
																<SelectItem value="total">Total</SelectItem>
																<SelectItem value="split">Per person</SelectItem>
															</SelectContent>
														</Select>
													</FormItem>
												)}
											/>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="paidBy"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormLabel>Paid by</FormLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>

											<SelectContent>
												{participants.map((participant) => (
													<SelectItem key={participant.participantId} value={participant.participantId}>
														{participant.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										<FormDescription>The participant that paid for this transaction.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="participants"
								render={({ field }) => (
									<FormItem className="w-full flex flex-col">
										<FormLabel>Participants</FormLabel>

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="outline" className="w-full justify-start gap-x-1">
													<span>Selected: </span>
													<span>
														{field.value
															.map((id) => participants.find((participant) => participant.participantId === id)?.name)
															.filter(Boolean)
															.join(", ") || "none"}
													</span>
												</Button>
											</DropdownMenuTrigger>

											<DropdownMenuContent>
												{participants.map((participant) => (
													<DropdownMenuCheckboxItem
														onSelect={(ev) => ev.preventDefault()} // prevents dropdown from closing after selecting
														key={participant.participantId}
														checked={field.value.includes(participant.participantId)}
														onCheckedChange={(value) =>
															field.onChange(
																value
																	? [...field.value, participant.participantId]
																	: field.value.filter((id) => id !== participant.participantId)
															)
														}
													>
														{participant.name}
													</DropdownMenuCheckboxItem>
												))}
											</DropdownMenuContent>
										</DropdownMenu>

										<FormDescription>The participants that were part of this transaction.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid}>
								{form.formState.isSubmitting ? (
									<Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<WalletIcon className="mr-2 h-4 w-4" />
								)}{" "}
								Edit transaction
							</Button>
						</form>
					</Form>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};

export default EditDialog;
