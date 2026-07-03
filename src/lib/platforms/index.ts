import { leetcodeResolver } from './leetcode';
import type { PlatformResolver } from './types';

// Registry of all supported platform resolvers.
// Add new platforms here as they are implemented.
export const resolvers: Record<string, PlatformResolver> = {
  LEETCODE: leetcodeResolver,
};

// Returns the resolver for a given platform string, or null if unsupported.
export function getResolver(platform: string): PlatformResolver | null {
  return resolvers[platform] ?? null;
}
