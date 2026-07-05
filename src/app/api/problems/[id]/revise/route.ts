// PATCH /api/problems/[id]/revise — submit a revision for a problem

import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { applyRevision } from '@/lib/scheduling';
import type { Confidence } from '@/lib/scheduling';

// TODO: Replace with real auth — hardcoded dev user for now
const DEV_USER_ID = 'dev-user-1';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { confidence } = body as { confidence: Confidence };

    if (!confidence || !['CLEAN', 'SHAKY', 'STRUGGLED'].includes(confidence)) {
      return Response.json(
        { error: 'confidence must be one of: CLEAN, SHAKY, STRUGGLED' },
        { status: 400 }
      );
    }

    // Fetch problem and verify it belongs to this user
    const problem = await prisma.problem.findFirst({
      where: { id, userId: DEV_USER_ID }, // TODO: replace with real userId from auth
    });

    if (!problem) {
      return Response.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Determine revisionType based on current status
    const revisionType = problem.status === 'MASTERED' ? 'RECHECK' : 'REGULAR';

    const today = new Date();

    // Apply the scheduling logic — delegates entirely to the pure function
    const { newStep, newStatus, nextRevisionAt } = applyRevision({
      currentStep: problem.currentStep,
      status: problem.status as any,
      confidence,
      revisionType,
      today,
    });

    // Run problem update + revision insert in a single transaction
    const updatedProblem = await prisma.$transaction(async (tx) => {
      // 1. Create the Revision record
      await tx.revision.create({
        data: {
          problemId: id,
          confidence: confidence as any,
          type: revisionType as any,
          stepBefore: problem.currentStep,
          stepAfter: newStep,
        },
      });

      // 2. Update the Problem
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

    // After the revision, check if all due problems for today are now done.
    // "Done" means no ACTIVE problems remain with nextRevisionAt <= now.
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const remainingDue = await prisma.problem.count({
      where: {
        userId: DEV_USER_ID, // TODO: replace with real userId from auth
        status: 'ACTIVE',
        nextRevisionAt: { lte: today },
      },
    });

    if (remainingDue === 0) {
      // All done for today — upsert today's StreakLog as completed
      await prisma.streakLog.upsert({
        where: { userId_date: { userId: DEV_USER_ID, date: todayMidnight } }, // TODO: real userId
        create: { userId: DEV_USER_ID, date: todayMidnight, completed: true }, // TODO: real userId
        update: { completed: true },
      });
    }

    return Response.json(updatedProblem);
  } catch (e) {
    console.error('[PATCH /api/problems/[id]/revise]', e);
    return Response.json({ error: 'Failed to submit revision' }, { status: 500 });
  }
}
