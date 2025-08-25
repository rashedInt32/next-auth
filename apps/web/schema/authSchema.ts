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

export const ForgotPasswordResolver = Schema.Struct({
  email: authResolver.fields.email,
});

export const ResetPasswordResolver = Schema.Struct({
  token: Schema.String.pipe(
    Schema.nonEmptyString({ message: () => "Token is required" }),
  ),
  password: authResolver.fields.password,
  configmPassword: authResolver.fields.password,
}).pipe(
  Schema.filter((data) => data.password === data.configmPassword, {
    message: () => "Password does not match",
  }),
);

export type authSchema = typeof authResolver.Type;
export type resetPasswordSchema = typeof ResetPasswordResolver.Type;
