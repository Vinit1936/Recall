// PATCH /api/problems/[id]/custom-fields — update customFields JSON for a problem

import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// TODO: Replace with real auth — hardcoded dev user for now
const DEV_USER_ID = 'dev-user-1';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const existing = await prisma.problem.findFirst({
      where: { id, userId: DEV_USER_ID }, // TODO: replace with real userId from auth
    });
    if (!existing) {
      return Response.json({ error: 'Problem not found' }, { status: 404 });
    }

    // Merge new fields into existing customFields
    const current = (existing.customFields as Record<string, string>) ?? {};
    const merged = { ...current, ...body };

    const updated = await prisma.problem.update({
      where: { id },
      data: { customFields: merged },
    });
    return Response.json(updated);
  } catch (e) {
    console.error('[PATCH /api/problems/[id]/custom-fields]', e);
    return Response.json({ error: 'Failed to update custom fields' }, { status: 500 });
  }
}
