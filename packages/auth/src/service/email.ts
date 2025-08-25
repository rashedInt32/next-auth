import { Context, Data, Effect, Layer } from "effect";
import { Resend } from "resend";

export class EmailSendError extends Data.TaggedError("EmailSendError")<{
  readonly cause: unknown;
}> {}

export interface EmailService {
  readonly sendEmail: (
    to: string,
    body: string,
    subject?: string,
  ) => Effect.Effect<void, EmailSendError>;
}

export const EmailService = Context.GenericTag<EmailService>("EmailService");

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export const EmailServiceLive = Layer.effect(
  EmailService,
  Effect.gen(function* () {
    return EmailService.of({
      sendEmail: (to, body, subject) =>
        Effect.promise(() =>
          resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: to,
            subject: subject ?? "Verify email",
            html: body,
          }),
        ).pipe(Effect.mapError((cause) => new EmailSendError({ cause }))),
    });
  }),
);
