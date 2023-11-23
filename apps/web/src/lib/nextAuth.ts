import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

const prisma = new PrismaClient();

export const AuthOptions: NextAuthOptions = {
	secret: process.env.NEXT_AUTH_SECRET!,
	adapter: PrismaAdapter(prisma),
	callbacks: {
		session: ({ session, user }) => {
			session.userId = user.id;
			return session;
		}
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!
		})
	]
};

declare module "next-auth" {
	interface Session {
		/** The unique identifier of this user */
		userId: string;
	}
}
