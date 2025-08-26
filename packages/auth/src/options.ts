import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Effect, Exit } from "effect";
import { findUserByEmail, PrismaServiceLive } from "@repo/db";

const prisma = new PrismaClient();

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (email || password) {
          return null;
        }

        const credentialsEffect = Effect.gen(function* () {
          const user = yield* findUserByEmail(credentials.email as string);
          if (!user?.password) return null;

          const isValie = yield* Effect.tryPromise(() =>
            bcrypt.compare(credentials.password! as string, user?.password!),
          );

          if (!isValie) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        }).pipe(Effect.provide(PrismaServiceLive));

        const exit = await Effect.runPromiseExit(credentialsEffect);

        return Exit.match(exit, {
          onFailure: () => null,
          onSuccess: (user) => user,
        });
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  debug: true, // Enable debug logs for next-auth
};
