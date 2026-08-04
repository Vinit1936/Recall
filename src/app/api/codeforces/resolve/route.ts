// GET /api/codeforces/resolve?id=[code]
// Thin server-side wrapper around the local Codeforces resolver.

import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { codeforcesResolver } from '@/lib/platforms/codeforces';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return Response.json({ error: 'id query param required' }, { status: 400 });
    }

    const result = codeforcesResolver.resolve(id);
    console.log(`[GET /api/codeforces/resolve] id=${id} found=${result.found}`);
    return Response.json(result);
  } catch (e) {
    console.error('[GET /api/codeforces/resolve]', e);
    return Response.json({ error: 'Resolver failed' }, { status: 500 });
  }
}
