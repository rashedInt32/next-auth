import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { Effect } from "effect";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaLive, PrismaClient, findUserByEmail } from "@repo/db";

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials.email || !credentials.password) return null;
        const email = credentials.email as string;
        const password = credentials.password as string;

        const result = await Effect.runPromise(
          findUserByEmail(email).pipe(Effect.provide(PrismaLive)),
        );

        if (!result || !result.password) return null;

        const isValid = bcrypt.compare(password, result.password);
        if (!isValid) return { error: "password did not match" };

        return {
          email: result?.email ?? undefined,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user) session.user.id = token.sub!;
      return session;
    },
  },
});
