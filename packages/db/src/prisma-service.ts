import { Effect, Data, Layer, Context } from "effect";
import { PrismaClient } from "@prisma/client";

export class PrismaError extends Data.TaggedError("PrismaError")<{
  cause: unknown;
}> {}

export class PrismaService extends Context.Tag("PrismaService")<
  PrismaService,
  PrismaClient
>() {}

const globalPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const getPrismaClient = () => {
  if (process.env.NODE_ENV === "production") {
    return new PrismaClient();
  }
  if (!globalPrisma.prisma) {
    globalPrisma.prisma = new PrismaClient();
  }
  return globalPrisma.prisma;
};

export const PrismaLive =
  process.env.NODE_ENV === "production"
    ? Layer.scoped(
        PrismaService,
        Effect.acquireRelease(
          Effect.sync(() => {
            console.log("Initializing Prisma client");
            return new PrismaClient();
          }),
          (prisma) => {
            console.log("Disconnecting Prisma client");
            return Effect.promise(() => prisma.$disconnect());
          },
        ),
      )
    : Layer.succeed(PrismaService, getPrismaClient());

export const prismaOp =
  <A, Args extends any[]>(op: (...args: Args) => Promise<A>) =>
  (...args: Args) =>
    Effect.tryPromise({
      try: () => op(...args),
      catch: (cause) => new PrismaError({ cause }),
    });
