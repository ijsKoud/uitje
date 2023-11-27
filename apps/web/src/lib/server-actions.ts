"use server";

import prisma from "@/lib/prisma";

export async function findUser(userId: string) {
	const user = await prisma.user.findFirst({ where: { id: userId } });
	return user;
}
