import bcrypt from "bcryptjs";
import { Effect } from "effect";
import { PrismaLive, findUserByEmail, createUser } from "@repo/db";

export const registerUser = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) =>
  Effect.gen(function* () {
    const existing = yield* findUserByEmail(email);
    if (existing) {
      const err: Record<string, any> = new Error("Email already in use");
      err.code = "EMAIL_EXISTS";
      throw err;
    }

    const passwordHash = yield* Effect.promise(() => bcrypt.hash(password, 10));

    return yield* createUser({ email, passwordHash });
  }).pipe(Effect.provide(PrismaLive));
