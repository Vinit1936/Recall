// PATCH /api/problems/[id]/custom-fields — update customFields JSON

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

    const current = (existing.customFields as Record<string, string>) ?? {};
    let merged: Record<string, string>;
    if (body && typeof body === 'object' && 'key' in body && 'value' in body) {
      merged = { ...current, [body.key]: body.value };
    } else {
      merged = { ...current, ...body };
    }

    const updated = await prisma.problem.update({ where: { id }, data: { customFields: merged } });
    return Response.json(updated);
  } catch (e) {
    console.error('[PATCH /api/problems/[id]/custom-fields]', e);
    return Response.json({ error: 'Failed to update custom fields' }, { status: 500 });
  }
}
