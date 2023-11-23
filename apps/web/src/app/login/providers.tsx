"use client";

import { Icons } from "@/components/icons";
import { Button } from "@uitje/ui/button";
import { BuiltInProviderType } from "next-auth/providers/index";
import { LiteralUnion, signIn } from "next-auth/react";
import React from "react";

interface Props {
	redirect: string | undefined;
}

const providers: React.FC<Props> = ({ redirect }) => {
	const signInHandler = (provider: LiteralUnion<BuiltInProviderType>) => () => signIn(provider, { callbackUrl: redirect || "/uitjes" });

	return (
		<div className="space-y-2">
			<Button variant="outline" className="w-full" onClick={signInHandler("google")}>
				<Icons.google className="mr-2 h-4 w-4" /> Google
			</Button>

			<Button variant="outline" className="w-full" onClick={signInHandler("github")}>
				<Icons.gitHub className="mr-2 h-4 w-4" /> GitHub
			</Button>
		</div>
	);
};

export default providers;
