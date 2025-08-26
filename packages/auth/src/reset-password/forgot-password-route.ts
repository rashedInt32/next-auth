import { NextResponse } from "next/server";
import { generateResetPasswordToken } from "./generate";
import { Effect } from "effect";
import { EmailService, EmailServiceLive } from "../service/email";
import { emailBody } from "./emailBody";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ status: 400, message: "Email is missing" });
  }

  const createToken = Effect.gen(function* () {
    const { token } = yield* generateResetPasswordToken(email);
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`;

    const emailService = yield* EmailService;
    yield* emailService.sendEmail(
      email,
      emailBody(resetUrl),
      "Reset your password",
    );

    return NextResponse.json({
      status: 201,
      message: "Password reset email sent successfully",
    });
  }).pipe(
    Effect.provide(EmailServiceLive),
    Effect.catchTag("UserError", (err) =>
      Effect.succeed(
        NextResponse.json(
          { error: err.message ?? "Unknows user error" },
          { status: err.code === "USER_NOT_FOUND" ? 404 : 400 },
        ),
      ),
    ),
    Effect.catchTag("EmailSendError", (err) =>
      Effect.succeed(
        NextResponse.json(
          { error: "Failed to send reset email, Please try again later", err },
          { status: 500 },
        ),
      ),
    ),
    Effect.catchAll((err) =>
      Effect.succeed(
        NextResponse.json(
          { error: "Internal server error", err },
          { status: 500 },
        ),
      ),
    ),
  );

  return Effect.runPromise(createToken);
}
