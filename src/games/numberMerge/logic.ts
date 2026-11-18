import { createRng, mixSeed } from '../../engine/rng';

export type Direction = 'up' | 'down' | 'left' | 'right';
export const DIRECTIONS: readonly Direction[] = ['down', 'left', 'right', 'up'];

export type Tile = { id: number; value: number; row: number; col: number };

export type BoardState = {
  size: number;
  seed: number;
  tiles: Tile[];
  score: number;
  moves: number;
  nextId: number;
};

export type MoveResult = { state: BoardState; moved: boolean; gained: number };

function emptyCells(size: number, tiles: readonly Tile[]): number[] {
  const occupied = new Set(tiles.map((t) => t.row * size + t.col));
  const out: number[] = [];
  for (let i = 0; i < size * size; i += 1) {
    if (!occupied.has(i)) out.push(i);
  }
  return out;
}

// Spawn position/value depend only on (seed, nextId), so a level is fully reproducible.
export function spawnTile(state: BoardState): BoardState {
  const empties = emptyCells(state.size, state.tiles);
  if (empties.length === 0) return state;
  const rng = createRng(mixSeed(state.seed, state.nextId));
  const cell = empties[rng.int(empties.length)];
  const value = rng.next() < 0.9 ? 2 : 4;
  const tile: Tile = {
    id: state.nextId,
    value,
    row: Math.floor(cell / state.size),
    col: cell % state.size,
  };
  return { ...state, tiles: [...state.tiles, tile], nextId: state.nextId + 1 };
}

export function createInitialState(size: number, seed: number, startTiles: number): BoardState {
  let state: BoardState = { size, seed, tiles: [], score: 0, moves: 0, nextId: 1 };
  for (let i = 0; i < startTiles; i += 1) state = spawnTile(state);
  return state;
}

export function move(state: BoardState, dir: Direction): MoveResult {
  const { size } = state;
  const horizontal = dir === 'left' || dir === 'right';
  const forward = dir === 'left' || dir === 'up';

  const lines: Tile[][] = Array.from({ length: size }, () => []);
  for (const t of state.tiles) lines[horizontal ? t.row : t.col].push(t);

  const next: Tile[] = [];
  let gained = 0;
  let moved = false;

  for (let li = 0; li < size; li += 1) {
    const line = lines[li].slice().sort((a, b) => {
      const pa = horizontal ? a.col : a.row;
      const pb = horizontal ? b.col : b.row;
      return forward ? pa - pb : pb - pa;
    });

    const out: Tile[] = [];
    let lastMerged = false;
    for (const t of line) {
      const last = out[out.length - 1];
      if (last && !lastMerged && last.value === t.value) {
        out[out.length - 1] = { ...last, value: last.value * 2 };
        gained += last.value * 2;
        lastMerged = true;
        moved = true;
      } else {
        out.push({ ...t });
        lastMerged = false;
      }
    }

    out.forEach((t, k) => {
      const idx = forward ? k : size - 1 - k;
      const row = horizontal ? li : idx;
      const col = horizontal ? idx : li;
      if (t.row !== row || t.col !== col) moved = true;
      next.push({ ...t, row, col });
    });
  }

  if (!moved) return { state, moved: false, gained: 0 };

  const slid: BoardState = { ...state, tiles: next, score: state.score + gained, moves: state.moves + 1 };
  return { state: spawnTile(slid), moved: true, gained };
}

export function maxTile(state: BoardState): number {
  let best = 0;
  for (const t of state.tiles) if (t.value > best) best = t.value;
  return best;
}

export function canMove(state: BoardState): boolean {
  const { size } = state;
  if (state.tiles.length < size * size) return true;
  const grid = new Map<number, number>();
  for (const t of state.tiles) grid.set(t.row * size + t.col, t.value);
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      const v = grid.get(r * size + c);
      if (c + 1 < size && grid.get(r * size + c + 1) === v) return true;
      if (r + 1 < size && grid.get((r + 1) * size + c) === v) return true;
    }
  }
  return false;
}
