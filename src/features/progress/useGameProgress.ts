import { useMemo } from 'react';
import type { GameId } from '@/games/registry';
import { readJson } from '@/storage/kv';

export type GameProgress = { level: number; bestScore: number | null };

export function useGameProgress(id: GameId): GameProgress {
  return useMemo(() => {
    const raw = readJson<Partial<GameProgress>>(`progress.${id}.v1`, {});
    return {
      level: typeof raw.level === 'number' && raw.level >= 1 ? Math.floor(raw.level) : 1,
      bestScore: typeof raw.bestScore === 'number' ? raw.bestScore : null,
    };
  }, [id]);
}
