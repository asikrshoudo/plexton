import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import type { GameId } from '@/games/registry';
import { loadProgress } from './progressStore';

export type GameProgress = { level: number; bestScore: number | null };

function read(id: GameId): GameProgress {
  const p = loadProgress(id);
  return { level: p.level, bestScore: p.bestScore };
}

export function useGameProgress(id: GameId): GameProgress {
  const [progress, setProgress] = useState<GameProgress>(() => read(id));
  useFocusEffect(
    useCallback(() => {
      setProgress(read(id));
    }, [id]),
  );
  return progress;
}
