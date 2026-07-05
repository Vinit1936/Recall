// Prisma client singleton for Next.js.
//
// In development, Next.js hot-reloads cause new PrismaClient instances to be
// created on every reload. This pattern stores the client on `globalThis` so
// it survives hot-reloads and only one connection pool is created.
//
// In production, a fresh PrismaClient is created normally.

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
