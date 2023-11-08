import "../styles/globals.css";

import type React from "react";
import Providers from "./providers";
import { Inter } from "next/font/google";
import { Metadata } from "next";

const InterFont = Inter({ display: "swap", subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {};

const RootLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
	return (
		<html suppressHydrationWarning className="scroll-smooth scroll-p-[5rem]">
			<head></head>
			<body className="dark:bg-dark bg-white" style={InterFont.style}>
				<Providers>
					<div className="max-w-5xl m-auto px-4 pt-2">{children}</div>
				</Providers>
			</body>
		</html>
	);
};

export default RootLayout;
