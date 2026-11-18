import { clampTier, DEFAULT_TIER, nextTier } from '@/engine/difficulty';
import type { GameResult, PlayerPerformance } from '@/engine/types';
import type { GameId } from '@/games/registry';
import { readJson, writeJson } from '@/storage/kv';

export type StoredProgress = {
  level: number;
  bestScore: number | null;
  tier: number;
  retries: number;
  history: PlayerPerformance[];
};

const keyFor = (id: GameId) => `progress.${id}.v1`;
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export function loadProgress(id: GameId): StoredProgress {
  const raw = readJson<Partial<StoredProgress>>(keyFor(id), {});
  return {
    level: isNum(raw.level) && raw.level >= 1 ? Math.floor(raw.level) : 1,
    bestScore: isNum(raw.bestScore) ? raw.bestScore : null,
    tier: clampTier(isNum(raw.tier) ? raw.tier : DEFAULT_TIER),
    retries: isNum(raw.retries) && raw.retries >= 0 ? Math.floor(raw.retries) : 0,
    history: Array.isArray(raw.history)
      ? raw.history.filter((h) => h && typeof h.won === 'boolean').slice(-10)
      : [],
  };
}

export function xpForResult(result: GameResult, clearedUpTo: number): number {
  if (!result.won) return 0;
  if (result.level < clearedUpTo) return 5; // replaying an already-cleared level
  return Math.min(60, 20 + result.level * 2);
}

export function recordResult(result: GameResult): { progress: StoredProgress; xpEarned: number; saved: boolean } {
  const prev = loadProgress(result.gameId);
  const performance: PlayerPerformance = {
    won: result.won,
    durationMs: result.durationMs,
    moves: result.moves,
    moveLimit: result.moveLimit,
    hintsUsed: result.hintsUsed,
    retries: prev.retries,
  };
  const history = [...prev.history, performance].slice(-10);
  const progress: StoredProgress = {
    level: result.won && result.level === prev.level ? prev.level + 1 : prev.level,
    bestScore: prev.bestScore === null ? result.score : Math.max(prev.bestScore, result.score),
    tier: nextTier(prev.tier, history),
    retries: result.won ? 0 : prev.retries + 1,
    history,
  };
  const saved = writeJson(keyFor(result.gameId), progress);
  return { progress, xpEarned: xpForResult(result, prev.level), saved };
}
