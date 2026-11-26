import { hashSeed, mixSeed, createRng } from '@/engine/rng';
import type { GeneratedLevel, LevelConfig } from '@/engine/types';

export type MemoryFlashLevelConfig = LevelConfig & {
  gameId: 'memoryFlash';
  gridSize: number;
  startLength: number;
  targetRounds: number;
  maxMistakes: 1;
  flashMs: number;
  gapMs: number;
};

export type MemoryFlashLevel = GeneratedLevel<MemoryFlashLevelConfig>;

function roundUpTo(n: number, step: number): number {
  return Math.ceil(n / step) * step;
}

export function generateMemoryFlashLevel(level: number, difficultyTier: number): MemoryFlashLevel {
  const gridSize = level <= 4 ? 3 : level <= 12 ? 4 : 5;
  const startLength = Math.min(gridSize * gridSize - 1, 2 + Math.floor((level - 1) / 2));
  const targetRounds = Math.min(8, 3 + Math.floor((level - 1) / 3));
  const flashMs = Math.max(320, 620 - difficultyTier * 18 - Math.floor((level - 1) / 4) * 10);
  const gapMs = Math.max(120, 220 - difficultyTier * 6);
  const seed = hashSeed(`memoryFlash:${level}:${difficultyTier}`);
  return {
    config: {
      gameId: 'memoryFlash',
      level,
      seed,
      difficultyTier,
      gridSize,
      startLength,
      targetRounds,
      maxMistakes: 1,
      flashMs: roundUpTo(flashMs, 10),
      gapMs: roundUpTo(gapMs, 10),
    },
  };
}

export function sequenceLengthForRound(config: MemoryFlashLevelConfig, round: number): number {
  const maxLen = config.gridSize * config.gridSize - 1;
  return Math.min(maxLen, config.startLength + Math.floor(round / 2));
}

export function generateSequence(config: MemoryFlashLevelConfig, round: number): number[] {
  const len = sequenceLengthForRound(config, round);
  const rng = createRng(mixSeed(config.seed, round + 1));
  const total = config.gridSize * config.gridSize;
  const pool = Array.from({ length: total }, (_, i) => i);
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = rng.int(i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, len);
}
