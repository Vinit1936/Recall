// PATCH /api/problems/[id] — generic partial update (isFavorite, notes, topic)

import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

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

    const existing = await prisma.problem.findFirst({ where: { id, userId } });
    if (!existing) return Response.json({ error: 'Problem not found' }, { status: 404 });

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
