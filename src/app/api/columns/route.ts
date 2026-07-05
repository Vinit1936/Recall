// GET  /api/columns — list all custom columns for the user
// POST /api/columns — create a new custom column

import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// TODO: Replace with real auth — hardcoded dev user for now
const DEV_USER_ID = 'dev-user-1';

export async function GET(_request: NextRequest) {
  try {
    const columns = await prisma.userColumnConfig.findMany({
      where: { userId: DEV_USER_ID }, // TODO: replace with real userId from auth
      orderBy: { order: 'asc' },
    });
    return Response.json(columns);
  } catch (e) {
    console.error('[GET /api/columns]', e);
    return Response.json({ error: 'Failed to fetch columns' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, order } = await request.json();
    if (!name || typeof name !== 'string') {
      return Response.json({ error: 'name is required' }, { status: 400 });
    }

    const column = await prisma.userColumnConfig.create({
      data: {
        userId: DEV_USER_ID, // TODO: replace with real userId from auth
        name: name.trim(),
        order: order ?? 0,
      },
    });
    return Response.json(column, { status: 201 });
  } catch (e) {
    console.error('[POST /api/columns]', e);
    return Response.json({ error: 'Failed to create column' }, { status: 500 });
  }
}
