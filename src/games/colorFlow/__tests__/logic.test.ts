import { describe, expect, it } from '@jest/globals';
import { createState, dragTo, isSolved, startDrag, type Pair } from '../logic';

const pairs: Pair[] = [[0, 2], [3, 5], [6, 8]];

function draw(state: ReturnType<typeof createState>, color: number, cells: number[]) {
  let s = startDrag(state, cells[0]).state;
  for (const c of cells.slice(1)) s = dragTo(s, color, c);
  return s;
}

describe('colorFlow logic', () => {
  it('solves a 3x3 when every row is connected', () => {
    let s = createState(3, pairs);
    s = draw(s, 0, [0, 1, 2]);
    s = draw(s, 1, [3, 4, 5]);
    s = draw(s, 2, [6, 7, 8]);
    expect(isSolved(s)).toBe(true);
  });

  it('is not solved until the whole grid is filled', () => {
    const s = draw(createState(3, [[0, 2], [6, 8]]), 0, [0, 1, 2]);
    expect(isSolved(s)).toBe(false);
  });

  it('cuts another path instead of overlapping it', () => {
    let s = createState(3, pairs);
    s = draw(s, 0, [0, 1, 2]);
    s = draw(s, 1, [3, 4, 1]);
    expect(s.paths[0]).toEqual([0]);
    expect(s.paths[1]).toEqual([3, 4, 1]);
  });

  it('cannot enter the dot of another colour', () => {
    const s = draw(createState(3, [[0, 2], [3, 5]]), 0, [0, 3]);
    expect(s.paths[0]).toEqual([0]);
  });

  it('backtracks along its own path', () => {
    const s = draw(createState(3, pairs), 0, [0, 1, 4, 1]);
    expect(s.paths[0]).toEqual([0, 1]);
  });

  it('cannot extend past a completed path', () => {
    const s = draw(createState(3, [[0, 2], [6, 8]]), 0, [0, 1, 2, 5]);
    expect(s.paths[0]).toEqual([0, 1, 2]);
  });

  it('follows a finger that skipped cells', () => {
    const s = draw(createState(3, [[0, 8], [1, 7]]), 0, [0, 2]);
    expect(s.paths[0].length).toBeGreaterThan(1);
  });
});
