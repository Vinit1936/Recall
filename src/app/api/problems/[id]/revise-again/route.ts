// PATCH /api/problems/[id]/revise-again — pull MASTERED problem back into rotation

import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { reviseAgainFromMastered } from '@/lib/scheduling';

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

    if (problem.status !== 'MASTERED') {
      return Response.json({ error: 'Only MASTERED problems can be pulled back into rotation.' }, { status: 400 });
    }

    const { newStep, newStatus, nextRevisionAt } = reviseAgainFromMastered(new Date());
    const updated = await prisma.problem.update({
      where: { id },
      data: { currentStep: newStep, status: newStatus as any, nextRevisionAt },
    });

    return Response.json(updated);
  } catch (e) {
    console.error('[PATCH /api/problems/[id]/revise-again]', e);
    return Response.json({ error: 'Failed to revise again' }, { status: 500 });
  }
}
