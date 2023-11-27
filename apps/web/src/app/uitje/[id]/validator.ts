import { z } from "zod";

export const getTransactionSchema = (participants: string[]) => {
	return z.object({
		description: z.string({ required_error: "Description is a required field" }).max(128, "The maximum description length is 128 characters."),
		date: z.date(),

		participants: z
			.array(z.string().refine((arg) => participants.includes(arg), "valid participants must be selected"))
			.min(1, "0 participants is not possible."),
		paidBy: z.string({ required_error: "A valid participant must be selected" }),

		amount: z
			.number({ required_error: "Amount is a required field" })
			.min(0, "The amount cannot be negative (if someone is paying someone else back, change the participants accordingly)."),
		type: z.union([z.literal("total"), z.literal("split")])
	});
};
