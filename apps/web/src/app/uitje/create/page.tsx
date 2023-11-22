import { MultiStepFormWrapper, MultiStepFormProgressbar, MultiStepFormProgressbarItem } from "@/components/MultiStepForm";
import { Metadata } from "next";
import type React from "react";
import CreateForm from "./form";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AuthOptions } from "@/lib/nextAuth";
import { Skeleton } from "@uitje/ui/skeleton";

export const metadata: Metadata = {
	title: "Create a new uitje"
};

const Page: React.FC = () => {
	return (
		<div className="grid place-items-center w-full min-h-[90vh]">
			<MultiStepFormWrapper className="w-80">
				<MultiStepFormProgressbar className="justify-evenly">
					<MultiStepFormProgressbarItem step={0}>Details</MultiStepFormProgressbarItem>
					<MultiStepFormProgressbarItem step={1}>People</MultiStepFormProgressbarItem>
				</MultiStepFormProgressbar>

				<Suspense fallback={<Loading />}>
					<Form />
				</Suspense>
			</MultiStepFormWrapper>
		</div>
	);
};

const Loading: React.FC = () => {
	return (
		<div className="space-y-8">
			<div className="space-y-1">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>

			<div className="space-y-1">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>
		</div>
	);
};

const Form: React.FC = async () => {
	const session = await getServerSession(AuthOptions);
	if (!session) redirect("/login?redirect=/uitje/create");

	return <CreateForm userId={session.userId} name={session.user?.name ?? ""} />;
};

export default Page;
