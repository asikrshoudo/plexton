import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameResult } from '@/engine/types';
import { generateNumberMergeLevel, type NumberMergeLevel } from './generator';
import { canMove, createInitialState, maxTile, move, type BoardState, type Direction } from './logic';

export type Phase = 'loading' | 'playing' | 'won' | 'lost' | 'error';

type Options = {
  level: number;
  tier: number;
  onFinish: (result: GameResult) => void;
};

export function useNumberMergeGame({ level, tier, onFinish }: Options) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [generated, setGenerated] = useState<NumberMergeLevel | null>(null);
  const [board, setBoard] = useState<BoardState | null>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    // Deferred so the loading state paints before the (synchronous) generator runs.
    const id = setTimeout(() => {
      try {
        const g = generateNumberMergeLevel(level, tier);
        setGenerated(g);
        setBoard(createInitialState(g.config.size, g.config.seed, g.config.startTiles));
        startedAt.current = Date.now();
        setPhase('playing');
      } catch {
        setPhase('error');
      }
    }, 50);
    return () => clearTimeout(id);
  }, [level, tier]);

  const swipe = useCallback(
    (dir: Direction) => {
      if (phase !== 'playing' || !board || !generated) return;
      const r = move(board, dir);
      if (!r.moved) return;
      setBoard(r.state);

      const { config } = generated;
      const won = maxTile(r.state) >= config.target;
      const lost = !won && (r.state.moves >= config.maxMoves || !canMove(r.state));
      if (!won && !lost) return;

      setPhase(won ? 'won' : 'lost');
      onFinish({
        gameId: 'numberMerge',
        level: config.level,
        won,
        score: r.state.score,
        moves: r.state.moves,
        moveLimit: config.maxMoves,
        durationMs: Date.now() - startedAt.current,
        hintsUsed: 0,
        xpEarned: 0,
      });
    },
    [phase, board, generated, onFinish],
  );

  return { phase, generated, board, swipe };
}
