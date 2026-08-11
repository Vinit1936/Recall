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

    // Atomic read-modify-write in a single transaction/connection
    const updated = await prisma.$transaction(async (tx) => {
      const existing = await tx.problem.findFirst({
        where: { id, userId },
        select: { customFields: true },  // only fetch what we need
      });
      if (!existing) return null;

      const current = (existing.customFields as Record<string, string>) ?? {};
      let merged: Record<string, string>;
      if (body && typeof body === 'object' && 'key' in body && 'value' in body) {
        merged = { ...current, [body.key]: body.value };
      } else {
        merged = { ...current, ...body };
      }

      await tx.problem.update({ where: { id }, data: { customFields: merged } });
      return merged;
    });

    if (updated === null) {
      return Response.json({ error: 'Problem not found' }, { status: 404 });
    }

    return Response.json({ success: true, id, customFields: updated });
  } catch (e) {
    console.error('[PATCH /api/problems/[id]/custom-fields]', e);
    return Response.json({ error: 'Failed to update custom fields' }, { status: 500 });
  }
}
