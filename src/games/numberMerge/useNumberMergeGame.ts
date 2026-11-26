import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameResult } from '@/engine/types';
import { generateNumberMergeLevel, type NumberMergeLevel } from './generator';
import { createInitialState, maxTile, mergeTiles, moveTile, type BoardState } from './logic';

export type Phase = 'loading' | 'playing' | 'paused' | 'won' | 'lost' | 'error';

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
  const pausedAt = useRef<number | null>(null);
  const pausedTotal = useRef(0);

  const boardRef = useRef<BoardState | null>(null);
  const phaseRef = useRef<Phase>('loading');
  const generatedRef = useRef<NumberMergeLevel | null>(null);
  const finishRef = useRef(onFinish);
  const resolvingRef = useRef(false);

  useEffect(() => {
    finishRef.current = onFinish;
  });

  const begin = useCallback((g: NumberMergeLevel) => {
    const initial = createInitialState(g.config.size, g.config.seed, g.config.pool, g.config.startTiles);
    setGenerated(g);
    setBoard(initial);
    boardRef.current = initial;
    generatedRef.current = g;
    startedAt.current = Date.now();
    pausedAt.current = null;
    pausedTotal.current = 0;
    resolvingRef.current = false;
    phaseRef.current = 'playing';
    setPhase('playing');
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        begin(generateNumberMergeLevel(level, tier));
      } catch {
        phaseRef.current = 'error';
        setPhase('error');
      }
    }, 40);
    return () => clearTimeout(id);
  }, [begin, level, tier]);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    generatedRef.current = generated;
  }, [generated]);

  const finish = useCallback((won: boolean, state: BoardState, g: NumberMergeLevel) => {
    if (phaseRef.current === 'won' || phaseRef.current === 'lost') return;
    const now = Date.now();
    const pausedMs = pausedTotal.current + (pausedAt.current ? now - pausedAt.current : 0);
    const result: GameResult = {
      gameId: 'numberMerge',
      level: g.config.level,
      won,
      score: state.score,
      moves: state.moves,
      moveLimit: g.config.maxMoves,
      durationMs: Math.max(0, now - startedAt.current - pausedMs),
      hintsUsed: 0,
      xpEarned: 0,
    };
    pausedAt.current = null;
    resolvingRef.current = false;
    phaseRef.current = won ? 'won' : 'lost';
    setPhase(phaseRef.current);
    finishRef.current(result);
  }, []);

  const pause = useCallback(() => {
    if (phaseRef.current !== 'playing') return;
    pausedAt.current = Date.now();
    phaseRef.current = 'paused';
    setPhase('paused');
  }, []);

  const resume = useCallback(() => {
    if (phaseRef.current !== 'paused') return;
    if (pausedAt.current) {
      pausedTotal.current += Date.now() - pausedAt.current;
      pausedAt.current = null;
    }
    phaseRef.current = 'playing';
    setPhase('playing');
  }, []);

  const restart = useCallback(() => {
    const g = generatedRef.current ?? generateNumberMergeLevel(level, tier);
    begin(g);
  }, [begin, level, tier]);

  const drop = useCallback((tileId: number, row: number, col: number) => {
    const b = boardRef.current;
    const g = generatedRef.current;
    if (!b || !g || phaseRef.current !== 'playing' || resolvingRef.current) return;

    const moved = moveTile(b, tileId, row, col);
    if (moved !== b) {
      boardRef.current = moved;
      setBoard(moved);
      return;
    }

    const source = b.tiles.find((t) => t.id === tileId);
    const over = b.tiles.find((t) => t.row === row && t.col === col);
    if (!source || !over || over.id === tileId || source.value !== over.value) return;

    resolvingRef.current = true;
    const r = mergeTiles(b, tileId, over.id);
    if (!r.ok) {
      resolvingRef.current = false;
      return;
    }
    boardRef.current = r.state;
    setBoard(r.state);
    if (maxTile(r.state) >= g.config.target) finish(true, r.state, g);
    else if (r.state.moves >= g.config.maxMoves) finish(false, r.state, g);
    else resolvingRef.current = false;
  }, [finish]);

  return { phase, board, generated, drop, pause, resume, restart };
}
