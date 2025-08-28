import { Effect } from "effect";
import {
  generateEmailConfirmationToken,
  registerUser,
  sendConfimationEmail,
} from "./signup";
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

  const userCreation = Effect.gen(function* () {
    const user = yield* registerUser({ email, password });
    if (!user) {
      return yield* Effect.succeed(
        NextResponse.json(
          {
            error: "Failed to create user, please try again",
          },
          { status: 500 },
        ),
      );
    }
    const token = yield* generateEmailConfirmationToken(
      user?.email as string,
      user?.id,
    );
    yield* sendConfimationEmail(token.token, user?.email as string);

    return yield* Effect.succeed(
      NextResponse.json(
        { user },
        {
          status: 201,
        },
      ),
    );
  }).pipe(
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
