import type { PlatformResolver, ResolveResult, ProblemMeta } from './types';
import problems from '../../data/leetcode-problems.json';

// Build an in-memory lookup map once at module load time.
// Map<number, ProblemMeta> keyed by problem id for O(1) lookups.
const problemMap = new Map<number, ProblemMeta>(
  (problems as any[]).map((p) => [
    p.id,
    {
      title: p.title,
      difficulty: p.difficulty,
      topic: p.topic,
      url: p.url,
    },
  ])
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
