export const HEART_MAX = 5;
export const HEART_RECOVERY_MS = 30 * 60 * 1000;
export const HEARTS_KEY = 'hearts.v1';

export type HeartState = {
  version: 1;
  hearts: number;
  /** Recovery baseline timestamp (ms). When hearts are full, this is set to now on normalization. */
  updatedAt: number;
};

export type NormalizedHearts = HeartState & {
  /** ms until next heart, or 0 when full */
  msToNextHeart: number;
  /** whether state changed and should be persisted */
  changed: boolean;
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function defaultHeartState(now: number): HeartState {
  return { version: 1, hearts: HEART_MAX, updatedAt: now };
}

export function sanitizeHeartState(raw: unknown, now: number): HeartState {
  if (!raw || typeof raw !== 'object') return defaultHeartState(now);
  const value = raw as Partial<HeartState>;
  const hearts = isFiniteNumber(value.hearts) ? Math.floor(value.hearts) : HEART_MAX;
  const updatedAt = isFiniteNumber(value.updatedAt) ? value.updatedAt : now;
  return {
    version: 1,
    hearts: Math.max(0, Math.min(HEART_MAX, hearts)),
    updatedAt,
  };
}

export function normalizeHearts(state: HeartState, now: number): NormalizedHearts {
  const safeNow = isFiniteNumber(now) ? now : Date.now();
  let hearts = Math.max(0, Math.min(HEART_MAX, Math.floor(state.hearts)));
  let updatedAt = isFiniteNumber(state.updatedAt) ? state.updatedAt : safeNow;
  let changed = hearts !== state.hearts || updatedAt !== state.updatedAt || state.version !== 1;

  // Defensive: future timestamps or extreme backwards clock. Clamp baseline to now so
  // we don't grant recovery from "future" time; remaining countdown is based on now.
  if (updatedAt > safeNow) {
    updatedAt = safeNow;
    changed = true;
  }

  if (hearts >= HEART_MAX) {
    hearts = HEART_MAX;
    if (updatedAt !== safeNow) {
      // Keep state clean when full; countdown is not shown.
      updatedAt = safeNow;
      changed = true;
    }
    return { version: 1, hearts, updatedAt, msToNextHeart: 0, changed };
  }

  const elapsed = Math.max(0, safeNow - updatedAt);
  const recovered = Math.floor(elapsed / HEART_RECOVERY_MS);
  if (recovered > 0) {
    hearts = Math.min(HEART_MAX, hearts + recovered);
    updatedAt = updatedAt + recovered * HEART_RECOVERY_MS;
    changed = true;
  }

  if (hearts >= HEART_MAX) {
    hearts = HEART_MAX;
    updatedAt = safeNow;
    return { version: 1, hearts, updatedAt, msToNextHeart: 0, changed };
  }

  const msToNextHeart = Math.max(0, HEART_RECOVERY_MS - (safeNow - updatedAt));
  return { version: 1, hearts, updatedAt, msToNextHeart, changed };
}

export function consumeHeart(state: HeartState, now: number): { state: NormalizedHearts; consumed: boolean } {
  const normalized = normalizeHearts(state, now);
  if (normalized.hearts <= 0) {
    return { state: normalized, consumed: false };
  }
  const nextHearts = normalized.hearts - 1;
  const next: HeartState = {
    version: 1,
    hearts: nextHearts,
    // If dropping from full, start recovery baseline at consumption time.
    // If already recovering, preserve existing baseline to keep remaining time accurate.
    updatedAt: normalized.hearts === HEART_MAX ? now : normalized.updatedAt,
  };
  return { state: normalizeHearts(next, now), consumed: true };
}

export function createLossConsumptionGuard() {
  const consumed = new Set<string>();
  return {
    consume(attemptId: string, state: HeartState, now: number) {
      if (!attemptId || consumed.has(attemptId)) {
        return { state: normalizeHearts(state, now), consumed: false, duplicate: true };
      }
      const result = consumeHeart(state, now);
      if (result.consumed) consumed.add(attemptId);
      return { ...result, duplicate: false };
    },
    has(attemptId: string) {
      return consumed.has(attemptId);
    },
  };
}
