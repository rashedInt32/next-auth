import { Data } from "effect";

export class UserError extends Data.TaggedError("UserError")<{
  message: string;
  code:
    | "EMAIL_EXISTS"
    | "INVALID_CREDENTIALS"
    | "USER_NOT_FOUND"
    | "TOKEN_GENERATION_FAILED"
    | "EMAIL_CONFIRMATION_TOKEN_FAILED"
    | "UNKNOWN_ERROR";
}> {}
