import { clampTier } from '../../engine/difficulty';
import { hashSeed } from '../../engine/rng';
import type { GameDefinition, GeneratedLevel, LevelConfig, ValidationResult } from '../../engine/types';
import { createInitialState, maxTile, move, type Direction } from './logic';
import { solve } from './solver';

export type NumberMergeConfig = LevelConfig & {
  size: number;
  target: number;
  maxMoves: number;
  startTiles: number;
};

export interface NumberMergeLevel extends GeneratedLevel<NumberMergeConfig> {
  solution: Direction[];
}

const SIZE = 4;
const START_TILES = 2;
const SOLVER_CAP = 400;
const ATTEMPTS_PER_TARGET = 6;
const MIN_TARGET = 16;

export function baseTargetForLevel(level: number): number {
  return 2 ** (5 + Math.min(4, Math.floor((Math.max(1, level) - 1) / 3)));
}

// Tier 0 = generous (2.4x solver length), tier 10 = tight (1.6x). Visible, never hidden.
export function slackForTier(tier: number): number {
  return 2.4 - clampTier(tier) * 0.08;
}

export function validateNumberMergeLevel(level: NumberMergeLevel): ValidationResult {
  const reasons: string[] = [];
  const { config, solution } = level;

  if (config.size < 3 || config.size > 6) reasons.push('invalid board size');
  if (config.target < MIN_TARGET || (config.target & (config.target - 1)) !== 0) {
    reasons.push('target must be a power of two >= 16');
  }
  if (config.startTiles < 1 || config.startTiles > (config.size * config.size) / 2) {
    reasons.push('invalid start tile count');
  }
  if (solution.length === 0) reasons.push('empty solution');
  if (config.maxMoves < solution.length) reasons.push('move limit shorter than the known solution');

  if (reasons.length === 0) {
    let state = createInitialState(config.size, config.seed, config.startTiles);
    for (const dir of solution) {
      const r = move(state, dir);
      if (!r.moved) {
        reasons.push('solution contains an illegal move');
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
  let target = baseTargetForLevel(level);

  while (target >= MIN_TARGET) {
    for (let attempt = 0; attempt < ATTEMPTS_PER_TARGET; attempt += 1) {
      const seed = hashSeed(`numberMerge:${level}:${target}:${attempt}`);
      const solution = solve({ size: SIZE, seed, startTiles: START_TILES, target }, SOLVER_CAP);
      if (!solution) continue;

      const candidate: NumberMergeLevel = {
        config: {
          gameId: 'numberMerge',
          level,
          seed,
          difficultyTier: tier,
          size: SIZE,
          target,
          startTiles: START_TILES,
          maxMoves: Math.ceil(solution.length * slackForTier(tier)) + 10,
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
