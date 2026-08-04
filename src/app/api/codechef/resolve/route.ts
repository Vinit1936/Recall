// GET /api/codechef/resolve?id=[code]
// Thin server-side wrapper around the local CodeChef resolver.
// 'id' is a CodeChef problem code like "FLOW001" or "TEST".

import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { codechefResolver } from '@/lib/platforms/codechef';

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

    const result = codechefResolver.resolve(id);
    console.log(`[GET /api/codechef/resolve] id=${id} found=${result.found}`);
    return Response.json(result);
  } catch (e) {
    console.error('[GET /api/codechef/resolve]', e);
    return Response.json({ error: 'Resolver failed' }, { status: 500 });
  }
}
