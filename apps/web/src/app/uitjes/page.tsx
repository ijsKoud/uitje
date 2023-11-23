import { AuthOptions } from "@/lib/nextAuth";
import User from "@/lib/structures/User";
import { Button } from "@uitje/ui/button";
import { format } from "date-fns";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import type React from "react";

export const metadata: Metadata = {
	title: "List of all your uitjes"
};

const Page: React.FC = async () => {
	const session = await getServerSession(AuthOptions);
	if (!session) redirect("/login");

	const user = await User.getUser(session.userId);
	if (!user) redirect("/login");

	return (
		<div className="container flex min-h-[90vh] flex-col items-center justify-center">
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">Welcome back {user.name}</h1>
					<p className="text-sm text-muted-foreground">Here is a list of all your uitjes.</p>
				</div>

				<div className="space-y-4">
					{user.getUitjes().map((uitje) => (
						<Button variant="outline" key={uitje.uitjeId} className="w-full flex items-center justify-between h-14" asChild>
							<Link href={uitje.getUrl()}>
								<div className="flex flex-col">
									<span>{uitje.title}</span>
									<span className="font-light">{format(uitje.createdAt, "PPP")}</span>
								</div>
								<div className="flex flex-col items-end">
									<span className="font-light">{uitje.isOwner() ? "Owner" : "Participant"}</span>
									<span className="font-light">
										{uitje.private ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
										<span className="sr-only">{uitje.private ? "private" : "public"}</span>
									</span>
								</div>
							</Link>
						</Button>
					))}
				</div>
			</div>
		</div>
	);
};

export default Page;
