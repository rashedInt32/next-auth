import { Effect, Console } from "effect";
import { registerUser } from "./signup";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body ?? {};
  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing email or password" },
      { status: 400 },
    );
  }

  const userCreation = registerUser({ email, password }).pipe(
    Effect.map((user) => {
      return NextResponse.json({ user }, { status: 201 });
    }),
    Effect.catchTag("UserError", (err) =>
      Effect.succeed(
        NextResponse.json(
          { error: err.message },
          { status: err.code === "EMAIL_EXISTS" ? 409 : 500 },
        ),
      ),
    ),
    Effect.catchAll((err) =>
      Effect.succeed(
        NextResponse.json(
          { error: err?.message ?? "An unexpected error occurred" },
          { status: 500 },
        ),
      ),
    ),
  );

  return Effect.runPromise(userCreation);
}
