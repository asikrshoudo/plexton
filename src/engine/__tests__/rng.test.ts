import { describe, expect, it } from '@jest/globals';
import { createRng, hashSeed, mixSeed } from '../rng';

describe('rng', () => {
  it('repeats the same sequence for the same seed', () => {
    const a = createRng(42);
    const b = createRng(42);
    const seqA = Array.from({ length: 20 }, () => a.next());
    const seqB = Array.from({ length: 20 }, () => b.next());
    expect(seqA).toEqual(seqB);
  });

  it('stays inside [0, 1) and int() stays in range', () => {
    const rng = createRng(7);
    for (let i = 0; i < 500; i += 1) {
      const v = rng.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
      const n = rng.int(5);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(5);
    }
  });

  it('hashes deterministically', () => {
    expect(hashSeed('numberMerge:1')).toBe(hashSeed('numberMerge:1'));
    expect(mixSeed(5, 3)).toBe(mixSeed(5, 3));
  });
});
