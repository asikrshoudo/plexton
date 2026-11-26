import { describe, expect, it } from '@jest/globals';
import { generateMemoryFlashLevel, generateSequence, sequenceLengthForRound } from '../generator';

describe('memoryFlash generator', () => {
  it('is deterministic for same level/tier', () => {
    const a = generateMemoryFlashLevel(5, 3);
    const b = generateMemoryFlashLevel(5, 3);
    expect(a).toEqual(b);
    expect(generateSequence(a.config, 0)).toEqual(generateSequence(b.config, 0));
  });

  it('produces valid in-bounds unique sequences', () => {
    for (let level = 1; level <= 20; level += 1) {
      const g = generateMemoryFlashLevel(level, 3);
      for (let round = 0; round < g.config.targetRounds; round += 1) {
        const seq = generateSequence(g.config, round);
        expect(seq.length).toBe(sequenceLengthForRound(g.config, round));
        expect(new Set(seq).size).toBe(seq.length);
        seq.forEach((cell) => {
          expect(cell).toBeGreaterThanOrEqual(0);
          expect(cell).toBeLessThan(g.config.gridSize * g.config.gridSize);
        });
      }
    }
  });

  it('progresses difficulty gradually', () => {
    const l1 = generateMemoryFlashLevel(1, 3).config;
    const l8 = generateMemoryFlashLevel(8, 3).config;
    const l16 = generateMemoryFlashLevel(16, 3).config;
    expect(l1.startLength).toBeLessThanOrEqual(l8.startLength);
    expect(l8.gridSize).toBeGreaterThanOrEqual(l1.gridSize);
    expect(l16.gridSize).toBeGreaterThanOrEqual(l8.gridSize);
  });
});
