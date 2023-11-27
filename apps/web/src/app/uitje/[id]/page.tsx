import { AuthOptions } from "@/lib/nextAuth";
import Uitje from "@/lib/structures/Uitje";
import User from "@/lib/structures/User";
import { format } from "date-fns";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import type React from "react";
import { TabsContent, TabsList, TabsTrigger } from "@uitje/ui/tabs";
import Tab from "./tab";
import TransactionDialog from "./transaction-dialog";
import { DataTable } from "./_table";
import { columns } from "./_table/columns";
import Overview from "./overview";
import { addParticipant } from "./server-actions";
import AddUser from "./_actions/add-user";
import Settings from "./_settings";

interface Props {
	params: { id: string };
	searchParams: { tab?: string | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const title = await Uitje.getTitle(params.id);
	return { title };
}

const Page: React.FC<Props> = async ({ params, searchParams }) => {
	const session = await getServerSession(AuthOptions);
	const user = User.getUserFromSession(session);

	const uitje = await Uitje.getUitje(params.id, user);
	if (!uitje) notFound();
	if (uitje.private && !uitje.isParticipant()) redirect(`/login?redirect=${encodeURIComponent(uitje.getUrl())}`);
	if (user && !uitje.isParticipant()) notFound();

	async function onSubmit(values: { name: string; userId?: string | undefined }) {
		"use server";
		await addParticipant(values, uitje!.uitjeId);
	}

	return (
		<div className="container flex min-h-[90vh] flex-col items-center justify-center space-y-8">
			<div className="mx-auto flex justify-between w-full max-w-5xl max-lg:flex-col items-center space-y-4">
				<div className="flex flex-col space-y-1">
					<h1 className="text-10 leading-9 font-semibold tracking-tight">{uitje.title}</h1>
					<p className="text-4 text-muted-foreground">Took place at {format(uitje.createdAt, "PPP")}</p>
				</div>

				{uitje.isParticipant() && (
					<div className="space-x-2">
						<AddUser onSubmit={onSubmit} users={uitje.participants.map((participant) => ({ name: participant.name }))} />

						<TransactionDialog
							uitjeId={uitje.uitjeId}
							user={uitje.getSelf()!.participantId}
							participants={uitje.participants.map((participant) => ({
								name: participant.name,
								participantId: participant.participantId
							}))}
						/>
					</div>
				)}
			</div>

			<Tab tab={searchParams.tab}>
				<div className="w-full max-lg:grid max-lg:place-items-center">
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="transactions">Transactions</TabsTrigger>
						{uitje.isParticipant() && <TabsTrigger value="settings">Settings</TabsTrigger>}
					</TabsList>
				</div>

				<TabsContent value="overview">
					<Overview
						participants={uitje.participants.map((participant) => participant.toJSON())}
						transactions={uitje.transactions.map((transaction) => transaction.toJSON())}
						title={uitje.title}
					/>
				</TabsContent>

				<TabsContent value="transactions">
					<DataTable
						columns={columns}
						isParticipant={uitje.isParticipant()}
						data={uitje.transactions.map((transaction) => ({
							...transaction.toJSON(),
							_participantslist: uitje.participants.map((participant) => participant.toJSON())
						}))}
					/>
				</TabsContent>
				<TabsContent value="settings">
					<Settings uitje={uitje} />
				</TabsContent>
			</Tab>
		</div>
	);
};

export default Page;
