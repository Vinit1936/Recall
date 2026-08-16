// GET /api/problems/due — fetch today's due + overdue problems

import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const now = new Date();
    // Use end-of-today (23:59:59.999) so ALL problems due today are included,
    // not just those whose nextRevisionAt has already passed by the exact second.
    // This ensures the daily revision page matches what the dashboard shows as "Today".
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const problems = await prisma.problem.findMany({
      where: { userId, status: 'ACTIVE', nextRevisionAt: { lte: endOfToday } },
      orderBy: { nextRevisionAt: 'asc' },
    });

    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const result = problems.map((p) => ({
      ...p,
      isOverdue: p.nextRevisionAt < todayMidnight,
    }));

    return Response.json(result);
  } catch (e) {
    console.error('[GET /api/problems/due]', e);
    return Response.json({ error: 'Failed to fetch due problems' }, { status: 500 });
  }
}
