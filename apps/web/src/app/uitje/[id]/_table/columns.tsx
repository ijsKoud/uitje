/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Participant from "@/lib/structures/Participant";
import Transaction from "@/lib/structures/Transaction";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@uitje/ui/tooltip";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@uitje/ui/avatar";
import { Checkbox } from "@uitje/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@uitje/ui/dropdown-menu";
import { Button } from "@uitje/ui/button";
import { ArrowDown01Icon, ArrowDownAzIcon, ArrowUpZaIcon, ArrowUp01Icon, MoreHorizontalIcon } from "lucide-react";
import DeleteDialog from "../_actions/delete-dialog";
import { AlertDialogTrigger } from "@uitje/ui/alert-dialog";
import { deleteTransactionHandler } from "../server-actions";
import { useRouter } from "next/navigation";
import EditDialog from "../_actions/edit-dialog";

type JSONParticipant = ReturnType<Participant["toJSON"]>;

export const columns: ColumnDef<ReturnType<Transaction["toJSON"]> & { _participantslist: { name: string; participantId: string }[] }>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(Boolean(value))}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(Boolean(value))} aria-label="Select row" />
		),
		enableSorting: false
	},
	{
		accessorKey: "description",
		header: ({ column }) => {
			const sorted = column.getIsSorted();
			if (!sorted)
				return (
					<Button variant="ghost" onClick={() => column.toggleSorting(false)}>
						Description
					</Button>
				);

			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Description
					{column.getIsSorted() === "asc" ? <ArrowDownAzIcon className="ml-2 h-4 w-4" /> : <ArrowUpZaIcon className="ml-2 h-4 w-4" />}
				</Button>
			);
		},
		cell: ({ row }) => {
			const value = row.getValue("description") as string;
			return <span className="pl-4">{value}</span>;
		}
	},
	{
		accessorKey: "paidAt",
		header: ({ column }) => {
			const sorted = column.getIsSorted();
			if (!sorted)
				return (
					<Button variant="ghost" onClick={() => column.toggleSorting(false)}>
						Paid At
					</Button>
				);

			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Paid At
					{column.getIsSorted() === "asc" ? <ArrowDown01Icon className="ml-2 h-4 w-4" /> : <ArrowUp01Icon className="ml-2 h-4 w-4" />}
				</Button>
			);
		},
		cell: ({ row }) => {
			const value = row.getValue("paidAt") as Date;
			return <span className="pl-4">{format(value, "PPP")}</span>;
		}
	},
	{
		accessorKey: "amount",
		header: ({ column }) => {
			const sorted = column.getIsSorted();
			if (!sorted)
				return (
					<Button variant="ghost" onClick={() => column.toggleSorting(false)}>
						Amount
					</Button>
				);

			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Amount
					{column.getIsSorted() === "asc" ? <ArrowDown01Icon className="ml-2 h-4 w-4" /> : <ArrowUp01Icon className="ml-2 h-4 w-4" />}
				</Button>
			);
		},
		cell: ({ row }) => {
			const value = row.getValue("amount") as number;
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "EUR"
			}).format(value);
			return <span className="pl-4">{formatted}</span>;
		}
	},
	{
		accessorKey: "paidBy",
		header: "Paid By",
		cell: ({ row }) => {
			const participant = row.getValue("paidBy") as JSONParticipant;
			return <span>{participant.name}</span>;
		}
	},
	{
		accessorKey: "participants",
		header: "Participants",
		cell: ({ row }) => {
			const participants = row.getValue("participants") as JSONParticipant[];
			return (
				<div className="flex relative w-full">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								{participants.slice(0, 5).map((participant, idx) => (
									<Avatar
										key={participant.participantId}
										className="absolute -top-5 border border-background"
										style={{ zIndex: 7 - idx, transform: `translateX(calc(20px * ${idx}))` }}
									>
										<AvatarFallback>{participant.name.split("")[0]}</AvatarFallback>
									</Avatar>
								))}

								{participants.length > 5 && (
									<Avatar
										className="absolute -top-5 border border-background"
										style={{ zIndex: 1, transform: "translateX(calc(20px * 5))" }}
									>
										<AvatarFallback>...</AvatarFallback>
									</Avatar>
								)}
							</TooltipTrigger>

							<TooltipContent>{participants.map((participant) => participant.name).join(", ")}</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			);
		}
	},
	{
		id: "actions",
		enableSorting: false,
		cell: ({ row }) => {
			const transaction = row.original;
			const router = useRouter();

			async function deleteTransaction() {
				await deleteTransactionHandler(transaction.transactionId, transaction.uitjeId);
				router.refresh();
			}

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontalIcon className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>

						<DeleteDialog key={`dialog-delete-${row.index}`} onSubmit={deleteTransaction}>
							<AlertDialogTrigger asChild onSelect={(ev) => ev.preventDefault()}>
								<DropdownMenuItem>Delete transaction</DropdownMenuItem>
							</AlertDialogTrigger>
						</DeleteDialog>

						<EditDialog key={`dialog-edit-${row.index}`} transaction={transaction} participants={transaction._participantslist} />
					</DropdownMenuContent>
				</DropdownMenu>
			);
		}
	}
];
