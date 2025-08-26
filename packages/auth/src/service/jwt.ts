import { Context, Data, Effect, Layer } from "effect";
import { JWTPayload, jwtVerify, SignJWT } from "jose";

export class JwtSignError extends Data.TaggedError("JwtSignError")<{
  readonly cause: unknown;
}> {}

export class JwtVerifyError extends Data.TaggedError("JwtVerifyError")<{
  readonly cause: unknown;
}> {}

export interface CryptoService {
  signJwt: (
    payload: JWTPayload,
    expiresIn?: string,
  ) => Effect.Effect<string, JwtSignError>;
  verifyJwt: (token: string) => Effect.Effect<JWTPayload, JwtVerifyError>;
}

export const CryptoService = Context.GenericTag<CryptoService>("CryptoService");

export const CryptoServiceLive = (secret: string) =>
  Layer.effect(
    CryptoService,
    Effect.gen(function* () {
      const key = new TextEncoder().encode(secret);
      return CryptoService.of({
        signJwt: (payload, expiresIn = "24h") =>
          Effect.promise(() =>
            new SignJWT(payload)
              .setProtectedHeader({ alg: "HS256" })
              .setIssuedAt()
              .setExpirationTime(expiresIn)
              .sign(key),
          ).pipe(Effect.mapError((cause) => new JwtSignError({ cause }))),
        verifyJwt: (token) =>
          Effect.tryPromise({
            try: () => jwtVerify(token, key),
            catch: (cause) => new JwtVerifyError({ cause }),
          }).pipe(Effect.map(({ payload }) => payload)),
      });
    }),
  );
