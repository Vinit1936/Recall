import { leetcodeResolver } from './leetcode';
import { codeforcesResolver } from './codeforces';
import { codechefResolver } from './codechef';
import { gfgResolver } from './gfg';
import { hackerrankResolver } from './hackerrank';
import type { PlatformResolver } from './types';

// Registry of all supported platform resolvers.
// Add new platforms here as they are implemented.
export const resolvers: Record<string, PlatformResolver> = {
  LEETCODE: leetcodeResolver,
  CODEFORCES: codeforcesResolver,
  CODECHEF: codechefResolver,
  GFG: gfgResolver,
  HACKERRANK: hackerrankResolver,
};

// Returns the resolver for a given platform string, or null if unsupported.
export function getResolver(platform: string): PlatformResolver | null {
  return resolvers[platform] ?? null;
}
