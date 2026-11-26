import { describe, expect, it } from '@jest/globals';
import { canFormWord, generateWordGameLevel, isValidWord, normalizeWord, scoreWord, submitWord, createWordGameState, addLetter, removeLetter, clearInput } from '../logic';

describe('wordGame logic', () => {
  it('normalizes input', () => {
    expect(normalizeWord('  Tea! ')).toBe('tea');
  });

  it('checks letter formation and validity', () => {
    expect(canFormWord('tone', 'stone')).toBe(true);
    expect(canFormWord('toned', 'stone')).toBe(false);
    expect(isValidWord('tone', 'stone', 3)).toBe(true);
    expect(isValidWord('zzzz', 'stone', 3)).toBe(false);
  });

  it('generates deterministic levels with solvable targets', () => {
    const a = generateWordGameLevel(3, 2);
    const b = generateWordGameLevel(3, 2);
    expect(a).toEqual(b);
    expect(a.config.targetWords.length).toBeGreaterThan(0);
    expect(a.config.targetScore).toBeGreaterThan(0);
    const total = a.config.targetWords.reduce((s, w) => s + scoreWord(w), 0);
    expect(a.config.targetScore).toBeLessThanOrEqual(total);
  });

  it('handles submit, duplicate, invalid, and win', () => {
    const level = generateWordGameLevel(1, 1);
    let s = createWordGameState(level);
    const word = level.config.targetWords.find((w) => w.length >= 3)!;
    const r1 = submitWord(s, word);
    expect(r1.kind === 'accepted' || r1.kind === 'won').toBe(true);
    if (r1.kind === 'accepted') {
      const r2 = submitWord(r1.state, word);
      expect(r2.kind).toBe('duplicate');
      const bad = submitWord(r1.state, 'zz');
      expect(bad.kind).toBe('invalid');
    } else {
      // already won by one word - submit on won state should be ignored
      expect(submitWord(r1.state, 'zz').kind).toBe('ignored');
    }
  });

  it('input helpers respect pool and phase', () => {
    const level = generateWordGameLevel(1, 1);
    let s = createWordGameState(level);
    const ch = level.config.letters[0];
    s = addLetter(s, ch);
    expect(s.currentInput).toContain(ch);
    s = removeLetter(s);
    expect(s.currentInput).toBe('');
    s = addLetter(s, ch);
    s = clearInput(s);
    expect(s.currentInput).toBe('');
  });
});
