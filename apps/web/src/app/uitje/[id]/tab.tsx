"use client";

import { Tabs } from "@uitje/ui/tabs";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
	tab: string | undefined;
}

const Tab: React.FC<React.PropsWithChildren<Props>> = ({ tab, children }) => {
	const router = useRouter();

	return (
		<Tabs defaultValue="overview" value={tab} onValueChange={(newTab) => router.push(`?tab=${newTab}`)} className="w-full">
			{children}
		</Tabs>
	);
};

export default Tab;
