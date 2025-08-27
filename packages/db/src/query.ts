import { Effect } from "effect";
import { PrismaService, prismaOp } from "./prisma-service";

/**
 * Find user by email
 * @param email
 * @returns user or null
 */
export const findUserByEmail = (email: string) =>
  Effect.gen(function* () {
    const prisma = yield* PrismaService;
    return yield* prismaOp(prisma.user.findUnique)({ where: { email } });
  });

/**
 * Find user by id
 * @param id
 * @returns user or null
 */
export const findUserById = (id: string) =>
  Effect.gen(function* () {
    const prisma = yield* PrismaService;
    return yield* prismaOp(prisma.user.findUnique)({ where: { id } });
  });

/** Create a new user
 * @param data - user data
 * @returns created user
 */
export const createUser = (data: Record<string, any>) =>
  Effect.gen(function* () {
    const prisma = yield* PrismaService;
    return yield* prismaOp(prisma.user.create)({ data });
  });

/** Create a password reset token
 * @param data - token data
 * @returns created token
 */
export const createPasswordResetToken = (data: {
  email: string;
  token: string;
  expires: Date;
}) =>
  Effect.gen(function* () {
    const prisma = yield* PrismaService;
    return yield* prismaOp(prisma.passwordResetToken.create)({ data });
  });

/** Delete password reset tokens by email
 * @param data - email
 * @returns number of deleted tokens
 */
export const deletePasswordResetToken = (data: { email: string }) =>
  Effect.gen(function* () {
    const prisma = yield* PrismaService;
    return yield* prismaOp(prisma.passwordResetToken.deleteMany)({
      where: { email: data.email },
    });
  });

/** Find a password reset token by token string
 * @param token - token string
 * @returns token or null
 */
export const findResetToken = (token: string) =>
  Effect.gen(function* () {
    const prisma = yield* PrismaService;
    return yield* prismaOp(prisma.passwordResetToken.findUnique)({
      where: { token },
    });
  });
