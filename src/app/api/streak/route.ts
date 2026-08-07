// GET /api/streak — fetch the current streak for the logged-in user

import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

function toDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const today = new Date();
    const todayKey = toDateKey(today);

    // Get yesterday's key
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = toDateKey(yesterday);

    // Fetch streak logs
    const logs = await prisma.streakLog.findMany({
      where: { userId, completed: true },
    });

    // Also fetch revisions for the user to count any problem revised on a date
    const problems = await prisma.problem.findMany({
      where: { userId },
      select: { id: true },
    });
    const problemIds = problems.map((p) => p.id);

    const revisions = problemIds.length > 0 ? await prisma.revision.findMany({
      where: { problemId: { in: problemIds } },
      select: { revisedAt: true },
    }) : [];

    const activeDates = new Set<string>();
    for (const log of logs) {
      activeDates.add(toDateKey(log.date));
    }
    for (const rev of revisions) {
      activeDates.add(toDateKey(rev.revisedAt));
    }

    const todayCompleted = activeDates.has(todayKey);
    const yesterdayCompleted = activeDates.has(yesterdayKey);

    let streak = 0;
    const cursor = new Date(today);

    if (todayCompleted) {
      // Today is done — count backwards starting from today
      while (activeDates.has(toDateKey(cursor))) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      }
    } else if (yesterdayCompleted) {
      // Today is pending, but streak is active through yesterday
      cursor.setDate(cursor.getDate() - 1);
      while (activeDates.has(toDateKey(cursor))) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      }
    } else {
      // Streak broken
      streak = 0;
    }

    return Response.json({ currentStreak: streak, todayCompleted });
  } catch (e) {
    console.error('[GET /api/streak]', e);
    return Response.json({ error: 'Failed to fetch streak' }, { status: 500 });
  }
}


