import { describe, expect, it } from '@jest/globals';
import { MAX_TIER, nextTier } from '../difficulty';
import type { PlayerPerformance } from '../types';

const win: PlayerPerformance = { won: true, durationMs: 1000, moves: 20, moveLimit: 40, hintsUsed: 0, retries: 0 };
const loss: PlayerPerformance = { won: false, durationMs: 1000, moves: 40, moveLimit: 40, hintsUsed: 0, retries: 0 };

describe('adaptive difficulty', () => {
  it('does not change with too little history', () => {
    expect(nextTier(3, [win, win])).toBe(3);
  });

  it('moves up by at most one tier after consistent wins', () => {
    expect(nextTier(3, [win, win, win, win, win])).toBe(4);
  });

  it('moves down by at most one tier after consistent losses', () => {
    expect(nextTier(3, [loss, loss, loss, loss, loss])).toBe(2);
  });

  it('stays inside the tier bounds', () => {
    expect(nextTier(MAX_TIER, [win, win, win, win, win])).toBe(MAX_TIER);
    expect(nextTier(0, [loss, loss, loss, loss, loss])).toBe(0);
  });

  it('holds steady on mixed results', () => {
    expect(nextTier(3, [win, loss, win, loss, win])).toBe(3);
  });
});
