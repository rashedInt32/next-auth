import NextAuth from "next-auth";
import { authOptions } from "./options";
import { signIn, signOut } from "next-auth/react";

export const { handlers, auth } = NextAuth(authOptions);

export { signIn, signOut };

// Route handlers for Next.js App Router
export const GET = handlers.GET;
export const POST = handlers.POST;
