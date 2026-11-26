import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import type { GameResult } from '@/engine/types';
import { createWordGameState, generateWordGameLevel, giveUp, type WordGameState, submitWord, addLetter, removeLetter, clearInput, shuffleLetters } from './logic';
import type { WordGameLevel } from './logic';

export type Phase = 'loading' | 'playing' | 'paused' | 'won' | 'lost' | 'error';

type Options = {
  level: number;
  tier: number;
  onFinish: (result: GameResult) => void;
};

export function useWordGame({ level, tier, onFinish }: Options) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [generated, setGenerated] = useState<WordGameLevel | null>(null);
  const [state, setState] = useState<WordGameState | null>(null);
  const [displayLetters, setDisplayLetters] = useState('');
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'bad' | 'dup'; text: string } | null>(null);

  const stateRef = useRef<WordGameState | null>(null);
  const phaseRef = useRef<Phase>('loading');
  const genRef = useRef<WordGameLevel | null>(null);
  const finishRef = useRef(onFinish);
  const startedAt = useRef(0);
  const pausedAt = useRef<number | null>(null);
  const pausedTotal = useRef(0);
  const reportedRef = useRef(false);
  const autoPausedRef = useRef(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { finishRef.current = onFinish; });
  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { genRef.current = generated; }, [generated]);

  const clearFeedbackTimer = useCallback(() => {
    if (feedbackTimer.current) { clearTimeout(feedbackTimer.current); feedbackTimer.current = null; }
  }, []);

  const pushFeedback = useCallback((f: { kind: 'ok' | 'bad' | 'dup'; text: string }) => {
    clearFeedbackTimer();
    setFeedback(f);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 1400);
  }, [clearFeedbackTimer]);

  const beginRun = useCallback((g: WordGameLevel) => {
    clearFeedbackTimer();
    setFeedback(null);
    reportedRef.current = false;
    autoPausedRef.current = false;
    const s = createWordGameState(g);
    startedAt.current = Date.now();
    pausedAt.current = null;
    pausedTotal.current = 0;
    setGenerated(g); genRef.current = g;
    setState(s); stateRef.current = s;
    setDisplayLetters(g.config.letters);
    phaseRef.current = 'playing'; setPhase('playing');
  }, [clearFeedbackTimer]);

  useEffect(() => {
    const id = setTimeout(() => {
      try { beginRun(generateWordGameLevel(level, tier)); }
      catch { phaseRef.current = 'error'; setPhase('error'); }
    }, 30);
    return () => { clearTimeout(id); clearFeedbackTimer(); };
  }, [beginRun, clearFeedbackTimer, level, tier]);

  const finish = useCallback((won: boolean, s: WordGameState, g: WordGameLevel) => {
    if (reportedRef.current) return;
    reportedRef.current = true;
    clearFeedbackTimer();
    const now = Date.now();
    const pausedMs = pausedTotal.current + (pausedAt.current ? now - pausedAt.current : 0);
    const result: GameResult = {
      gameId: 'wordGame',
      level: g.config.level,
      won,
      score: s.score,
      moves: s.found.length,
      moveLimit: g.config.targetWords.length,
      durationMs: Math.max(0, now - startedAt.current - pausedMs),
      hintsUsed: 0,
      xpEarned: 0,
    };
    phaseRef.current = won ? 'won' : 'lost'; setPhase(phaseRef.current);
    finishRef.current(result);
  }, [clearFeedbackTimer]);

  const inputLetter = useCallback((ch: string) => {
    if (phaseRef.current !== 'playing') return;
    const s = stateRef.current; if (!s) return;
    const next = addLetter(s, ch);
    if (next !== s) { stateRef.current = next; setState(next); }
  }, []);

  const backspace = useCallback(() => {
    if (phaseRef.current !== 'playing') return;
    const s = stateRef.current; if (!s) return;
    const next = removeLetter(s);
    if (next !== s) { stateRef.current = next; setState(next); }
  }, []);

  const clear = useCallback(() => {
    if (phaseRef.current !== 'playing') return;
    const s = stateRef.current; if (!s) return;
    const next = clearInput(s);
    stateRef.current = next; setState(next);
  }, []);

  const submit = useCallback(() => {
    if (phaseRef.current !== 'playing') return;
    const s = stateRef.current; const g = genRef.current;
    if (!s || !g) return;
    const res = submitWord(s, s.currentInput);
    if (res.kind === 'ignored') return;
    if (res.kind === 'duplicate') { pushFeedback({ kind: 'dup', text: 'Already found' }); return; }
    if (res.kind === 'invalid') {
      const msg = res.reason === 'short' ? `Need ${s.config.minWordLength}+ letters` : res.reason === 'bad-letters' ? 'Use only available letters' : 'Not a valid word';
      pushFeedback({ kind: 'bad', text: msg });
      return;
    }
    stateRef.current = res.state; setState(res.state);
    pushFeedback({ kind: 'ok', text: `+${res.word.length <= 3 ? 10 : res.word.length === 4 ? 20 : res.word.length === 5 ? 40 : res.word.length === 6 ? 70 : 100}` });
    if (res.kind === 'won') finish(true, res.state, g);
  }, [finish, pushFeedback]);

  const shuffle = useCallback(() => {
    const g = genRef.current; if (!g) return;
    setDisplayLetters((prev) => shuffleLetters(prev || g.config.letters, Date.now()));
  }, []);

  const pause = useCallback((auto = false) => {
    if (phaseRef.current !== 'playing') return;
    pausedAt.current = Date.now();
    autoPausedRef.current = auto;
    phaseRef.current = 'paused'; setPhase('paused');
  }, []);

  const resume = useCallback(() => {
    if (phaseRef.current !== 'paused') return;
    if (pausedAt.current) { pausedTotal.current += Date.now() - pausedAt.current; pausedAt.current = null; }
    autoPausedRef.current = false;
    phaseRef.current = 'playing'; setPhase('playing');
  }, []);

  useEffect(() => {
    const onAppState = (status: AppStateStatus) => {
      if (status === 'active') { if (phaseRef.current === 'paused' && autoPausedRef.current) resume(); return; }
      if ((status === 'background' || status === 'inactive') && phaseRef.current === 'playing') pause(true);
    };
    const sub = AppState.addEventListener('change', onAppState);
    return () => sub.remove();
  }, [pause, resume]);

  const restart = useCallback(() => {
    const g = genRef.current ?? generateWordGameLevel(level, tier);
    beginRun(g);
  }, [beginRun, level, tier]);

  const endRun = useCallback(() => {
    const s = stateRef.current; const g = genRef.current;
    if (!s || !g || phaseRef.current !== 'playing') return;
    const next = giveUp(s);
    stateRef.current = next; setState(next);
    finish(false, next, g);
  }, [finish]);

  return { phase, generated, state, displayLetters, feedback, inputLetter, backspace, clear, submit, shuffle, pause: () => pause(false), resume, restart, endRun };
}
