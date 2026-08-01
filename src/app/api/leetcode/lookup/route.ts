// POST /api/leetcode/lookup
// Body: { titleSlug: string }
// Returns: ProblemMeta | { error: string }
//
// This route is the live fallback — called only when the local JSON dataset
// doesn't have the problem (i.e. brand-new problems not yet in the dataset).
// It queries LeetCode's public GraphQL API server-side.

import { NextRequest, NextResponse } from 'next/server';

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

const query = `
  query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionFrontendId
      title
      titleSlug
      difficulty
      topicTags { name }
      isPaidOnly
    }
  }
`;

export async function POST(req: NextRequest) {
  try {
    const { titleSlug } = await req.json();
    if (!titleSlug || typeof titleSlug !== 'string') {
      return NextResponse.json({ error: 'titleSlug required' }, { status: 400 });
    }

    const res = await fetch(LEETCODE_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({ query, variables: { titleSlug } }),
    });

    const json = await res.json();
    const q = json?.data?.question;

    if (!q || q.isPaidOnly) {
      return NextResponse.json({ error: 'Problem not found or is premium' }, { status: 404 });
    }

    const difficulty = (q.difficulty as string).toUpperCase() as 'EASY' | 'MEDIUM' | 'HARD';
    const topic = q.topicTags?.[0]?.name ?? '';

    return NextResponse.json({
      title: q.title,
      difficulty,
      topic,
      url: `https://leetcode.com/problems/${q.titleSlug}/`,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch from LeetCode' }, { status: 500 });
  }
}
