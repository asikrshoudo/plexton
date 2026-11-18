import { createInitialState, DIRECTIONS, maxTile, move, type BoardState, type Direction } from './logic';


const DEPTH = 2;

function evaluate(s: BoardState): number {
  const size = s.size;
  const grid = new Array<number>(size * size).fill(0);
  let maxV = 0;
  let maxIdx = 0;
  for (const t of s.tiles) {
    const i = t.row * size + t.col;
    grid[i] = t.value;
    if (t.value > maxV) {
      maxV = t.value;
      maxIdx = i;
    }
  }
  const empties = size * size - s.tiles.length;
  let pairs = 0;
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      const i = r * size + c;
      const v = grid[i];
      if (v === 0) continue;
      if (c + 1 < size && grid[i + 1] === v) pairs += 1;
      if (r + 1 < size && grid[i + size] === v) pairs += 1;
    }
  }
  const corners = [0, size - 1, size * (size - 1), size * size - 1];
  const logMax = Math.log2(maxV || 1);
  return empties * 10 + pairs * 3 + logMax * 5 + (corners.includes(maxIdx) ? logMax * 4 : 0);
}

function lookahead(s: BoardState, depth: number, target: number): number {
  if (maxTile(s) >= target) return 1e5;
  if (depth === 0) return evaluate(s);
  let best = -1e6;
  for (const d of DIRECTIONS) {
    const r = move(s, d);
    if (!r.moved) continue;
    const v = lookahead(r.state, depth - 1, target);
    if (v > best) best = v;
  }
  return best;
}

export type SolveInput = { size: number; seed: number; startTiles: number; target: number };

// Plays the real rules (spawns are deterministic), so a returned path is an exact solution.
export function solve({ size, seed, startTiles, target }: SolveInput, cap: number): Direction[] | null {
  let state = createInitialState(size, seed, startTiles);
  const path: Direction[] = [];
  while (path.length < cap) {
    if (maxTile(state) >= target) return path;
    let bestDir: Direction | null = null;
    let bestState: BoardState | null = null;
    let bestVal = -Infinity;
    for (const d of DIRECTIONS) {
      const r = move(state, d);
      if (!r.moved) continue;
      const v = lookahead(r.state, DEPTH - 1, target);
      if (v > bestVal) {
        bestVal = v;
        bestDir = d;
        bestState = r.state;
      }
    }
    if (!bestDir || !bestState) return null;
    path.push(bestDir);
    state = bestState;
  }
  return maxTile(state) >= target ? path : null;
}
