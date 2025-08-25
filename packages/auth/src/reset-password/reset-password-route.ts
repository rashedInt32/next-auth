import { NextResponse } from "next/server";
import { generateResetPasswordToken } from "./generate";
import { Effect } from "effect";
import { EmailService, EmailServiceLive } from "../service/email";

const emailBody = (resetUrl: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Reset Your Password</h2>
    <p>Hi there,</p>
    <p>You requested to reset your password. Click the button below:</p>
    <a href="${resetUrl}" target="_blank" 
       style="background: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
      Reset Password
    </a>
    <p><strong>This link expires in 1 hour.</strong></p>
    <p>If you didn't request this, please ignore this email.</p>
  </div>
`;

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ status: 400, message: "Email is missing" });
  }

  const createToken = Effect.gen(function* () {
    const { token } = yield* generateResetPasswordToken(email);
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/password-reset?token=${token}`;

    const emailService = yield* EmailService;
    yield* emailService.sendEmail(email, emailBody(resetUrl));

    return NextResponse.json({
      status: 201,
      message: "Password reset token cretated",
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
    Effect.catchAll((err) =>
      Effect.succeed(
        NextResponse.json({ error: "Internal server error" }, { status: 500 }),
      ),
    ),
  );

  return Effect.runPromise(createToken);
}
