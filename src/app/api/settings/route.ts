// GET  /api/settings — fetch user profile & preference settings
// PATCH /api/settings — update user profile & preferences

import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) return Response.json({ error: 'User not found' }, { status: 404 });

    return Response.json({
      user,
      preferences: {
        defaultPlatform: 'LEETCODE',
        dailyTarget: 5,
      },
    });
  } catch (e) {
    console.error('[GET /api/settings]', e);
    return Response.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const body = await request.json();
    const { name } = body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined ? { name } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return Response.json({ success: true, user: updatedUser });
  } catch (e) {
    console.error('[PATCH /api/settings]', e);
    return Response.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
