import { Icons } from "@/components/icons";
import { Metadata } from "next";
import type React from "react";
import Providers from "./providers";

export const metadata: Metadata = {
	title: "Login to your account"
};

interface Props {
	searchParams: { redirect?: string | undefined };
}

const Page: React.FC<Props> = ({ searchParams }) => {
	return (
		<div className="container flex min-h-[90vh] flex-col items-center justify-center">
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<Icons.logo className="mx-auto h-6 w-6" />
					<h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
					<p className="text-sm text-muted-foreground">Sign in with one of the providers</p>
				</div>

				<Providers redirect={searchParams.redirect} />
			</div>
		</div>
	);
};

export default Page;
