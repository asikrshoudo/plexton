import { describe, expect, it, jest } from '@jest/globals';
import { baseTargetForLevel, generateNumberMergeLevel, validateNumberMergeLevel } from '../generator';

jest.setTimeout(120000);

describe('numberMerge generator', () => {
  it('produces valid, solvable levels for early levels', () => {
    for (let level = 1; level <= 6; level += 1) {
      const generated = generateNumberMergeLevel(level, 3);
      const result = validateNumberMergeLevel(generated);
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

  it('rejects a tampered level', () => {
    const g = generateNumberMergeLevel(1, 3);
    const bad = { ...g, config: { ...g.config, maxMoves: 1 } };
    expect(validateNumberMergeLevel(bad).valid).toBe(false);
  });

  it('scales the target with level', () => {
    expect(baseTargetForLevel(1)).toBeLessThan(baseTargetForLevel(13));
  });
});
