// GET /api/gfg/resolve?id=[url_or_slug]
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { gfgResolver } from '@/lib/platforms/gfg';

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

    const result = gfgResolver.resolve(id);
    console.log(`[GET /api/gfg/resolve] id=${id} found=${result.found}`);
    return Response.json(result);
  } catch (e) {
    console.error('[GET /api/gfg/resolve]', e);
    return Response.json({ error: 'Resolver failed' }, { status: 500 });
  }
}
