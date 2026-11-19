import { clampTier } from '../../engine/difficulty';
import { hashSeed } from '../../engine/rng';
import type { GameDefinition, GeneratedLevel, LevelConfig, ValidationResult } from '../../engine/types';
import { createInitialState, maxTile, mergeTiles } from './logic';
import { solve } from './solver';

export type NumberMergeConfig = LevelConfig & {
  size: number;
  target: number;
  maxMoves: number;
  startTiles: number;
  pool: number[];
};

export interface NumberMergeLevel extends GeneratedLevel<NumberMergeConfig> {
  // The value merged at each step of a known winning line.
  solution: number[];
}

const SIZE = 5;
const START_TILES = 8;
const SOLVER_CAP = 150;
const ATTEMPTS_PER_TARGET = 8;
const MIN_TARGET = 16;

const isPow2 = (n: number) => n >= 2 && (n & (n - 1)) === 0;

export function targetForLevel(level: number): number {
  return 2 ** (5 + Math.min(3, Math.floor((Math.max(1, level) - 1) / 4)));
}

export function poolForLevel(level: number): number[] {
  return [2, 4, 8, 16].slice(0, 2 + Math.min(2, Math.floor((Math.max(1, level) - 1) / 6)));
}

// Tier 0 = generous (2.4x the known line), tier 10 = tight (1.6x). Always visible to the player.
export function slackForTier(tier: number): number {
  return 2.4 - clampTier(tier) * 0.08;
}

export function validateNumberMergeLevel(level: NumberMergeLevel): ValidationResult {
  const reasons: string[] = [];
  const { config, solution } = level;

  if (config.size < 4 || config.size > 6) reasons.push('invalid board size');
  if (config.target < MIN_TARGET || !isPow2(config.target)) reasons.push('target must be a power of two >= 16');
  if (config.pool.length < 2 || !config.pool.every(isPow2)) reasons.push('invalid spawn pool');
  if (config.startTiles < 4 || config.startTiles > (config.size * config.size) / 2) reasons.push('invalid start tile count');
  if (solution.length === 0) reasons.push('empty solution');
  if (config.maxMoves < solution.length) reasons.push('move limit shorter than the known solution');

  if (reasons.length === 0) {
    let state = createInitialState(config.size, config.seed, config.pool, config.startTiles);
    for (const value of solution) {
      const same = state.tiles.filter((t) => t.value === value);
      if (same.length < 2) {
        reasons.push('solution contains an illegal merge');
        break;
      }
      const r = mergeTiles(state, same[0].id, same[1].id);
      if (!r.ok) {
        reasons.push('solution contains an illegal merge');
        break;
      }
      state = r.state;
    }
    if (reasons.length === 0 && maxTile(state) < config.target) reasons.push('solution does not reach the target');
  }
  return { valid: reasons.length === 0, reasons };
}

export function generateNumberMergeLevel(level: number, difficultyTier: number): NumberMergeLevel {
  const tier = clampTier(difficultyTier);
  const pool = poolForLevel(level);
  let target = targetForLevel(level);

  while (target >= MIN_TARGET) {
    for (let attempt = 0; attempt < ATTEMPTS_PER_TARGET; attempt += 1) {
      const seed = hashSeed(`numberMerge:${level}:${target}:${attempt}`);
      const solution = solve({ seed, pool, startTiles: START_TILES, target }, SOLVER_CAP);
      if (!solution || solution.length === 0) continue;

      const candidate: NumberMergeLevel = {
        config: {
          gameId: 'numberMerge',
          level,
          seed,
          difficultyTier: tier,
          size: SIZE,
          target,
          startTiles: START_TILES,
          pool,
          maxMoves: Math.ceil(solution.length * slackForTier(tier)) + 6,
        },
        solution,
      };
      if (validateNumberMergeLevel(candidate).valid) return candidate;
    }
    target /= 2; // fallback: easier target, still validated
  }
  throw new Error(`Could not generate a valid Number Merge level ${level}`);
}

export const numberMergeDefinition: GameDefinition<NumberMergeConfig, NumberMergeLevel> = {
  id: 'numberMerge',
  generator: { generate: generateNumberMergeLevel },
  validator: { validate: validateNumberMergeLevel },
};
