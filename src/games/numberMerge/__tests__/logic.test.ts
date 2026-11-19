import { describe, expect, it } from '@jest/globals';
import { canMerge, createInitialState, mergeTiles, moveTile, spawnValue, type BoardState } from '../logic';

function make(cells: [number, number, number][]): BoardState {
  return {
    size: 5,
    seed: 1,
    pool: [2, 4],
    tiles: cells.map(([row, col, value], i) => ({ id: i + 1, row, col, value })),
    score: 0,
    moves: 0,
    nextId: cells.length + 1,
  };
}

describe('numberMerge logic', () => {
  it('merges two equal tiles into one doubled tile and counts a move', () => {
    const s = make([[0, 0, 2], [0, 1, 2], [4, 4, 8]]);
    const r = mergeTiles(s, 1, 2);
    expect(r.ok).toBe(true);
    expect(r.gained).toBe(4);
    expect(r.state.score).toBe(4);
    expect(r.state.moves).toBe(1);
    expect(r.state.tiles.find((t) => t.id === 2)?.value).toBe(4);
    expect(r.state.tiles.some((t) => t.id === 1)).toBe(false);
  });

  it('keeps the tile count steady (one tile spawns per merge)', () => {
    const s = make([[0, 0, 2], [0, 1, 2], [4, 4, 8]]);
    expect(mergeTiles(s, 1, 2).state.tiles.length).toBe(s.tiles.length);
  });

  it('spawns the new tile next to the merged tile', () => {
    const s = make([[2, 2, 2], [2, 3, 2]]);
    const spawned = mergeTiles(s, 1, 2).state.tiles.find((t) => t.id === 3);
    expect(spawned).toBeDefined();
    expect(Math.abs((spawned?.row ?? 0) - 2) + Math.abs((spawned?.col ?? 0) - 3)).toBe(1);
  });

  it('rejects tiles with different values', () => {
    const s = make([[0, 0, 2], [0, 1, 4]]);
    const r = mergeTiles(s, 1, 2);
    expect(r.ok).toBe(false);
    expect(r.state).toBe(s);
  });

  it('rejects dropping a tile on itself', () => {
    const s = make([[0, 0, 2], [0, 1, 2]]);
    expect(mergeTiles(s, 1, 1).ok).toBe(false);
  });

  it('moves a tile to an empty cell for free and refuses occupied cells', () => {
    const s = make([[0, 0, 2], [0, 1, 4]]);
    const moved = moveTile(s, 1, 3, 3);
    expect(moved.tiles.find((t) => t.id === 1)).toMatchObject({ row: 3, col: 3 });
    expect(moved.moves).toBe(0);
    expect(moveTile(s, 1, 0, 1)).toBe(s);
    expect(moveTile(s, 1, 9, 9)).toBe(s);
  });

  it('detects when no merge is possible', () => {
    expect(canMerge(make([[0, 0, 2], [0, 1, 4], [0, 2, 8]]))).toBe(false);
    expect(canMerge(make([[0, 0, 2], [0, 1, 4], [0, 2, 4]]))).toBe(true);
  });

  it('is deterministic and only spawns values from the pool', () => {
    expect(createInitialState(5, 99, [2, 4], 8)).toEqual(createInitialState(5, 99, [2, 4], 8));
    for (let id = 1; id < 200; id += 1) expect([2, 4, 8]).toContain(spawnValue(7, id, [2, 4, 8]));
  });
});
