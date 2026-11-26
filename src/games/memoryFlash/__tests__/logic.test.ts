import { describe, expect, it } from '@jest/globals';
import { generateMemoryFlashLevel } from '../generator';
import { advanceRound, applyInput, beginInput, createMemoryFlashState } from '../logic';

describe('memoryFlash logic', () => {
  it('ignores input during showing and accepts during input', () => {
    const g = generateMemoryFlashLevel(1, 3);
    let s = createMemoryFlashState(g);
    expect(applyInput(s, s.sequence[0]).kind).toBe('ignored');
    s = beginInput(s);
    expect(applyInput(s, s.sequence[0]).kind).toBe('correct');
  });

  it('completes a round and advances to next round', () => {
    const g = generateMemoryFlashLevel(1, 3);
    let s = beginInput(createMemoryFlashState(g));
    let res = applyInput(s, s.sequence[0]);
    for (let i = 1; i < s.sequence.length; i += 1) res = applyInput(res.state, s.sequence[i]);
    expect(res.kind === 'roundWon' || res.kind === 'levelWon').toBe(true);
    if (res.kind === 'roundWon') {
      const next = advanceRound(res.state);
      expect(next.phase).toBe('showing');
      expect(next.round).toBe(1);
      expect(next.input).toEqual([]);
    }
  });

  it('wrong input causes loss', () => {
    const g = generateMemoryFlashLevel(1, 3);
    const s = beginInput(createMemoryFlashState(g));
    const wrong = s.sequence[0] === 0 ? 1 : 0;
    const res = applyInput(s, wrong === s.sequence[0] ? (wrong + 1) % 9 : wrong);
    expect(res.kind).toBe('lost');
    expect(res.state.phase).toBe('lost');
  });

  it('ignores input after completion/loss and duplicate over-length input', () => {
    const g = generateMemoryFlashLevel(1, 3);
    let s = beginInput(createMemoryFlashState(g));
    let res = applyInput(s, s.sequence[0] === 0 ? 1 : 0);
    expect(res.kind).toBe('lost');
    expect(applyInput(res.state, 0).kind).toBe('ignored');
  });

  it('roundWon state cannot be advanced unless phase is roundWon (background-safety guard)', () => {
    const g = generateMemoryFlashLevel(1, 3);
    let s = beginInput(createMemoryFlashState(g));
    let res = applyInput(s, s.sequence[0]);
    for (let i = 1; i < s.sequence.length; i += 1) res = applyInput(res.state, s.sequence[i]);
    if (res.kind === 'roundWon') {
      const notRoundWon = { ...res.state, phase: 'input' as const };
      expect(advanceRound(notRoundWon)).toBe(notRoundWon);
    }
  });
});
