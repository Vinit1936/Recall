import { unstable_cache, revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';

// 1. Cached user problems list query
export async function getCachedUserProblems(userId: string, status?: string, topic?: string) {
  const cacheKey = `user-problems-${userId}-${status || 'all'}-${topic || 'all'}`;
  const cacheTag = `user-problems-${userId}`;

  return unstable_cache(
    async () => {
      return prisma.problem.findMany({
        where: {
          userId,
          ...(status ? { status: status as any } : {}),
          ...(topic ? { topic } : {}),
        },
        orderBy: { createdAt: 'desc' },
        include: {
          revisions: {
            orderBy: { revisedAt: 'desc' },
            take: 1,
          },
        },
      });
    },
    [cacheKey],
    {
      tags: [cacheTag],
      revalidate: 3600, // 1 hour fallback TTL
    }
  )();
}

// 2. Cached user columns query
export async function getCachedUserColumns(userId: string) {
  const cacheKey = `user-columns-${userId}`;
  const cacheTag = `user-columns-${userId}`;

  return unstable_cache(
    async () => {
      return prisma.userColumnConfig.findMany({
        where: { userId },
        orderBy: { order: 'asc' },
      });
    },
    [cacheKey],
    {
      tags: [cacheTag],
      revalidate: 3600,
    }
  )();
}

// 3. Cache Invalidation Utilities
export function invalidateUserProblems(userId: string) {
  try {
    revalidateTag(`user-problems-${userId}`, 'max');
  } catch (e) {
    console.warn('[Cache] revalidateTag user-problems failed:', e);
  }
}

export function invalidateUserColumns(userId: string) {
  try {
    revalidateTag(`user-columns-${userId}`, 'max');
  } catch (e) {
    console.warn('[Cache] revalidateTag user-columns failed:', e);
  }
}
