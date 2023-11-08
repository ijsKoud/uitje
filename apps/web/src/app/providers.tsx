"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@balance/ui/toaster";
import React from "react";

const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<ThemeProvider attribute="class" enableSystem defaultTheme="dark">
			<Toaster />
			{children}
		</ThemeProvider>
	);
};

export default Providers;
