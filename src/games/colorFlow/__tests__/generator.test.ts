import { describe, expect, it, jest } from '@jest/globals';
import { createRng } from '../../../engine/rng';
import { generateColorFlowLevel, pairCountFor, randomHamiltonianPath, sizeForLevel, validateColorFlowLevel } from '../generator';

jest.setTimeout(60000);

describe('colorFlow generator', () => {
  it('builds Hamiltonian paths that cover every cell once', () => {
    for (const size of [5, 6, 8]) {
      const path = randomHamiltonianPath(size, createRng(size * 31));
      expect(new Set(path).size).toBe(size * size);
    }
  });

  it('produces valid levels across levels and tiers', () => {
    for (const level of [1, 2, 5, 9, 13, 20]) {
      for (const tier of [0, 3, 10]) {
        const g = generateColorFlowLevel(level, tier);
        const result = validateColorFlowLevel(g);
        expect(result.reasons).toEqual([]);
        expect(result.valid).toBe(true);
      }
    }
  });

  it('is reproducible for the same level and tier', () => {
    expect(generateColorFlowLevel(3, 3)).toEqual(generateColorFlowLevel(3, 3));
  });

  it('uses fewer pairs at higher tiers on the same grid', () => {
    expect(generateColorFlowLevel(1, 0).config.pairCount).toBeGreaterThan(generateColorFlowLevel(1, 10).config.pairCount);
    expect(pairCountFor(5, 0)).toBeGreaterThan(pairCountFor(5, 10));
  });

  it('grows the grid with level', () => {
    expect(sizeForLevel(1)).toBe(5);
    expect(sizeForLevel(13)).toBe(8);
    expect(sizeForLevel(99)).toBe(8);
  });

  it('rejects a tampered solution', () => {
    const g = generateColorFlowLevel(1, 3);
    const bad = { ...g, solution: [g.solution[0].slice(0, -1), ...g.solution.slice(1)] };
    expect(validateColorFlowLevel(bad).valid).toBe(false);
  });
});
