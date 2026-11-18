import { describe, expect, it } from '@jest/globals';
import { canMove, createInitialState, move, type BoardState } from '../logic';

function make(size: number, cells: [number, number, number][]): BoardState {
  return {
    size,
    seed: 1,
    tiles: cells.map(([row, col, value], i) => ({ id: i + 1, row, col, value })),
    score: 0,
    moves: 0,
    nextId: cells.length + 1,
  };
}

const at = (s: BoardState, r: number, c: number) => s.tiles.find((t) => t.row === r && t.col === c)?.value;

describe('numberMerge logic', () => {
  it('merges four equal tiles into two pairs (left)', () => {
    const s = make(4, [[0, 0, 2], [0, 1, 2], [0, 2, 2], [0, 3, 2]]);
    const r = move(s, 'left');
    expect(r.moved).toBe(true);
    expect(r.gained).toBe(8);
    expect(at(r.state, 0, 0)).toBe(4);
    expect(at(r.state, 0, 1)).toBe(4);
    expect(r.state.tiles.length).toBe(3);
  });

  it('never chains a merge in one move', () => {
    const s = make(4, [[1, 0, 4], [1, 1, 2], [1, 2, 2]]);
    const r = move(s, 'left');
    expect(r.gained).toBe(4);
    expect(at(r.state, 1, 0)).toBe(4);
    expect(at(r.state, 1, 1)).toBe(4);
  });

  it('slides right', () => {
    const s = make(4, [[0, 0, 2], [0, 1, 2]]);
    const r = move(s, 'right');
    expect(at(r.state, 0, 3)).toBe(4);
  });

  it('slides up', () => {
    const s = make(4, [[1, 2, 2], [3, 2, 2]]);
    const r = move(s, 'up');
    expect(at(r.state, 0, 2)).toBe(4);
  });

  it('rejects a move that changes nothing', () => {
    const s = make(4, [[0, 0, 2]]);
    const r = move(s, 'left');
    expect(r.moved).toBe(false);
    expect(r.state).toBe(s);
  });

  it('detects a dead board', () => {
    const cells: [number, number, number][] = [];
    for (let r = 0; r < 4; r += 1) for (let c = 0; c < 4; c += 1) cells.push([r, c, (r + c) % 2 === 0 ? 2 : 4]);
    expect(canMove(make(4, cells))).toBe(false);
    expect(canMove(make(4, cells.slice(1)))).toBe(true);
  });

  it('creates identical starting boards for the same seed', () => {
    expect(createInitialState(4, 99, 2)).toEqual(createInitialState(4, 99, 2));
  });
});
