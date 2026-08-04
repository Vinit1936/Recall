// GET /api/hackerrank/resolve?id=[url_or_slug]
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { hackerrankResolver } from '@/lib/platforms/hackerrank';

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

    const result = hackerrankResolver.resolve(id);
    console.log(`[GET /api/hackerrank/resolve] id=${id} found=${result.found}`);
    return Response.json(result);
  } catch (e) {
    console.error('[GET /api/hackerrank/resolve]', e);
    return Response.json({ error: 'Resolver failed' }, { status: 500 });
  }
}
