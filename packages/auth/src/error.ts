import { Data } from "effect";

export class UserError extends Data.TaggedError("UserError")<{
  message: string;
  code:
    | "EMAIL_EXISTS"
    | "INVALID_CREDENTIALS"
    | "USER_NOT_FOUND"
    | "UNKNOWN_ERROR";
}> {}
