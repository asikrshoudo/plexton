import { describe, expect, it, jest } from '@jest/globals';
import { generateNumberMergeLevel, poolForLevel, targetForLevel, validateNumberMergeLevel } from '../generator';

jest.setTimeout(120000);

describe('numberMerge generator', () => {
  it('produces valid, solvable levels', () => {
    for (const level of [1, 2, 3, 5, 9, 13]) {
      const g = generateNumberMergeLevel(level, 3);
      const result = validateNumberMergeLevel(g);
      expect(result.reasons).toEqual([]);
      expect(result.valid).toBe(true);
    }
  });

  it('is reproducible for the same level and tier', () => {
    expect(generateNumberMergeLevel(2, 3)).toEqual(generateNumberMergeLevel(2, 3));
  });

  it('gives a tighter move limit at a higher tier on the same board', () => {
    const easy = generateNumberMergeLevel(1, 0);
    const hard = generateNumberMergeLevel(1, 10);
    expect(easy.config.seed).toBe(hard.config.seed);
    expect(easy.config.maxMoves).toBeGreaterThan(hard.config.maxMoves);
  });

  it('rejects tampered levels', () => {
    const g = generateNumberMergeLevel(1, 3);
    expect(validateNumberMergeLevel({ ...g, config: { ...g.config, maxMoves: 1 } }).valid).toBe(false);
    expect(validateNumberMergeLevel({ ...g, solution: [...g.solution.slice(0, -1)] }).valid).toBe(false);
  });

  it('scales target and spawn pool with level', () => {
    expect(targetForLevel(1)).toBeLessThan(targetForLevel(13));
    expect(poolForLevel(1).length).toBeLessThan(poolForLevel(13).length);
  });
});
