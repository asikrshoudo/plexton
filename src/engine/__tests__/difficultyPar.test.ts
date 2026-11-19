import { describe, expect, it } from '@jest/globals';
import { nextTier } from '../difficulty';
import type { PlayerPerformance } from '../types';

const base: PlayerPerformance = { won: true, durationMs: 1000, moves: 5, moveLimit: null, hintsUsed: 0, retries: 0, parMs: 1000 };
const fast = base;
const slow: PlayerPerformance = { ...base, durationMs: 4000 };

describe('par-time difficulty', () => {
  it('raises the tier after fast wins', () => {
    expect(nextTier(3, [fast, fast, fast])).toBe(4);
  });

  it('lowers the tier after very slow wins', () => {
    expect(nextTier(3, [slow, slow, slow])).toBe(2);
  });
});
