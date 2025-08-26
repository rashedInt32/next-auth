import { NextResponse } from "next/server";
import { Console, Effect, Layer } from "effect";
import { findResetToken, PrismaServiceLive } from "@repo/db";
import { CryptoService, CryptoServiceLive } from "../service/jwt";

export async function POST(req: Request) {
  const { token, password, confirmPassword } = await req.json();
  if (!token) {
    return NextResponse.json({ status: 400, message: "Token is missing" });
  }

  const updatePassword = Effect.gen(function* () {
    const response = yield* findResetToken(token);
    if (!response?.token) {
      return NextResponse.json({
        status: 400,
        message: "Invalid token or missing",
      });
    }

    const crypto = yield* CryptoService;
    const verifyToken = yield* crypto.verifyJwt(response.token);
    console.log("veryfytonen", verifyToken);

    return NextResponse.json({
      status: 201,
      message: "Update password successful",
    });
  }).pipe(
    Effect.provide(
      Layer.merge(
        CryptoServiceLive(process.env.NEXT_PUBLIC_CRYPTO_SECRET!),
        PrismaServiceLive,
      ),
    ),
    Effect.catchTag("JwtVerifyEffor", (cause) => {
      return Effect.succeed(
        NextResponse.json({
          status: 400,
          message: `token varification failed ${cause}`,
        }),
      );
    }),
  );

  return Effect.runPromise(updatePassword);
}
