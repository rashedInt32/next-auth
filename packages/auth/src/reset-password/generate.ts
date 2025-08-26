import { findUserByEmail, PrismaError, PrismaServiceLive } from "@repo/db";
import { Effect, Layer } from "effect";
import { UserError } from "../error";
import { createPasswordResetToken, deletePasswordResetToken } from "@repo/db";
import { CryptoService, CryptoServiceLive } from "../service/jwt";

type User = {
  id: string;
  email: string;
  name?: string | null;
  password?: string;
};

/**
 *
 * @param email string
 * @param duration number in minute
 * @returns
 */
export const generateResetPasswordToken = (
  email: string,
  duration?: number,
): Effect.Effect<{ token: string }, UserError | PrismaError, never> =>
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

    yield* deletePasswordResetToken({ email: existingUser.email as string });

    const RESET_TOKEN_MINUTE = duration ?? 5;

    const cryptoService = yield* CryptoService;
    const token = yield* cryptoService.signJwt(
      {
        email: existingUser.email,
        id: existingUser.id,
      },
      `${RESET_TOKEN_MINUTE}m`,
    );

    yield* createPasswordResetToken({
      email: existingUser.email as string,
      token,
      expires: new Date(Date.now() + RESET_TOKEN_MINUTE * 60 * 1000),
    });
    return { token };
  }).pipe(
    Effect.provide(
      Layer.merge(
        CryptoServiceLive(process.env.NEXT_PUBLIC_CRYPTO_SECRET!),
        PrismaServiceLive,
      ),
    ),
    Effect.catchTag("JwtSignError", ({ cause }) =>
      Effect.fail(
        new UserError({
          code: "TOKEN_GENERATION_FAILED",
          message: `Failed to generate token ${cause}`,
        }),
      ),
    ),
  );
