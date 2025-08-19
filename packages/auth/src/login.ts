import { Effect } from "effect";
import { signIn } from "next-auth/react";
import { UserError } from "./error";
import { useRouter } from "next/navigation";

export const validateInput = (email: string, password: string) =>
  !email || !password
    ? Effect.fail(
        new UserError({
          message: "Email and password are required.",
          code: "INVALID_CREDENTIALS",
        }),
      )
    : Effect.succeed({ email, password });

export const callSignIn = (email: string, password: string) =>
  Effect.tryPromise({
    try: () =>
      signIn("credentials", {
        email,
        password,
        redirect: false,
      }),
    catch: () =>
      new UserError({
        code: "UNKNOWN_ERROR",
        message: "Sign in request failed",
      }),
  });

export const interpretSignInResult = (result: any) =>
  !result || result.error
    ? Effect.fail(
        new UserError({
          code:
            result?.error === "CredentialsSignin"
              ? "INVALID_CREDENTIALS"
              : "UNKNOWN_ERROR",
          message:
            result?.error === "CredentialsSignin"
              ? "Invalid email or password."
              : result?.error || "An unexpected error occurred.",
        }),
      )
    : Effect.succeed(result);

export const redirectToDashboard = (router: ReturnType<typeof useRouter>) =>
  Effect.sync(() => {
    router.push("/dashboard");
  });

export const loginEffect = (
  email: string,
  password: string,
  router: ReturnType<typeof useRouter>,
) =>
  Effect.gen(function* () {
    yield* validateInput(email, password);
    const result = yield* callSignIn(email, password);
    yield* interpretSignInResult(result);
    yield* redirectToDashboard(router);
  });
