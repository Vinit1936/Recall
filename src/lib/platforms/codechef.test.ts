import { describe, it, expect } from 'vitest';
import { codechefResolver } from './codechef';

describe('CodeChef resolver', () => {
  it('resolves problem FLOW001 (Add Two Numbers)', () => {
    const result = codechefResolver.resolve('FLOW001');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.data.title).toBe('Add Two Numbers');
      expect(result.data.difficulty).toBe('EASY');
      expect(result.data.url).toBe('https://www.codechef.com/problems/FLOW001');
    }
  });

  it('resolves problem case-insensitively (flow001)', () => {
    const result = codechefResolver.resolve('flow001');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.data.title).toBe('Add Two Numbers');
    }
  });

  it('resolves problem START01 (Number Mirror)', () => {
    const result = codechefResolver.resolve('START01');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.data.difficulty).toBe('EASY');
      expect(result.data.url).toBe('https://www.codechef.com/problems/START01');
    }
  });

  it('resolves problem HS08TEST (ATM)', () => {
    const result = codechefResolver.resolve('HS08TEST');
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.data.title).toBe('ATM');
    }
  });

  it('returns found: false for invalid code', () => {
    const result = codechefResolver.resolve('NOTAVALIDPROBLEMXYZ999');
    expect(result.found).toBe(false);
  });

  it('returns found: false for empty string', () => {
    const result = codechefResolver.resolve('');
    expect(result.found).toBe(false);
  });
});
