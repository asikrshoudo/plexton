import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameResult } from '@/engine/types';
import { generateColorFlowLevel, type ColorFlowLevel } from './generator';
import { createState, dragTo, isSolved, startDrag, type ColorFlowState } from './logic';

export type Phase = 'loading' | 'playing' | 'won' | 'error';

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
  const finishRef = useRef(onFinish);

  useEffect(() => {
    finishRef.current = onFinish;
  });

  useEffect(() => {
    // Deferred so the loading state paints before the synchronous generator runs.
    const id = setTimeout(() => {
      try {
        const g = generateColorFlowLevel(level, tier);
        const s = createState(g.config.size, g.pairs);
        levelRef.current = g;
        stateRef.current = s;
        phaseRef.current = 'playing';
        startedAt.current = Date.now();
        setGenerated(g);
        setState(s);
        setPhase('playing');
      } catch {
        phaseRef.current = 'error';
        setPhase('error');
      }
    }, 50);
    return () => clearTimeout(id);
  }, [level, tier]);

  const begin = useCallback((cell: number) => {
    const s = stateRef.current;
    if (!s || phaseRef.current !== 'playing') return;
    const r = startDrag(s, cell);
    colorRef.current = r.color;
    if (r.color < 0) return;
    strokes.current += 1;
    stateRef.current = r.state;
    setState(r.state);
  }, []);

  const move = useCallback((cell: number) => {
    const s = stateRef.current;
    const g = levelRef.current;
    const color = colorRef.current;
    if (!s || !g || color < 0 || phaseRef.current !== 'playing') return;

    const next = dragTo(s, color, cell);
    if (next === s) return;
    stateRef.current = next;
    setState(next);
    if (!isSolved(next)) return;

    phaseRef.current = 'won';
    colorRef.current = -1;
    setPhase('won');

    const durationMs = Math.max(1, Date.now() - startedAt.current);
    const extraStrokes = Math.max(0, strokes.current - g.pairs.length);
    const speed = Math.min(1, Math.max(0.1, g.config.parMs / durationMs));
    finishRef.current({
      gameId: 'colorFlow',
      level: g.config.level,
      won: true,
      score: Math.max(100, Math.round(1000 * speed) - extraStrokes * 20),
      moves: strokes.current,
      moveLimit: null,
      durationMs,
      hintsUsed: 0,
      xpEarned: 0,
      parMs: g.config.parMs,
    });
  }, []);

  const end = useCallback(() => {
    colorRef.current = -1;
  }, []);

  const clear = useCallback(() => {
    const g = levelRef.current;
    if (!g || phaseRef.current !== 'playing') return;
    const s = createState(g.config.size, g.pairs);
    stateRef.current = s;
    setState(s);
  }, []);

  return { phase, generated, state, begin, move, end, clear };
}
