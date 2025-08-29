import { NextResponse } from "next/server";
import { CryptoService, CryptoServiceLive } from "./service/jwt";
import { Effect, Layer } from "effect";
import { findEmailConfirmationToken, PrismaServiceLive } from "@repo/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const secret = process.env.NEXT_PUBLIC_CRYPTO_SECRET!;

  const verifyToken = Effect.gen(function* () {
    const crypto = yield* CryptoService;
    const getTokenFromDB = yield* findEmailConfirmationToken(token);
    if (!getTokenFromDB) {
      return yield* Effect.succeed(
        NextResponse.json(
          { error: "We couldn't find confirmation token, please try again" },
          { status: 404 },
        ),
      );
    }

    yield* crypto.verifyJwt(getTokenFromDB.token);

    return yield* Effect.succeed(
      NextResponse.json({
        success: true,
        message: "Email successfully varified",
      }),
    );
  }).pipe(
    Effect.provide(Layer.merge(PrismaServiceLive, CryptoServiceLive(secret))),
    Effect.catchTag("JwtVerifyError", () => {
      return Effect.succeed(
        NextResponse.json(
          {
            error: `Token expired, please request a new link.`,
          },
          { status: 500 },
        ),
      );
    }),
    Effect.catchAll(() =>
      Effect.fail(
        NextResponse.json(
          { error: `Email verification failed, please try again` },
          { status: 500 },
        ),
      ),
    ),
  );

  return Effect.runPromise(verifyToken);
}
