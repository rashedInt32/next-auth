import { Schema } from "effect";

export const authResolver = Schema.Struct({
  email: Schema.String.pipe(
    Schema.pattern(/^[a-z0-9_'+\-\.]+@[a-z0-9][a-z0-9\-]*\.[a-z]{2,}$/i, {
      message: () => "Invalid email",
    }),
  ),
  password: Schema.String.pipe(
    Schema.minLength(8, {
      message: () => "Password must be at least 8 character length",
    }),
  ),
});

export const passwordResetResolver = Schema.Struct({
  email: authResolver.fields.email,
});

export type authSchema = typeof authResolver.Type;
