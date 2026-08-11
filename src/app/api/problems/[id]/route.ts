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

    const allowed = ['isFavorite', 'notes', 'topic', 'difficulty', 'status'] as const;
    const data: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) {
        if (key === 'status') {
          const s = String(body.status).toUpperCase();
          if (['ACTIVE', 'MASTERED', 'RETIRED'].includes(s)) {
            data.status = s;
          }
        } else {
          data[key] = body[key];
        }
      }
    }

    if (Object.keys(data).length === 0) {
      return Response.json({ error: 'No updatable fields provided' }, { status: 400 });
    }

    // Single query — validates ownership and updates in one DB round trip
    const result = await prisma.problem.updateMany({
      where: { id, userId },
      data,
    });

    if (result.count === 0) {
      return Response.json({ error: 'Problem not found' }, { status: 404 });
    }

    return Response.json({ success: true, id });
  } catch (e) {
    console.error('[PATCH /api/problems/[id]]', e);
    return Response.json({ error: 'Failed to update problem' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const { id } = await params;

    // Single query — validates ownership and deletes in one DB round trip
    const result = await prisma.problem.deleteMany({ where: { id, userId } });
    if (result.count === 0) {
      return Response.json({ error: 'Problem not found' }, { status: 404 });
    }

    return Response.json({ success: true, message: 'Problem deleted' });
  } catch (e) {
    console.error('[DELETE /api/problems/[id]]', e);
    return Response.json({ error: 'Failed to delete problem' }, { status: 500 });
  }
}

