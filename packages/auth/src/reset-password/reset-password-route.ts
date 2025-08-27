import { NextResponse } from "next/server";
import { Effect, Layer } from "effect";
import { findResetToken, PrismaServiceLive } from "@repo/db";
import { CryptoService, CryptoServiceLive } from "../service/jwt";

interface ResetTokenResponse {
  token?: string;
  email?: string;
  expires?: Date;
}

export async function POST(req: Request) {
  const { token, password, confirmPassword } = await req.json();

  if (!token) {
    return NextResponse.json({ status: 400, message: "Token is missing" });
  }

  const updatePassword = Effect.gen(function* () {
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
    console.log("verifytoken", verifyToken);
    if (verifyToken?.email) {
    }

    return yield* Effect.succeed(
      NextResponse.json({
        status: 201,
        message: "Update password successful",
      }),
    );
  }).pipe(
    Effect.provide(
      Layer.merge(
        CryptoServiceLive(process.env.NEXT_PUBLIC_CRYPTO_SECRET!),
        PrismaServiceLive,
      ),
    ),
    Effect.catchTag("JwtVerifyError", (err) => {
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

  return Effect.runPromise(updatePassword);
}
