"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table";
import { Button } from "@uitje/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@uitje/ui/dropdown-menu";
import { Input } from "@uitje/ui/input";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@uitje/ui/table";
import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DeleteDialog from "../_actions/delete-dialog";
import { AlertDialogTrigger } from "@uitje/ui/alert-dialog";
import { deleteTransactionsHandler } from "../server-actions";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	isParticipant: boolean;
}

export function DataTable<TData, TValue>({ columns, data, isParticipant }: DataTableProps<TData, TValue>) {
	const router = useRouter();
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		onRowSelectionChange: setRowSelection,
		onColumnVisibilityChange: setColumnVisibility,
		onColumnFiltersChange: setColumnFilters,
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getCoreRowModel: getCoreRowModel(),
		state: {
			rowSelection,
			columnFilters,
			columnVisibility,
			sorting
		}
	});

	useEffect(() => {
		table.getColumn("actions")?.toggleVisibility(isParticipant);
		table.getColumn("select")?.toggleVisibility(isParticipant);
	}, [table, isParticipant]);

	useEffect(() => {
		const params = new URLSearchParams();
		const sort = sorting[0];
		const filter = columnFilters[0];

		params.set("tab", "transactions");
		if (filter) params.set("filter", filter.value as string);
		if (sort) {
			params.set("sort", sort.id);
			params.set("order", sort.desc ? "desc" : "asc");
		}

		router.push(`?${params.toString()}`);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sorting, columnFilters]);

	async function deleteSelectedTransactions() {
		const { rows } = table.getFilteredSelectedRowModel();
		const id: string = (rows[0].original as any).uitjeId;

		const selected: string[] = rows.map((row) => (row.original as any).transactionId);
		await deleteTransactionsHandler(selected, id);
		router.refresh();
	}

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<Input
						placeholder="Filter transactions..."
						value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
						onChange={(event) => table.getColumn("description")?.setFilterValue(event.target.value)}
						className="max-w-sm"
					/>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Columns <ChevronDownIcon className="ml-4 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.filter((column) => (isParticipant ? true : !["actions", "select"].includes(column.id)))
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className="capitalize"
										checked={column.getIsVisible()}
										onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="rounded-md border border-muted">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={`row-${row.id}`} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={`row-${row.id}-cell-${cell.id}`}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{isParticipant && (
				<div className="flex justify-between">
					<div className="flex-1 text-sm text-muted-foreground">
						{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
					</div>

					<DeleteDialog onSubmit={deleteSelectedTransactions}>
						<AlertDialogTrigger asChild>
							<Button variant="destructive" disabled={table.getFilteredSelectedRowModel().rows.length <= 0}>
								Delete selected transactions
							</Button>
						</AlertDialogTrigger>
					</DeleteDialog>
				</div>
			)}
		</div>
	);
}
