import { Effect } from "effect";
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

  try {
    const user = await Effect.runPromise(registerUser({ email, password }));

    const { passwordHash, ...safeUser } = user as any;
    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (err: any) {
    if (err.code === "EMAIL_EXISTS") {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: err.message ?? "Signup failed" },
      { status: 500 },
    );
  }
}
