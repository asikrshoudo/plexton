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
    const r = mergeTiles(s, 1, 2);
    const spawned = r.state.tiles.find((t) => t.id === s.nextId)!;
    expect(Math.abs(spawned.row - 2) + Math.abs(spawned.col - 3)).toBe(1);
  });

  it('rejects merging different values, and a tile with itself', () => {
    const s = make([[0, 0, 2], [0, 1, 4]]);
    expect(mergeTiles(s, 1, 2).ok).toBe(false);
    expect(mergeTiles(s, 1, 1).ok).toBe(false);
  });

  it('moving to an empty cell is free and spawns nothing', () => {
    const s = make([[0, 0, 2]]);
    const moved = moveTile(s, 1, 3, 3);
    expect(moved.moves).toBe(0);
    expect(moved.tiles.length).toBe(1);
    expect(moved.tiles[0]).toMatchObject({ row: 3, col: 3, value: 2 });
  });

  it('refuses to move onto an occupied cell', () => {
    const s = make([[0, 0, 2], [0, 1, 4]]);
    expect(moveTile(s, 1, 0, 1)).toBe(s);
  });

  it('refuses to move out of bounds or unknown tile', () => {
    const s = make([[0, 0, 2]]);
    expect(moveTile(s, 1, -1, 0)).toBe(s);
    expect(moveTile(s, 1, 5, 0)).toBe(s);
    expect(moveTile(s, 999, 1, 1)).toBe(s);
  });

  it('reports when no merges are possible', () => {
    expect(canMerge(make([[0, 0, 2], [0, 1, 4], [0, 2, 8]]))).toBe(false);
    expect(canMerge(make([[0, 0, 2], [0, 1, 2], [0, 2, 8]]))).toBe(true);
  });

  it('never reports a merge for a full board with all unique values', () => {
    const values = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432];
    const s = make(values.map((v, i) => [Math.floor(i / 5), i % 5, v] as [number, number, number]));
    expect(canMerge(s)).toBe(false);
  });

  it('spawn value is deterministic by seed and id', () => {
    expect(spawnValue(42, 7, [2, 4, 8])).toBe(spawnValue(42, 7, [2, 4, 8]));
    expect([2, 4, 8]).toContain(spawnValue(42, 7, [2, 4, 8]));
  });

  it('creates an initial state with the requested tile count', () => {
    const s = createInitialState(5, 99, [2, 4], 8);
    expect(s.tiles).toHaveLength(8);
    expect(s.moves).toBe(0);
    expect(s.score).toBe(0);
  });
});
