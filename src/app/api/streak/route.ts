// GET /api/streak — fetch the current streak for the logged-in user

import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const logs = await prisma.streakLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    const logMap = new Map<string, boolean>();
    for (const log of logs) {
      const key = log.date.toISOString().split('T')[0];
      logMap.set(key, log.completed);
    }

    const todayKey = todayMidnight.toISOString().split('T')[0];
    const todayCompleted = logMap.get(todayKey) ?? false;

    let streak = 0;
    const cursor = new Date(todayMidnight);
    cursor.setDate(cursor.getDate() - 1);

    while (true) {
      const key = cursor.toISOString().split('T')[0];
      if (logMap.get(key) === true) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }

    if (todayCompleted) streak++;

    return Response.json({ currentStreak: streak, todayCompleted });
  } catch (e) {
    console.error('[GET /api/streak]', e);
    return Response.json({ error: 'Failed to fetch streak' }, { status: 500 });
  }
}
