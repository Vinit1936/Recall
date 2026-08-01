// GET  /api/problems — list all problems for the current user
// POST /api/problems — add a new problem to the tracker

import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getResolver } from '@/lib/platforms';
import { getInitialSchedule } from '@/lib/scheduling';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status') ?? undefined;
    const topic = searchParams.get('topic') ?? undefined;

    const problems = await prisma.problem.findMany({
      where: {
        userId,
        ...(status ? { status: status as any } : {}),
        ...(topic ? { topic } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        revisions: {
          orderBy: { revisedAt: 'desc' },
          take: 1,
        },
      },
    });

    return Response.json(problems);
  } catch (e) {
    console.error('[GET /api/problems]', e);
    return Response.json({ error: 'Failed to fetch problems' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('[POST /api/problems] hit');
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const body = await request.json();
    const { platform, problemNumber, notes, dateSolved, customFields } = body;

    if (!platform || problemNumber == null) {
      return Response.json({ error: 'platform and problemNumber are required' }, { status: 400 });
    }

    const resolver = getResolver(platform);
    let meta: { title: string; difficulty: string; topic: string; url: string };

    if (resolver) {
      const result = resolver.resolve(String(problemNumber));
      if (result.found) {
        meta = result.data;
      } else {
        const { title, difficulty, topic, url } = body;
        if (!title || !difficulty || !topic || !url) {
          return Response.json(
            { error: 'Problem not found in local dataset. Provide title, difficulty, topic, and url manually.' },
            { status: 422 }
          );
        }
        meta = { title, difficulty, topic, url };
      }
    } else {
      const { title, difficulty, topic, url } = body;
      if (!title || !difficulty || !topic || !url) {
        return Response.json(
          { error: 'Unknown platform. Provide title, difficulty, topic, and url manually.' },
          { status: 422 }
        );
      }
      meta = { title, difficulty, topic, url };
    }

    const now = new Date();
    const schedule = getInitialSchedule(now);

    try {
      const problem = await prisma.problem.create({
        data: {
          userId,
          platform: platform as any,
          problemNumber: parseInt(String(problemNumber), 10),
          title: meta.title,
          url: meta.url,
          difficulty: meta.difficulty as any,
          topic: meta.topic,
          dateSolved: dateSolved ? new Date(dateSolved) : now,
          notes: notes ?? null,
          customFields: customFields ?? {},
          currentStep: schedule.currentStep,
          nextRevisionAt: schedule.nextRevisionAt,
          status: schedule.status,
        },
      });
      return Response.json(problem, { status: 201 });
    } catch (e: any) {
      if (e?.code === 'P2002') {
        return Response.json({ error: 'This problem already exists in your tracker.' }, { status: 409 });
      }
    }
  } catch (e) {
    console.error('[POST /api/problems]', e);
    return Response.json({ error: 'Failed to create problem' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = session.user.id;

    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return Response.json({ error: 'ids array is required' }, { status: 400 });
    }

    const deleted = await prisma.problem.deleteMany({
      where: {
        id: { in: ids },
        userId,
      },
    });

    return Response.json({ count: deleted.count, message: `Successfully deleted ${deleted.count} problems` });
  } catch (e) {
    console.error('[DELETE /api/problems]', e);
    return Response.json({ error: 'Failed to delete problems' }, { status: 500 });
  }
}

