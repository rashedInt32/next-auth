// packages/auth/src/options.ts
import type { NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { Effect, Exit, Layer } from "effect";
import { findUserByEmail, PrismaLive } from "@repo/db";

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
        console.log("Authorize called with credentials:", credentials); // Debug
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const userEffect = findUserByEmail(email);
        const exit = await Effect.runPromiseExit(
          userEffect.pipe(Effect.provide(PrismaLive)),
        );

        if (Exit.isFailure(exit)) {
          console.log("User not found:", exit.cause);
          return null; // User not found
        }

        const user = exit.value;

        if (!user?.password) {
          console.log("User has no password set");
          return null; // No password set
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          console.log("Invalid password");
          return null; // Invalid password
        }

        console.log("User authenticated:", user);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
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
