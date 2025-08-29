import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Effect, Layer } from "effect";
import {
  deletePasswordResetToken,
  findResetToken,
  PrismaServiceLive,
  updatePassword,
} from "@repo/db";
import { CryptoService, CryptoServiceLive } from "../service/jwt";

export interface ResetTokenResponse {
  token?: string;
  email?: string;
  expires?: Date;
}

export async function POST(req: Request) {
  const { token, password, confirmPassword } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }
  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Password don't match, please try again" },
      { status: 400 },
    );
  }

  const secret = process.env.NEXT_PUBLIC_CRYPTO_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  const update = Effect.gen(function* () {
    const tokenResult: unknown = yield* findResetToken(token);

    const response = tokenResult as ResetTokenResponse | null;

    if (!response?.token) {
      return yield* Effect.succeed(
        NextResponse.json(
          { error: "We couldn't find the token, please try again" },
          { status: 400 },
        ),
      );
    }

    const crypto = yield* CryptoService;
    const verifyToken = yield* crypto.verifyJwt(response.token);

    const passwordHash = yield* Effect.promise(() => bcrypt.hash(password, 10));
    yield* updatePassword(verifyToken?.email as string, passwordHash);
    yield* deletePasswordResetToken({ email: verifyToken?.email as string });

    return yield* Effect.succeed(
      NextResponse.json({
        status: 201,
        message: "Update password successful",
      }),
    );
  }).pipe(
    Effect.provide(Layer.merge(CryptoServiceLive(secret), PrismaServiceLive)),
    Effect.catchTag("JwtVerifyError", () => {
      return Effect.succeed(
        NextResponse.json(
          {
            error: `Token expired, please request a new link.`,
          },
          { status: 400 },
        ),
      );
    }),
    Effect.catchAll((err) =>
      Effect.succeed(
        NextResponse.json(
          { error: `Unexpected error: ${err}` },
          { status: 500 },
        ),
      ),
    ),
  );

  return Effect.runPromise(update);
}
