import type { PlayerPerformance } from './types';

export const MIN_TIER = 0;
export const MAX_TIER = 10;
export const DEFAULT_TIER = 3;

const WINDOW = 5;
const MIN_SAMPLES = 3;

export function clampTier(tier: number): number {
  return Math.max(MIN_TIER, Math.min(MAX_TIER, Math.round(tier)));
}

// Higher = player is comfortably ahead. Range roughly -1.3 .. 1.5.
export function scoreAttempt(p: PlayerPerformance): number {
  let s = p.won ? 1 : -1;
  if (p.won && p.hintsUsed === 0 && p.moveLimit !== null && p.moves <= p.moveLimit * 0.6) s += 0.5;
  if (p.hintsUsed > 0) s -= 0.25 * Math.min(p.hintsUsed, 3);
  if (p.retries >= 3) s -= 0.3;
  return s;
}

// Moves at most one tier per finished attempt, only after enough history.
export function nextTier(current: number, history: readonly PlayerPerformance[]): number {
  const recent = history.slice(-WINDOW);
  if (recent.length < MIN_SAMPLES) return clampTier(current);
  const avg = recent.reduce((sum, p) => sum + scoreAttempt(p), 0) / recent.length;
  const delta = avg > 0.6 ? 1 : avg < -0.2 ? -1 : 0;
  return clampTier(current + delta);
}
