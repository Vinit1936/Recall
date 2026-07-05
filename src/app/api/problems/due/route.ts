// GET /api/problems/due — fetch today's due + overdue problems for Daily Revision

import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// TODO: Replace with real auth — hardcoded dev user for now
const DEV_USER_ID = 'dev-user-1';

export async function GET(_request: NextRequest) {
  try {
    const now = new Date();

    // Fetch all ACTIVE problems where nextRevisionAt <= now (due + overdue)
    const problems = await prisma.problem.findMany({
      where: {
        userId: DEV_USER_ID, // TODO: replace with real userId from auth
        status: 'ACTIVE',
        nextRevisionAt: { lte: now },
      },
      orderBy: { nextRevisionAt: 'asc' }, // most overdue first
    });

    // Compute start-of-today (midnight) for the isOverdue comparison
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Add isOverdue: true if nextRevisionAt is strictly before today (yesterday or earlier)
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
