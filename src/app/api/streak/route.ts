// GET /api/streak — fetch the current streak for the dev user

import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// TODO: Replace with real auth — hardcoded dev user for now
const DEV_USER_ID = 'dev-user-1';

export async function GET(_request: NextRequest) {
  try {
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Fetch all StreakLog entries for this user, ordered newest first
    const logs = await prisma.streakLog.findMany({
      where: { userId: DEV_USER_ID }, // TODO: replace with real userId from auth
      orderBy: { date: 'desc' },
    });

    // Build a fast lookup: date-string → completed
    const logMap = new Map<string, boolean>();
    for (const log of logs) {
      const key = log.date.toISOString().split('T')[0]; // "YYYY-MM-DD"
      logMap.set(key, log.completed);
    }

    // Check if today is completed
    const todayKey = todayMidnight.toISOString().split('T')[0];
    const todayCompleted = logMap.get(todayKey) ?? false;

    // Count consecutive completed days going backwards from yesterday
    let streak = 0;
    const cursor = new Date(todayMidnight);
    cursor.setDate(cursor.getDate() - 1); // start at yesterday

    while (true) {
      const key = cursor.toISOString().split('T')[0];
      if (logMap.get(key) === true) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break; // streak is broken
      }
    }

    // If today is completed, include today in the streak count
    if (todayCompleted) {
      streak++;
    }

    return Response.json({ currentStreak: streak, todayCompleted });
  } catch (e) {
    console.error('[GET /api/streak]', e);
    return Response.json({ error: 'Failed to fetch streak' }, { status: 500 });
  }
}
