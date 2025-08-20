import { Effect } from "effect";
import { PrismaService, prismaOp } from "./prisma-service";

export const findUserByEmail = (email: string) =>
  Effect.gen(function* () {
    const prisma = yield* PrismaService;
    return yield* prismaOp(prisma.user.findUnique)({ where: { email } });
  });

export const findUserById = (id: string) =>
  Effect.gen(function* () {
    const prisma = yield* PrismaService;
    return yield* prismaOp(prisma.user.findUnique)({ where: { id } });
  });

export const createUser = (data: Record<string, any>) =>
  Effect.gen(function* () {
    const prisma = yield* PrismaService;
    return yield* prismaOp(prisma.user.create)({ data });
  });

export const createPasswordResetToken = (data: {
  email: string;
  token: string;
  expires: Date;
}) =>
  Effect.gen(function* () {
    const prisma = yield* PrismaService;
    return yield* prismaOp(prisma.passwordResetToken.create)({ data });
  });
