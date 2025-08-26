import { NextResponse } from "next/server";
import { Effect, Layer } from "effect";
import { findResetToken, PrismaServiceLive } from "@repo/db";
import { CryptoService, CryptoServiceLive } from "../service/jwt";

// Define response type from findResetToken
interface ResetTokenResponse {
  id?: string;
  token?: string;
  email?: string;
  expires?: Date;
  // Add other properties that findResetToken returns
}

export async function POST(req: Request) {
  const { token, password, confirmPassword } = await req.json();

  if (!token) {
    return NextResponse.json({ status: 400, message: "Token is missing" });
  }

  const updatePassword = Effect.gen(function* () {
    const response: ResetTokenResponse | null = yield* findResetToken(token);

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
