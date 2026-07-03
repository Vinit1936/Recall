# Task: LeetCode metadata resolver — dataset + resolver module + live fallback

This step builds the module that powers auto-fill when a user types a LeetCode problem number. Two parts: (1) download and process the dataset, (2) write the resolver with a live GraphQL fallback for missing problems.

## Hard constraints

- Do NOT touch the Prisma schema
- Do NOT create any UI components or pages
- Do NOT make live API calls at module load time — local JSON only for the primary lookup
- Live GraphQL fallback runs ONLY from a Next.js API route (server-side), never client-side
- If anything fails, STOP and report the exact error — do not work around it
- Keep the resolver as a standalone module — no Next.js-specific imports inside it

---

## Step 1 — Download and process the dataset

Download the dataset from HuggingFace:
https://huggingface.co/datasets/kaysss/leetcode-problem-set

Get the raw data file (parquet or JSON, whichever is directly accessible). Process it into a clean JSON file at `src/data/leetcode-problems.json` with this exact structure — an array of objects:

```json
[
  {
    "id": 1,
    "title": "Two Sum",
    "slug": "two-sum",
    "difficulty": "EASY",
    "topic": "Array",
    "url": "https://leetcode.com/problems/two-sum/"
  },
  ...
]
```

Processing rules:
- `id` = `frontendQuestionId` parsed as integer
- `title` = `title` as-is
- `slug` = `titleSlug` as-is
- `difficulty` = uppercased version of source difficulty (`Easy` → `EASY`, `Medium` → `MEDIUM`, `Hard` → `HARD`)
- `topic` = first tag from `topicTags` array as a plain string (e.g. `"Array"`, not `["Array", "Hash Table"]`). If topicTags is empty, use `"General"`
- `url` = `https://leetcode.com/problems/{slug}/`
- Skip any problems where `paidOnly` is true — we can't link users to premium problems
- Skip any problems where `id` is null or not a valid integer

After processing, confirm how many problems are in the final JSON (should be roughly 3,000-3,500).

---

## Step 2 — Platform resolver types (if not already created)

If `src/lib/platforms/types.ts` doesn't exist yet, create it:

```typescript
export type ProblemMeta = {
  title: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  topic: string;
  url: string;
};

export type ResolveResult =
  | { found: true; data: ProblemMeta }
  | { found: false };

export interface PlatformResolver {
  resolve(identifier: string): ResolveResult;
}
```

---

## Step 3 — LeetCode local resolver

Create `src/lib/platforms/leetcode.ts`:

- On module load, import `src/data/leetcode-problems.json` and build an in-memory `Map<number, ProblemMeta>` keyed by problem id. Build this map ONCE at module level.
- `resolve(identifier: string): ResolveResult`:
  - Parse identifier as integer
  - Look up in the Map
  - If found → return `{ found: true, data: ProblemMeta }`
  - If not found or invalid integer → return `{ found: false }`
- Export a singleton: `export const leetcodeResolver: PlatformResolver`

```typescript
import type { PlatformResolver, ResolveResult, ProblemMeta } from './types';
import problems from '../../data/leetcode-problems.json';

// build lookup map once at module load
const problemMap = new Map<number, ProblemMeta>(
  (problems as any[]).map((p) => [p.id, {
    title: p.title,
    difficulty: p.difficulty,
    topic: p.topic,
    url: p.url,
  }])
);

class LeetCodeResolver implements PlatformResolver {
  resolve(identifier: string): ResolveResult {
    const id = parseInt(identifier, 10);
    if (isNaN(id)) return { found: false };
    const data = problemMap.get(id);
    if (!data) return { found: false };
    return { found: true, data };
  }
}

export const leetcodeResolver = new LeetCodeResolver();
```

---

## Step 4 — Live GraphQL fallback API route

Create `src/app/api/leetcode/lookup/route.ts`:

This is called ONLY when the local resolver returns `{ found: false }` — i.e. a brand new problem not yet in the dataset. It takes a problem number, constructs a slug guess OR requires the user to provide a URL with the slug embedded, then queries LeetCode's GraphQL.

```typescript
// POST /api/leetcode/lookup
// Body: { titleSlug: string }
// Returns: ProblemMeta | { error: string }

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
    const topic = q.topicTags?.[0]?.name ?? 'General';

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
```

---

## Step 5 — Resolver registry

Create `src/lib/platforms/index.ts`:

```typescript
import { leetcodeResolver } from './leetcode';
import type { PlatformResolver } from './types';

export const resolvers: Record<string, PlatformResolver> = {
  LEETCODE: leetcodeResolver,
};

export function getResolver(platform: string): PlatformResolver | null {
  return resolvers[platform] ?? null;
}
```

---

## Step 6 — Tests

Create `src/lib/platforms/leetcode.test.ts` using vitest:

```typescript
import { describe, it, expect } from 'vitest';
import { leetcodeResolver } from './leetcode';

describe('LeetCode resolver', () => {
  it('resolves problem 1 (Two Sum)', () => {
    const result = leetcodeResolver.resolve('1');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.data.title).toBe('Two Sum');
      expect(result.data.difficulty).toBe('EASY');
      expect(result.data.url).toContain('https://leetcode.com/problems/');
      expect(result.data.topic).toBeTruthy();
    }
  });

  it('resolves problem 234 (Palindrome Linked List)', () => {
    const result = leetcodeResolver.resolve('234');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.data.title).toBe('Palindrome Linked List');
      expect(result.data.difficulty).toBe('EASY');
    }
  });

  it('resolves a Medium problem with correct difficulty', () => {
    const result = leetcodeResolver.resolve('2');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.data.difficulty).toBe('MEDIUM');
    }
  });

  it('returns found: false for invalid number', () => {
    const result = leetcodeResolver.resolve('99999');
    expect(result.found).toBe(false);
  });

  it('returns found: false for non-numeric input', () => {
    const result = leetcodeResolver.resolve('abc');
    expect(result.found).toBe(false);
  });

  it('topic is a non-empty string', () => {
    const result = leetcodeResolver.resolve('1');
    if (result.found) {
      expect(typeof result.data.topic).toBe('string');
      expect(result.data.topic.length).toBeGreaterThan(0);
    }
  });

  it('url starts with https://leetcode.com/problems/', () => {
    const result = leetcodeResolver.resolve('1');
    if (result.found) {
      expect(result.data.url).toMatch(/^https:\/\/leetcode\.com\/problems\//);
    }
  });
});
```

---

## Definition of done

- `src/data/leetcode-problems.json` exists, contains 3000+ problems, each with id/title/slug/difficulty/topic/url
- `src/lib/platforms/types.ts` exists
- `src/lib/platforms/leetcode.ts` exists with working local resolver
- `src/lib/platforms/index.ts` exists with registry
- `src/app/api/leetcode/lookup/route.ts` exists (live GraphQL fallback)
- `src/lib/platforms/leetcode.test.ts` exists
- `npm test` passes ALL tests — both scheduling tests and resolver tests
- Tell me the total problem count in the JSON and show full test output
- Stop here — do not build any UI or API routes beyond the lookup route above