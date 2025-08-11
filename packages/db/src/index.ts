export {
  PrismaError,
  PrismaService,
  PrismaLive,
  prismaOp,
} from "./prisma-service";

export { PrismaClient } from "@prisma/client";

export { findUserByEmail, findUserById, createUser } from "./query";
