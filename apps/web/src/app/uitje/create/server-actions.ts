"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { formSchema } from "./validator";
import { MAX_UITJE_PARTICIPANTS } from "@/lib/constants/limits";
import { formatISO } from "date-fns";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/lib/nextAuth";

export async function formSubmitHandler(values: z.infer<typeof formSchema>) {
	const session = await getServerSession(AuthOptions);
	if (!session || !session.user) return null;

	const uitje = await prisma.uitje.create({
		data: {
			title: values.title,
			createdAt: formatISO(values.date),
			private: values.private,
			owner: session.userId,
			participants: {
				createMany: { data: values.participants.slice(0, MAX_UITJE_PARTICIPANTS) }
			}
		}
	});

	return uitje;
}
