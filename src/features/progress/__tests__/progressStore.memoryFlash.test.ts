import { describe, expect, it, jest } from '@jest/globals';
import { recordResult, xpForResult } from '../progressStore';

jest.mock('@/storage/kv', () => ({
  readJson: jest.fn(() => ({})),
  writeJson: jest.fn(() => true),
}));

describe('progress/XP contract for memoryFlash', () => {
  it('awards XP only for wins', () => {
    expect(xpForResult({ gameId: 'memoryFlash', level: 1, won: false, score: 30, moves: 3, moveLimit: 5, durationMs: 1000, hintsUsed: 0, xpEarned: 0 }, 1)).toBe(0);
    expect(xpForResult({ gameId: 'memoryFlash', level: 1, won: true, score: 100, moves: 5, moveLimit: 5, durationMs: 1000, hintsUsed: 0, xpEarned: 0 }, 1)).toBe(22);
  });

  it('awards replay XP for already-cleared levels', () => {
    expect(xpForResult({ gameId: 'memoryFlash', level: 1, won: true, score: 100, moves: 5, moveLimit: 5, durationMs: 1000, hintsUsed: 0, xpEarned: 0 }, 3)).toBe(5);
  });

  it('recordResult returns 0 XP for loss and does not increment cleared level', () => {
    const r = recordResult({ gameId: 'memoryFlash', level: 2, won: false, score: 40, moves: 2, moveLimit: 5, durationMs: 1000, hintsUsed: 0, xpEarned: 0 });
    expect(r.xpEarned).toBe(0);
  });
});
