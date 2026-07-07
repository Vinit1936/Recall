// PATCH /api/problems/[id]/revise — submit a revision for a problem

import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { applyRevision } from '@/lib/scheduling';
import type { Confidence } from '@/lib/scheduling';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const { id } = await params;
    const body = await request.json();
    const { confidence } = body as { confidence: Confidence };

    if (!confidence || !['CLEAN', 'SHAKY', 'STRUGGLED'].includes(confidence)) {
      return Response.json({ error: 'confidence must be one of: CLEAN, SHAKY, STRUGGLED' }, { status: 400 });
    }

    const problem = await prisma.problem.findFirst({ where: { id, userId } });
    if (!problem) return Response.json({ error: 'Problem not found' }, { status: 404 });

    const revisionType = problem.status === 'MASTERED' ? 'RECHECK' : 'REGULAR';
    const today = new Date();

    const { newStep, newStatus, nextRevisionAt } = applyRevision({
      currentStep: problem.currentStep,
      status: problem.status as any,
      confidence,
      revisionType,
      today,
    });

    const updatedProblem = await prisma.$transaction(async (tx) => {
      await tx.revision.create({
        data: {
          problemId: id,
          confidence: confidence as any,
          type: revisionType as any,
          stepBefore: problem.currentStep,
          stepAfter: newStep,
        },
      });
      return tx.problem.update({
        where: { id },
        data: {
          currentStep: newStep,
          status: newStatus as any,
          nextRevisionAt: nextRevisionAt ?? problem.nextRevisionAt,
          revisionCount: { increment: 1 },
        },
      });
    });

    // Mark today's streak complete if all due problems are now done
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const remainingDue = await prisma.problem.count({
      where: { userId, status: 'ACTIVE', nextRevisionAt: { lte: today } },
    });

    if (remainingDue === 0) {
      await prisma.streakLog.upsert({
        where: { userId_date: { userId, date: todayMidnight } },
        create: { userId, date: todayMidnight, completed: true },
        update: { completed: true },
      });
    }

    return Response.json(updatedProblem);
  } catch (e) {
    console.error('[PATCH /api/problems/[id]/revise]', e);
    return Response.json({ error: 'Failed to submit revision' }, { status: 500 });
  }
}
