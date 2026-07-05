// PATCH /api/problems/[id]/retire — manually retire a problem

import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { retireProblem } from '@/lib/scheduling';

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

    // Delegate to the pure function — always returns RETIRED + null
    const { newStatus } = retireProblem();

    // nextRevisionAt stays as-is (field is non-nullable in schema);
    // status = RETIRED is the source of truth for the UI.
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
