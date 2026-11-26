import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import type { GameResult } from '@/engine/types';
import { generateMemoryFlashLevel, type MemoryFlashLevel } from './generator';
import {
  advanceRound,
  applyInput,
  beginInput,
  createMemoryFlashState,
  type MemoryFlashState,
} from './logic';

export type Phase = 'loading' | 'showing' | 'input' | 'roundWon' | 'paused' | 'won' | 'lost' | 'error';

type Options = {
  level: number;
  tier: number;
  onFinish: (result: GameResult) => void;
};

export function useMemoryFlashGame({ level, tier, onFinish }: Options) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [generated, setGenerated] = useState<MemoryFlashLevel | null>(null);
  const [state, setState] = useState<MemoryFlashState | null>(null);
  const [activeCell, setActiveCell] = useState<number | null>(null);

  const stateRef = useRef<MemoryFlashState | null>(null);
  const phaseRef = useRef<Phase>('loading');
  const generatedRef = useRef<MemoryFlashLevel | null>(null);
  const finishRef = useRef(onFinish);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const startedAt = useRef(0);
  const pausedAt = useRef<number | null>(null);
  const pausedTotal = useRef(0);
  const reportedRef = useRef(false);
  const autoPausedByAppStateRef = useRef(false);

  useEffect(() => { finishRef.current = onFinish; });
  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { generatedRef.current = generated; }, [generated]);

  const clearTimers = useCallback(() => {
    for (const t of timers.current) clearTimeout(t);
    timers.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  const playSequence = useCallback((nextState: MemoryFlashState) => {
    clearTimers();
    setActiveCell(null);
    const seq = nextState.sequence;
    let cursor = 0;
    const step = () => {
      if (phaseRef.current === 'paused' || phaseRef.current === 'won' || phaseRef.current === 'lost' || phaseRef.current === 'error') return;
      if (cursor >= seq.length) {
        setActiveCell(null);
        schedule(() => {
          const current = stateRef.current;
          if (!current || phaseRef.current !== 'showing') return;
          const ready = beginInput(current);
          stateRef.current = ready;
          setState(ready);
          phaseRef.current = 'input';
          setPhase('input');
        }, nextState.config.gapMs);
        return;
      }
      const cell = seq[cursor];
      setActiveCell(cell);
      schedule(() => {
        setActiveCell(null);
        cursor += 1;
        schedule(step, nextState.config.gapMs);
      }, nextState.config.flashMs);
    };
    schedule(step, 350);
  }, [clearTimers, schedule]);

  const beginRun = useCallback((g: MemoryFlashLevel) => {
    clearTimers();
    reportedRef.current = false;
    autoPausedByAppStateRef.current = false;
    const initial = createMemoryFlashState(g);
    startedAt.current = Date.now();
    pausedAt.current = null;
    pausedTotal.current = 0;
    setGenerated(g);
    generatedRef.current = g;
    setState(initial);
    stateRef.current = initial;
    phaseRef.current = 'showing';
    setPhase('showing');
    playSequence(initial);
  }, [clearTimers, playSequence]);

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        beginRun(generateMemoryFlashLevel(level, tier));
      } catch {
        phaseRef.current = 'error';
        setPhase('error');
      }
    }, 40);
    return () => { clearTimeout(id); clearTimers(); };
  }, [beginRun, clearTimers, level, tier]);

  const finish = useCallback((won: boolean, finalState: MemoryFlashState, g: MemoryFlashLevel) => {
    if (reportedRef.current) return;
    reportedRef.current = true;
    clearTimers();
    setActiveCell(null);
    const now = Date.now();
    const pausedMs = pausedTotal.current + (pausedAt.current ? now - pausedAt.current : 0);
    const result: GameResult = {
      gameId: 'memoryFlash',
      level: g.config.level,
      won,
      score: finalState.score,
      moves: finalState.roundsCleared, // rounds cleared
      moveLimit: g.config.targetRounds,
      durationMs: Math.max(0, now - startedAt.current - pausedMs),
      hintsUsed: 0,
      xpEarned: 0,
    };
    phaseRef.current = won ? 'won' : 'lost';
    setPhase(phaseRef.current);
    finishRef.current(result);
  }, [clearTimers]);

  const input = useCallback((cell: number) => {
    const current = stateRef.current;
    const g = generatedRef.current;
    if (!current || !g || phaseRef.current !== 'input') return;
    const res = applyInput(current, cell);
    if (res.kind === 'ignored') return;
    stateRef.current = res.state;
    setState(res.state);
    if (res.kind === 'correct') return;
    if (res.kind === 'lost') {
      finish(false, res.state, g);
      return;
    }
    if (res.kind === 'levelWon') {
      finish(true, res.state, g);
      return;
    }
    if (res.kind === 'roundWon') {
      phaseRef.current = 'roundWon';
      setPhase('roundWon');
      schedule(() => {
        const s = stateRef.current;
        if (!s || phaseRef.current !== 'roundWon') return;
        const next = advanceRound(s);
        stateRef.current = next;
        setState(next);
        phaseRef.current = 'showing';
        setPhase('showing');
        playSequence(next);
      }, 700);
    }
  }, [finish, playSequence, schedule]);

  const pause = useCallback((auto = false) => {
    if (phaseRef.current !== 'showing' && phaseRef.current !== 'input' && phaseRef.current !== 'roundWon') return;
    clearTimers();
    setActiveCell(null);
    pausedAt.current = Date.now();
    autoPausedByAppStateRef.current = auto;
    phaseRef.current = 'paused';
    setPhase('paused');
  }, [clearTimers]);

  const resume = useCallback(() => {
    if (phaseRef.current !== 'paused') return;
    if (pausedAt.current) { pausedTotal.current += Date.now() - pausedAt.current; pausedAt.current = null; }
    autoPausedByAppStateRef.current = false;
    const current = stateRef.current;
    if (!current) return;
    // Resume safely: replay the current sequence from start; clear partial input.
    const reset: MemoryFlashState = { ...current, phase: 'showing', input: [] };
    stateRef.current = reset;
    setState(reset);
    phaseRef.current = 'showing';
    setPhase('showing');
    playSequence(reset);
  }, [playSequence]);

  useEffect(() => {
    const onAppState = (status: AppStateStatus) => {
      if (status === 'active') {
        if (phaseRef.current === 'paused' && autoPausedByAppStateRef.current) {
          resume();
        }
        return;
      }
      if (status === 'background' || status === 'inactive') {
        if (phaseRef.current === 'showing' || phaseRef.current === 'input' || phaseRef.current === 'roundWon') {
          pause(true);
        }
      }
    };
    const sub = AppState.addEventListener('change', onAppState);
    return () => sub.remove();
  }, [pause, resume]);

  const restart = useCallback(() => {
    const g = generatedRef.current ?? generateMemoryFlashLevel(level, tier);
    beginRun(g);
  }, [beginRun, level, tier]);

  return { phase, generated, state, activeCell, input, pause: () => pause(false), resume, restart };
}
