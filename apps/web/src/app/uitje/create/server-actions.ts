"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { formSchema } from "./validator";
import { MAX_UITJE_PARTICIPANTS } from "@/lib/constants/limits";

export async function formSubmitHandler(values: z.infer<typeof formSchema>, userId: string) {
	const uitje = await prisma.uitje.create({
		data: {
			title: values.title,
			createdAt: values.date,
			private: values.private,
			owner: userId,
			participants: {
				createMany: { data: values.participants.slice(0, MAX_UITJE_PARTICIPANTS) }
			}
		}
	});

	return uitje;
}
