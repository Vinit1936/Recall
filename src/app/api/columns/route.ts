// GET  /api/columns — list custom columns
// POST /api/columns — create a new custom column

import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const columns = await prisma.userColumnConfig.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
    return Response.json(columns, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (e) {
    console.error('[GET /api/columns]', e);
    return Response.json({ error: 'Failed to fetch columns' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const { name, order } = await request.json();
    if (!name || typeof name !== 'string') {
      return Response.json({ error: 'name is required' }, { status: 400 });
    }

    const column = await prisma.userColumnConfig.create({
      data: { userId, name: name.trim(), order: order ?? 0 },
    });
    return Response.json(column, { status: 201 });
  } catch (e) {
    console.error('[POST /api/columns]', e);
    return Response.json({ error: 'Failed to create column' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Column id is required' }, { status: 400 });
    }

    const existing = await prisma.userColumnConfig.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return Response.json({ error: 'Column not found' }, { status: 404 });
    }

    await prisma.userColumnConfig.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (e) {
    console.error('[DELETE /api/columns]', e);
    return Response.json({ error: 'Failed to delete column' }, { status: 500 });
  }
}
