// GET /api/activity — revision activity for the last 365 days
// Returns [{ date: "YYYY-MM-DD", count: number }] for dates with >= 1 revision
// TODO: replace hardcoded userId with session user

import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEV_USER_ID = 'dev-user-1';

export async function GET(_request: NextRequest) {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 365);

    // Get all problems for this user to filter revisions
    const problems = await prisma.problem.findMany({
      where: { userId: DEV_USER_ID }, // TODO: replace hardcoded userId with session user
      select: { id: true },
    });
    const problemIds = problems.map((p) => p.id);

    if (problemIds.length === 0) {
      return Response.json([]);
    }

    // Fetch revisions in the last 365 days
    const revisions = await prisma.revision.findMany({
      where: {
        problemId: { in: problemIds },
        revisedAt: { gte: since },
      },
      select: { revisedAt: true },
    });

    // Group by date string YYYY-MM-DD
    const counts: Record<string, number> = {};
    for (const r of revisions) {
      const date = r.revisedAt.toISOString().split('T')[0];
      counts[date] = (counts[date] ?? 0) + 1;
    }

    const result = Object.entries(counts).map(([date, count]) => ({ date, count }));
    result.sort((a, b) => a.date.localeCompare(b.date));

    return Response.json(result);
  } catch (e) {
    console.error('[GET /api/activity]', e);
    return Response.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
