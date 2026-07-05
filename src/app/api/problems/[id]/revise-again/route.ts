// PATCH /api/problems/[id]/revise-again — pull a MASTERED problem back into active rotation

import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { reviseAgainFromMastered } from '@/lib/scheduling';

// TODO: Replace with real auth — hardcoded dev user for now
const DEV_USER_ID = 'dev-user-1';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch and verify ownership
    const problem = await prisma.problem.findFirst({
      where: { id, userId: DEV_USER_ID }, // TODO: replace with real userId from auth
    });

    if (!problem) {
      return Response.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Can only pull back a MASTERED problem
    if (problem.status !== 'MASTERED') {
      return Response.json(
        { error: 'Only MASTERED problems can be pulled back into rotation.' },
        { status: 400 }
      );
    }

    // Delegate to the pure function to get new state
    const { newStep, newStatus, nextRevisionAt } = reviseAgainFromMastered(new Date());
    // Note: revisionType = 'RECHECK' is returned too but only used when the user
    // submits their confidence via the /revise route. No Revision row is created here.

    const updated = await prisma.problem.update({
      where: { id },
      data: {
        currentStep: newStep,
        status: newStatus as any,
        nextRevisionAt,
      },
    });

    return Response.json(updated);
  } catch (e) {
    console.error('[PATCH /api/problems/[id]/revise-again]', e);
    return Response.json({ error: 'Failed to revise again' }, { status: 500 });
  }
}
