// PATCH /api/problems/[id] — generic partial update for a problem
// Used for isFavorite toggle and other single-field updates.

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

    // Whitelist updatable fields to prevent accidental overwrites
    const allowed = ['isFavorite', 'notes', 'topic'] as const;
    const data: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) data[key] = body[key];
    }

    if (Object.keys(data).length === 0) {
      return Response.json({ error: 'No updatable fields provided' }, { status: 400 });
    }

    const updated = await prisma.problem.update({ where: { id }, data });
    return Response.json(updated);
  } catch (e) {
    console.error('[PATCH /api/problems/[id]]', e);
    return Response.json({ error: 'Failed to update problem' }, { status: 500 });
  }
}
