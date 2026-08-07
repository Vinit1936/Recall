// GET /api/export — export all user problems, revisions, and streak logs as JSON

import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    const problems = await prisma.problem.findMany({
      where: { userId },
      include: { revisions: true },
      orderBy: { createdAt: 'desc' },
    });

    const streakLogs = await prisma.streakLog.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      user,
      totalProblems: problems.length,
      problems,
      streakLogs,
    };

    const jsonString = JSON.stringify(exportPayload, null, 2);

    return new Response(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="recall_backup_${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (e) {
    console.error('[GET /api/export]', e);
    return Response.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
