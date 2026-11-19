import { createRng, mixSeed } from '../../engine/rng';

export type Tile = { id: number; value: number; row: number; col: number };

export type BoardState = {
  size: number;
  seed: number;
  pool: readonly number[];
  tiles: Tile[];
  score: number;
  moves: number;
  nextId: number;
};

export type MergeResult = { state: BoardState; ok: boolean; gained: number };

// The value of the tile spawned with a given id depends only on (seed, id), never on the
// board layout, so the whole sequence is known in advance: the solver and the UI preview use it.
export function spawnValue(seed: number, id: number, pool: readonly number[]): number {
  const r = createRng(mixSeed(seed, id)).next();
  if (r < 0.7) return pool[0];
  return pool[1 + Math.floor(((r - 0.7) / 0.3) * (pool.length - 1))];
}

function emptyCells(size: number, tiles: readonly Tile[]): number[] {
  const occupied = new Set(tiles.map((t) => t.row * size + t.col));
  const out: number[] = [];
  for (let i = 0; i < size * size; i += 1) if (!occupied.has(i)) out.push(i);
  return out;
}

export function spawnTile(state: BoardState, near?: { row: number; col: number }): BoardState {
  const empties = emptyCells(state.size, state.tiles);
  if (empties.length === 0) return state;

  const rng = createRng(mixSeed(state.seed, state.nextId));
  rng.next(); // first draw is the value (see spawnValue)

  let candidates = empties;
  if (near) {
    const adjacent = empties.filter((cell) => {
      const r = Math.floor(cell / state.size);
      const c = cell % state.size;
      return Math.abs(r - near.row) + Math.abs(c - near.col) === 1;
    });
    if (adjacent.length > 0) candidates = adjacent;
  }
  const cell = candidates[rng.int(candidates.length)];
  const tile: Tile = {
    id: state.nextId,
    value: spawnValue(state.seed, state.nextId, state.pool),
    row: Math.floor(cell / state.size),
    col: cell % state.size,
  };
  return { ...state, tiles: [...state.tiles, tile], nextId: state.nextId + 1 };
}

export function createInitialState(size: number, seed: number, pool: readonly number[], startTiles: number): BoardState {
  let state: BoardState = { size, seed, pool, tiles: [], score: 0, moves: 0, nextId: 1 };
  for (let i = 0; i < startTiles; i += 1) state = spawnTile(state);
  return state;
}

// Drag `fromId` onto `toId`. Only equal values merge; the merged tile stays where `toId` was.
export function mergeTiles(state: BoardState, fromId: number, toId: number): MergeResult {
  const from = state.tiles.find((t) => t.id === fromId);
  const to = state.tiles.find((t) => t.id === toId);
  if (!from || !to || from.id === to.id || from.value !== to.value) return { state, ok: false, gained: 0 };

  const value = to.value * 2;
  const tiles = state.tiles.filter((t) => t.id !== fromId).map((t) => (t.id === toId ? { ...t, value } : t));
  const merged: BoardState = { ...state, tiles, score: state.score + value, moves: state.moves + 1 };
  return { state: spawnTile(merged, { row: to.row, col: to.col }), ok: true, gained: value };
}

// Moving a tile to an empty cell is free: it is not a move and spawns nothing.
export function moveTile(state: BoardState, id: number, row: number, col: number): BoardState {
  if (row < 0 || col < 0 || row >= state.size || col >= state.size) return state;
  if (state.tiles.some((t) => t.row === row && t.col === col)) return state;
  if (!state.tiles.some((t) => t.id === id)) return state;
  return { ...state, tiles: state.tiles.map((t) => (t.id === id ? { ...t, row, col } : t)) };
}

export function canMerge(state: BoardState): boolean {
  const seen = new Set<number>();
  for (const t of state.tiles) {
    if (seen.has(t.value)) return true;
    seen.add(t.value);
  }
  return false;
}

export function maxTile(state: BoardState): number {
  let best = 0;
  for (const t of state.tiles) if (t.value > best) best = t.value;
  return best;
}
