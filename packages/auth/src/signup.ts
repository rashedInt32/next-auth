import bcrypt from "bcryptjs";
import { Effect, Layer } from "effect";
import { PrismaServiceLive, findUserByEmail, createUser } from "@repo/db";
import { UserError } from "./error";
import { EmailService, EmailServiceLive } from "./service/email";
import { confirmEmailBody } from "./reset-password/emailBody";
import { CryptoService, CryptoServiceLive } from "./service/jwt";
import { createEmailConfirmationToken } from "@repo/db";

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
  }).pipe(Effect.provide(PrismaServiceLive));

export const generateEmailConfirmationToken = (email: string, id: string) =>
  Effect.gen(function* () {
    const cryptoService = yield* CryptoService;
    const token = yield* cryptoService.signJwt(
      {
        email: email,
        id: id,
      },
      "5m",
    );
    return yield* createEmailConfirmationToken({
      email: email as string,
      token,
      expires: new Date(Date.now() + 5 * 60 * 1000),
    });
  }).pipe(
    Effect.provide(
      Layer.merge(
        CryptoServiceLive(process.env.CRYPTO_SECRET!),
        PrismaServiceLive,
      ),
    ),
    Effect.mapError(
      (err) =>
        new UserError({
          code: "EMAIL_CONFIRMATION_TOKEN_FAILED",
          message: err.message,
        }),
    ),
  );

export const sendConfimationEmail = (token: string, email: string) =>
  Effect.gen(function* () {
    const emailService = yield* EmailService;
    const confirmUrl = `${process.env.BASE_URL || "http://localhost:3000"}/auth/verify-email?token=${token}`;

    return yield* emailService.sendEmail(
      email,
      confirmEmailBody(confirmUrl),
      "Confirm your email",
    );
  }).pipe(Effect.provide(EmailServiceLive));
