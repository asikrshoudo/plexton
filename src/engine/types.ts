import type { GameId } from '../games/registry';

export interface LevelConfig {
  gameId: GameId;
  level: number;
  seed: number;
  difficultyTier: number;
}

export interface GeneratedLevel<C extends LevelConfig = LevelConfig> {
  config: C;
}

export interface ValidationResult {
  valid: boolean;
  reasons: string[];
}

export interface LevelGenerator<C extends LevelConfig, L extends GeneratedLevel<C>> {
  generate(level: number, difficultyTier: number): L;
}

export interface LevelValidator<L extends GeneratedLevel> {
  validate(level: L): ValidationResult;
}

export interface GameDefinition<C extends LevelConfig, L extends GeneratedLevel<C>> {
  id: GameId;
  generator: LevelGenerator<C, L>;
  validator: LevelValidator<L>;
}

export interface DifficultyProfile {
  tier: number;
}

export interface PlayerPerformance {
  won: boolean;
  durationMs: number;
  moves: number;
  moveLimit: number | null;
  hintsUsed: number;
  retries: number;
  parMs?: number;
}

export interface GameSession {
  gameId: GameId;
  level: number;
  startedAt: number;
  moves: number;
  hintsUsed: number;
}

export interface GameResult {
  gameId: GameId;
  level: number;
  won: boolean;
  score: number;
  moves: number;
  moveLimit: number | null;
  durationMs: number;
  hintsUsed: number;
  xpEarned: number;
  parMs?: number;
}
