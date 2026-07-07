// GET /api/activity — revision activity for the last 365 days

import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const since = new Date();
    since.setDate(since.getDate() - 365);

    const problems = await prisma.problem.findMany({
      where: { userId },
      select: { id: true },
    });
    const problemIds = problems.map((p) => p.id);

    if (problemIds.length === 0) return Response.json([]);

    const revisions = await prisma.revision.findMany({
      where: { problemId: { in: problemIds }, revisedAt: { gte: since } },
      select: { revisedAt: true },
    });

    const counts: Record<string, number> = {};
    for (const r of revisions) {
      const date = r.revisedAt.toISOString().split('T')[0];
      counts[date] = (counts[date] ?? 0) + 1;
    }

    const result = Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return Response.json(result);
  } catch (e) {
    console.error('[GET /api/activity]', e);
    return Response.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
