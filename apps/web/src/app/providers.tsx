"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@uitje/ui/toaster";
import React from "react";
import { SessionProvider } from "next-auth/react";

const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<SessionProvider>
			<ThemeProvider attribute="class" enableSystem defaultTheme="dark">
				<Toaster />
				{children}
			</ThemeProvider>
		</SessionProvider>
	);
};

export default Providers;
