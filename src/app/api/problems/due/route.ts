// GET /api/problems/due — fetch today's due + overdue problems

import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const { searchParams } = request.nextUrl;
    const beforeParam = searchParams.get('before');

    const now = new Date();
    // If client passes its local end-of-day (e.g. ?before=ISO), use it so timezone boundaries are accurate
    let endOfToday: Date;
    if (beforeParam) {
      const parsed = new Date(beforeParam);
      endOfToday = isNaN(parsed.getTime())
        ? new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
        : parsed;
    } else {
      endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    }

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
