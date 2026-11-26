import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { readJson, writeJson } from '@/storage/kv';
import {
  HEART_MAX,
  HEART_RECOVERY_MS,
  HEARTS_KEY,
  consumeHeart as consumeHeartState,
  normalizeHearts,
  sanitizeHeartState,
  type NormalizedHearts,
} from './hearts';

type HeartsContextValue = {
  hearts: number;
  maxHearts: number;
  msToNextHeart: number;
  isFull: boolean;
  canStartNumberMerge: boolean;
  consumeNumberMergeLoss: (attemptId: string) => boolean;
  refresh: () => void;
};

const HeartsContext = createContext<HeartsContextValue | null>(null);

function readNormalized(now: number): NormalizedHearts {
  const stored = readJson<unknown>(HEARTS_KEY, null);
  const normalized = normalizeHearts(sanitizeHeartState(stored, now), now);
  if (stored == null || normalized.changed) {
    writeJson(HEARTS_KEY, { version: 1, hearts: normalized.hearts, updatedAt: normalized.updatedAt });
  }
  return normalized;
}

export function HeartsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NormalizedHearts>(() => readNormalized(Date.now()));
  const stateRef = useRef(state);
  const consumedLossAttempts = useRef<Set<string>>(new Set());

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const persist = useCallback((next: NormalizedHearts) => {
    stateRef.current = next;
    setState(next);
    writeJson(HEARTS_KEY, { version: 1, hearts: next.hearts, updatedAt: next.updatedAt });
  }, []);

  const refresh = useCallback(() => {
    const next = normalizeHearts(stateRef.current, Date.now());
    if (next.changed || next.hearts !== stateRef.current.hearts || next.msToNextHeart !== stateRef.current.msToNextHeart) {
      persist(next);
    } else {
      // still update countdown tick
      stateRef.current = next;
      setState(next);
    }
  }, [persist]);

  useEffect(() => {
    const onAppState = (status: AppStateStatus) => {
      if (status === 'active') refresh();
    };
    const sub = AppState.addEventListener('change', onAppState);
    return () => sub.remove();
  }, [refresh]);

  useEffect(() => {
    if (state.hearts >= HEART_MAX) return;
    const delay = Math.max(250, Math.min(state.msToNextHeart, HEART_RECOVERY_MS) + 20);
    const timer = setTimeout(refresh, delay);
    return () => clearTimeout(timer);
  }, [refresh, state.hearts, state.msToNextHeart]);

  const consumeNumberMergeLoss = useCallback((attemptId: string) => {
    if (!attemptId || consumedLossAttempts.current.has(attemptId)) return false;
    const result = consumeHeartState(stateRef.current, Date.now());
    if (!result.consumed) {
      persist(result.state);
      return false;
    }
    consumedLossAttempts.current.add(attemptId);
    persist(result.state);
    return true;
  }, [persist]);

  const value = useMemo<HeartsContextValue>(() => ({
    hearts: state.hearts,
    maxHearts: HEART_MAX,
    msToNextHeart: state.msToNextHeart,
    isFull: state.hearts >= HEART_MAX,
    canStartNumberMerge: state.hearts > 0,
    consumeNumberMergeLoss,
    refresh,
  }), [consumeNumberMergeLoss, refresh, state.hearts, state.msToNextHeart]);

  return <HeartsContext.Provider value={value}>{children}</HeartsContext.Provider>;
}

export function useHearts(): HeartsContextValue {
  const ctx = useContext(HeartsContext);
  if (!ctx) throw new Error('useHearts must be used inside HeartsProvider');
  return ctx;
}
