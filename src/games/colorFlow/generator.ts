import { clampTier } from '../../engine/difficulty';
import { createRng, hashSeed, type Rng } from '../../engine/rng';
import type { GameDefinition, GeneratedLevel, LevelConfig, ValidationResult } from '../../engine/types';
import { areAdjacent, createState, dragTo, isSolved, startDrag } from './logic';

export type ColorFlowConfig = LevelConfig & {
  size: number;
  pairCount: number;
  parMs: number;
};

export interface ColorFlowLevel extends GeneratedLevel<ColorFlowConfig> {
  pairs: [number, number][];
  solution: number[][];
}

const MIN_PATH = 3; // keeps the two dots of a pair from touching
const MAX_ATTEMPTS = 20;

export function sizeForLevel(level: number): number {
  return Math.min(8, 5 + Math.floor((Math.max(1, level) - 1) / 4));
}

// Easier tiers = more, shorter paths. Harder tiers = fewer, longer paths.
export function pairCountFor(size: number, tier: number): number {
  const wanted = size + 1 - Math.round(clampTier(tier) / 4);
  return Math.max(3, Math.min(Math.floor((size * size) / MIN_PATH), wanted));
}

function neighbors(cell: number, size: number): number[] {
  const r = Math.floor(cell / size);
  const c = cell % size;
  const out: number[] = [];
  if (r > 0) out.push(cell - size);
  if (r < size - 1) out.push(cell + size);
  if (c > 0) out.push(cell - 1);
  if (c < size - 1) out.push(cell + 1);
  return out;
}

function snakePath(size: number): number[] {
  const path: number[] = [];
  for (let r = 0; r < size; r += 1) {
    for (let k = 0; k < size; k += 1) path.push(r * size + (r % 2 === 0 ? k : size - 1 - k));
  }
  return path;
}

// Backbite moves keep the path Hamiltonian while scrambling its shape.
export function randomHamiltonianPath(size: number, rng: Rng): number[] {
  let p = snakePath(size);
  const iterations = size * size * 12;
  for (let i = 0; i < iterations; i += 1) {
    const m = p.length - 1;
    const head = rng.next() < 0.5;
    const end = head ? p[0] : p[m];
    const options = neighbors(end, size);
    const j = p.indexOf(options[rng.int(options.length)]);
    if (head) {
      if (j <= 1) continue;
      p = [...p.slice(0, j).reverse(), ...p.slice(j)];
    } else {
      if (j >= m - 1) continue;
      p = [...p.slice(0, j + 1), ...p.slice(j + 1).reverse()];
    }
  }
  return p;
}

function splitPath(path: number[], count: number, rng: Rng): number[][] {
  const lengths = new Array<number>(count).fill(MIN_PATH);
  for (let extra = path.length - count * MIN_PATH; extra > 0; extra -= 1) {
    lengths[Math.floor(rng.next() * rng.next() * count)] += 1; // skewed so lengths vary
  }
  const out: number[][] = [];
  let at = 0;
  for (const len of lengths) {
    out.push(path.slice(at, at + len));
    at += len;
  }
  return out;
}

export function validateColorFlowLevel(level: ColorFlowLevel): ValidationResult {
  const reasons: string[] = [];
  const { config, pairs, solution } = level;
  const { size } = config;
  const total = size * size;

  if (size < 4 || size > 9) reasons.push('invalid grid size');
  if (pairs.length < 2 || pairs.length > Math.floor(total / MIN_PATH)) reasons.push('invalid pair count');
  if (solution.length !== pairs.length) reasons.push('solution does not match pairs');
  if (reasons.length > 0) return { valid: false, reasons };

  const seen = new Set<number>();
  pairs.forEach(([a, b], i) => {
    const path = solution[i];
    if (a === b || a < 0 || b < 0 || a >= total || b >= total) reasons.push(`pair ${i + 1} has invalid dots`);
    else if (areAdjacent(a, b, size)) reasons.push(`pair ${i + 1} dots touch`);
    if (path.length < MIN_PATH) reasons.push(`path ${i + 1} is too short`);
    const first = path[0];
    const last = path[path.length - 1];
    if (!((first === a && last === b) || (first === b && last === a))) reasons.push(`path ${i + 1} misses its dots`);
    path.forEach((cell, k) => {
      if (cell < 0 || cell >= total) reasons.push(`path ${i + 1} leaves the grid`);
      if (seen.has(cell)) reasons.push(`path ${i + 1} overlaps another path`);
      seen.add(cell);
      if (k > 0 && !areAdjacent(path[k - 1], cell, size)) reasons.push(`path ${i + 1} is not continuous`);
    });
  });
  if (seen.size !== total) reasons.push('solution leaves cells empty');

  if (reasons.length === 0) {
    let state = createState(size, pairs);
    solution.forEach((path, i) => {
      state = startDrag(state, path[0]).state;
      for (let k = 1; k < path.length; k += 1) state = dragTo(state, i, path[k]);
    });
    if (!isSolved(state)) reasons.push('solution replay does not solve the level');
  }
  return { valid: reasons.length === 0, reasons };
}

export function generateColorFlowLevel(level: number, difficultyTier: number): ColorFlowLevel {
  const tier = clampTier(difficultyTier);
  const size = sizeForLevel(level);
  const pairCount = pairCountFor(size, tier);

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const seed = hashSeed(`colorFlow:${level}:${attempt}`);
    const rng = createRng(seed);
    const path = randomHamiltonianPath(size, rng);
    const solution = splitPath(path, pairCount, rng);
    const candidate: ColorFlowLevel = {
      config: { gameId: 'colorFlow', level, seed, difficultyTier: tier, size, pairCount, parMs: size * size * 1500 },
      pairs: solution.map((s) => [s[0], s[s.length - 1]]),
      solution,
    };
    if (validateColorFlowLevel(candidate).valid) return candidate;
  }
  throw new Error(`Could not generate a valid Color Flow level ${level}`);
}

export const colorFlowDefinition: GameDefinition<ColorFlowConfig, ColorFlowLevel> = {
  id: 'colorFlow',
  generator: { generate: generateColorFlowLevel },
  validator: { validate: validateColorFlowLevel },
};
