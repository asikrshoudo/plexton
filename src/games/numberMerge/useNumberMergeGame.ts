import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameResult } from '@/engine/types';
import { generateNumberMergeLevel, type NumberMergeLevel } from './generator';
import { canMerge, createInitialState, maxTile, mergeTiles, moveTile, type BoardState } from './logic';

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
        setBoard(createInitialState(g.config.size, g.config.seed, g.config.pool, g.config.startTiles));
        startedAt.current = Date.now();
        setPhase('playing');
      } catch {
        setPhase('error');
      }
    }, 50);
    return () => clearTimeout(id);
  }, [level, tier]);

  // Drop tile `fromId` on cell (row, col): free move onto an empty cell, merge onto an equal tile.
  const drop = useCallback(
    (fromId: number, row: number, col: number) => {
      if (phase !== 'playing' || !board || !generated) return;

      const target = board.tiles.find((t) => t.row === row && t.col === col);
      if (!target) {
        setBoard(moveTile(board, fromId, row, col));
        return;
      }

      const r = mergeTiles(board, fromId, target.id);
      if (!r.ok) return;
      setBoard(r.state);

      const { config } = generated;
      const won = maxTile(r.state) >= config.target;
      const lost = !won && (r.state.moves >= config.maxMoves || !canMerge(r.state));
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

  return { phase, generated, board, drop };
}
