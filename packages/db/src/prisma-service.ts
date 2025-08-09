import { Effect, Data, Layer, Context } from "effect";
import { PrismaClient } from "@prisma/client";

export class PrismaError extends Data.TaggedError("PrismaError")<{
  cause: unknown;
}> {}

export class PrismaService extends Context.Tag("PrismaService")<
  PrismaService,
  PrismaClient
>() {}

export const PrismaLive = Layer.scoped(
  PrismaService,
  Effect.acquireRelease(
    Effect.sync(() => new PrismaClient()),
    (prisma) => Effect.promise(() => prisma.$disconnect()),
  ),
);

export const prismaOp =
  <A, Args extends any[]>(op: (...args: Args) => Promise<A>) =>
  (...args: Args) =>
    Effect.tryPromise({
      try: () => op(...args),
      catch: (cause) => new PrismaError({ cause }),
    });
