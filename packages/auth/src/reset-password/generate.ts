import { findUserByEmail, PrismaLive } from "@repo/db";
import { Console, Effect } from "effect";
import { UserError } from "../error";
import { SignJWT } from "jose";
import { createPasswordResetToken } from "../../../db/dist/query";

const secret = new TextEncoder().encode(
  "cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2",
);
const alg = "HS256";

export const generateResetPasswordToken = (email: string) =>
  Effect.gen(function* () {
    const existingUser = yield* findUserByEmail(email);
    if (!existingUser) {
      return yield* Effect.fail(
        new UserError({
          code: "USER_NOT_FOUND",
          message: "We could not find a user with that email address.",
        }),
      );
    }

    yield* Console.log(existingUser);

    const signToken = yield* Effect.promise(() =>
      new SignJWT({
        email: existingUser.email,
        id: existingUser.id,
      })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret),
    );

    const expires = new Date(Date.now() + 60 * 1000);

    return yield* createPasswordResetToken({
      email: existingUser.email as string,
      token: signToken,
      expires,
    });
  }).pipe(Effect.provide(PrismaLive));
