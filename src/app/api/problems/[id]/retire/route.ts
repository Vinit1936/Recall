// PATCH /api/problems/[id]/retire — manually retire a problem

import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { retireProblem } from '@/lib/scheduling';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const { id } = await params;
    const problem = await prisma.problem.findFirst({ where: { id, userId } });
    if (!problem) return Response.json({ error: 'Problem not found' }, { status: 404 });

    const { newStatus } = retireProblem();
    const updated = await prisma.problem.update({
      where: { id },
      data: { status: newStatus as any },
    });

    return Response.json(updated);
  } catch (e) {
    console.error('[PATCH /api/problems/[id]/retire]', e);
    return Response.json({ error: 'Failed to retire problem' }, { status: 500 });
  }
}
