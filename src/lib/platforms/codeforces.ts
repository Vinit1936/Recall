import type { PlatformResolver, ResolveResult, ProblemMeta } from './types';
import problems from '../../data/codeforces-problems.json';

// Build in-memory lookup maps for both string code ("4A") and numericId (401)
const codeMap = new Map<string, ProblemMeta>();
const numMap = new Map<number, ProblemMeta>();

(problems as any[]).forEach((p) => {
  const meta: ProblemMeta = {
    title: p.title,
    difficulty: p.difficulty,
    topic: p.topic,
    url: p.url,
    problemNumber: p.numericId,
    code: p.id,
  };
  codeMap.set(p.id.toUpperCase(), meta);
  if (p.numericId) {
    numMap.set(p.numericId, meta);
  }
});

class CodeforcesResolver implements PlatformResolver {
  resolve(identifier: string): ResolveResult {
    const raw = identifier.trim().toUpperCase();
    if (!raw) return { found: false };

    // 1. Direct code lookup (e.g. "4A", "158A")
    let data = codeMap.get(raw);
    if (data) return { found: true, data };

    // 2. Numeric ID lookup (e.g. "401")
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      data = numMap.get(num);
      if (data) return { found: true, data };
    }

    return { found: false };
  }
}

export const codeforcesResolver = new CodeforcesResolver();
