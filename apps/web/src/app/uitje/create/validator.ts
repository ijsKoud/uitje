import { MAX_UITJE_PARTICIPANTS } from "@/lib/constants/limits";
import { z } from "zod";

export const formSchema = z.object({
	title: z.string({ required_error: "Title is a required field" }).max(128, "The maximum title length is 128 characters."),
	date: z.date({ required_error: "Date is a required field" }),
	private: z.boolean(),

	participants: z
		.array(
			z.object({
				name: z.string({ required_error: "Name is a required field" }).max(128, "The maximum name length is 128 characters."),
				userId: z.string().optional()
			})
		)
		.max(MAX_UITJE_PARTICIPANTS - 1, `The maximum amount of participants is ${MAX_UITJE_PARTICIPANTS}`)
});
