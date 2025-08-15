import bcrypt from "bcryptjs";
import { Effect } from "effect";
import { PrismaLive, findUserByEmail, createUser } from "@repo/db";
import { UserError } from "./error";

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
      return yield* Effect.fail(
        new UserError({
          message: "Email already exists",
          code: "EMAIL_EXISTS",
        }),
      );
    }

    const passwordHash = yield* Effect.promise(() => bcrypt.hash(password, 10));

    return yield* createUser({ email, password: passwordHash });
  }).pipe(Effect.provide(PrismaLive));
