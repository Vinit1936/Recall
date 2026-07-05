// GET /api/leetcode/resolve?id=[number]
// Thin server-side wrapper around the local LeetCode resolver.
// The resolver + JSON dataset never gets sent to the client directly.

import type { NextRequest } from 'next/server';
import { leetcodeResolver } from '@/lib/platforms/leetcode';

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return Response.json({ error: 'id query param required' }, { status: 400 });
    }

    const result = leetcodeResolver.resolve(id);
    return Response.json(result);
  } catch (e) {
    console.error('[GET /api/leetcode/resolve]', e);
    return Response.json({ error: 'Resolver failed' }, { status: 500 });
  }
}
