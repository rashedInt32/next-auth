import { findUserByEmail, PrismaLive } from "@repo/db";
import { Effect, Layer } from "effect";
import { UserError } from "../error";
import { createPasswordResetToken } from "@repo/db";
import { CryptoService, CryptoServiceLive } from "../service/jwt";

/**
 *
 * @param email string
 * @param duration number in minute
 * @returns
 */
export const generateResetPasswordToken = (email: string, duration?: number) =>
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

    const RESET_TOKEN_MINUTE = duration ?? 1;

    const cryptoService = yield* CryptoService;
    const token = yield* cryptoService.signJwt(
      {
        email: existingUser.email,
        id: existingUser.id,
      },
      `${RESET_TOKEN_MINUTE}m`,
    );

    return yield* createPasswordResetToken({
      email: existingUser.email as string,
      token,
      expires: new Date(Date.now() + RESET_TOKEN_MINUTE * 60 * 1000),
    });
  }).pipe(
    Effect.provide(
      Layer.merge(
        CryptoServiceLive(process.env.NEXT_PUBLIC_CRYPTO_SECRET!),
        PrismaLive,
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
