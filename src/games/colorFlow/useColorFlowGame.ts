import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameResult } from '@/engine/types';
import { generateColorFlowLevel, type ColorFlowLevel } from './generator';
import { createState, dragTo, isSolved, startDrag, type ColorFlowState } from './logic';

export type Phase = 'loading' | 'playing' | 'paused' | 'won' | 'error';

type Options = {
  level: number;
  tier: number;
  onFinish: (result: GameResult) => void;
};

export function useColorFlowGame({ level, tier, onFinish }: Options) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [generated, setGenerated] = useState<ColorFlowLevel | null>(null);
  const [state, setState] = useState<ColorFlowState | null>(null);

  const phaseRef = useRef<Phase>('loading');
  const stateRef = useRef<ColorFlowState | null>(null);
  const levelRef = useRef<ColorFlowLevel | null>(null);
  const colorRef = useRef(-1);
  const strokes = useRef(0);
  const startedAt = useRef(0);
  const pausedAt = useRef<number | null>(null);
  const pausedTotal = useRef(0);
  const finishRef = useRef(onFinish);

  useEffect(() => {
    finishRef.current = onFinish;
  });

  const beginLevel = useCallback((g: ColorFlowLevel) => {
    const initial = createState(g.config.size, g.pairs);
    levelRef.current = g;
    setGenerated(g);
    stateRef.current = initial;
    setState(initial);
    strokes.current = 0;
    colorRef.current = -1;
    startedAt.current = Date.now();
    pausedAt.current = null;
    pausedTotal.current = 0;
    phaseRef.current = 'playing';
    setPhase('playing');
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        beginLevel(generateColorFlowLevel(level, tier));
      } catch {
        phaseRef.current = 'error';
        setPhase('error');
      }
    }, 40);
    return () => clearTimeout(id);
  }, [beginLevel, level, tier]);

  const begin = useCallback((cell: number) => {
    if (phaseRef.current !== 'playing' || !stateRef.current) return;
    const result = startDrag(stateRef.current, cell);
    colorRef.current = result.color;
    stateRef.current = result.state;
    setState(result.state);
  }, []);

  const move = useCallback((cell: number) => {
    if (phaseRef.current !== 'playing') return;
    const color = colorRef.current;
    if (color < 0 || !stateRef.current) return;
    const next = dragTo(stateRef.current, color, cell);
    if (next === stateRef.current) return;
    stateRef.current = next;
    setState(next);
  }, []);

  const finish = useCallback((g: ColorFlowLevel) => {
    if (phaseRef.current === 'won') return;
    const now = Date.now();
    const pausedMs = pausedTotal.current + (pausedAt.current ? now - pausedAt.current : 0);
    pausedAt.current = null;
    colorRef.current = -1;
    phaseRef.current = 'won';
    setPhase('won');
    finishRef.current({
      gameId: 'colorFlow',
      level: g.config.level,
      won: true,
      score: Math.max(0, 1000 - strokes.current * 20),
      moves: strokes.current,
      moveLimit: null,
      durationMs: Math.max(0, now - startedAt.current - pausedMs),
      hintsUsed: 0,
      xpEarned: 0,
      parMs: g.config.parMs,
    });
  }, []);

  const end = useCallback(() => {
    if (phaseRef.current !== 'playing' || colorRef.current < 0) return;
    strokes.current += 1;
    colorRef.current = -1;
    const s = stateRef.current;
    const g = levelRef.current;
    if (s && g && isSolved(s)) finish(g);
  }, [finish]);

  const pause = useCallback(() => {
    if (phaseRef.current !== 'playing') return;
    if (colorRef.current >= 0) {
      strokes.current += 1;
      colorRef.current = -1;
    }
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
    const g = levelRef.current ?? generateColorFlowLevel(level, tier);
    beginLevel(g);
  }, [beginLevel, level, tier]);

  return { phase, generated, state, begin, move, end, pause, resume, restart };
}
