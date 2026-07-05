// GET  /api/problems — list all problems for the current user
// POST /api/problems — add a new problem to the tracker

import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getResolver } from '@/lib/platforms';
import { getInitialSchedule } from '@/lib/scheduling';

// TODO: Replace with real auth — hardcoded dev user for now
const DEV_USER_ID = 'dev-user-1';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status') ?? undefined;
    const topic = searchParams.get('topic') ?? undefined;

    const problems = await prisma.problem.findMany({
      where: {
        userId: DEV_USER_ID, // TODO: replace with real userId from auth
        ...(status ? { status: status as any } : {}),
        ...(topic ? { topic } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    return Response.json(problems);
  } catch (e) {
    console.error('[GET /api/problems]', e);
    return Response.json({ error: 'Failed to fetch problems' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, problemNumber, notes, dateSolved } = body;

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
        // Resolver didn't find it — require manual override fields
        const { title, difficulty, topic, url } = body;
        if (!title || !difficulty || !topic || !url) {
          return Response.json(
            {
              error:
                'Problem not found in local dataset. Provide title, difficulty, topic, and url manually.',
            },
            { status: 422 }
          );
        }
        meta = { title, difficulty, topic, url };
      }
    } else {
      // Unknown platform — require all fields manually
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
          userId: DEV_USER_ID, // TODO: replace with real userId from auth
          platform: platform as any,
          problemNumber: parseInt(String(problemNumber), 10),
          title: meta.title,
          url: meta.url,
          difficulty: meta.difficulty as any,
          topic: meta.topic,
          dateSolved: dateSolved ? new Date(dateSolved) : now,
          notes: notes ?? null,
          currentStep: schedule.currentStep,
          nextRevisionAt: schedule.nextRevisionAt,
          status: schedule.status,
        },
      });

      return Response.json(problem, { status: 201 });
    } catch (e: any) {
      // Prisma unique constraint violation (platform + problemNumber already exists for user)
      if (e?.code === 'P2002') {
        return Response.json(
          { error: 'This problem already exists in your tracker.' },
          { status: 409 }
        );
      }
      throw e;
    }
  } catch (e) {
    console.error('[POST /api/problems]', e);
    return Response.json({ error: 'Failed to create problem' }, { status: 500 });
  }
}
