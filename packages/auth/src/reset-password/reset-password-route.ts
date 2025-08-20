import { NextResponse } from "next/server";
import { generateResetPasswordToken } from "./generate";
import { Effect } from "effect";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ status: 400, message: "Email is missing" });
  }

  const createToken = generateResetPasswordToken(email).pipe(
    Effect.map((token) => {
      return NextResponse.json({ status: 201, token });
    }),
    Effect.catchTag("UserError", (err) =>
      Effect.succeed(
        NextResponse.json(
          { error: err.message ?? "Unknows user error" },
          { status: err.code === "USER_NOT_FOUND" ? 404 : 500 },
        ),
      ),
    ),
    Effect.catchAll((err) =>
      Effect.succeed(
        NextResponse.json({ error: "Something went wrong" }, { status: 500 }),
      ),
    ),
  );

  return Effect.runPromise(createToken);
}
