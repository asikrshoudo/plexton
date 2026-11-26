import { describe, expect, it } from '@jest/globals';
import {
  HEART_MAX,
  HEART_RECOVERY_MS,
  consumeHeart,
  createLossConsumptionGuard,
  defaultHeartState,
  normalizeHearts,
  sanitizeHeartState,
} from '../hearts';

describe('heart logic', () => {
  it('initializes full hearts', () => {
    const now = 1_000_000;
    expect(defaultHeartState(now)).toEqual({ version: 1, hearts: HEART_MAX, updatedAt: now });
    expect(normalizeHearts(defaultHeartState(now), now).msToNextHeart).toBe(0);
  });

  it('recovers one heart after 30 minutes', () => {
    const start = 1_000_000;
    const state = { version: 1 as const, hearts: 4, updatedAt: start };
    const normalized = normalizeHearts(state, start + HEART_RECOVERY_MS);
    expect(normalized.hearts).toBe(5);
    expect(normalized.msToNextHeart).toBe(0);
  });

  it('recovers multiple hearts while closed and preserves remainder', () => {
    const start = 1_000_000;
    const state = { version: 1 as const, hearts: 2, updatedAt: start };
    const now = start + HEART_RECOVERY_MS * 2 + 5 * 60 * 1000;
    const normalized = normalizeHearts(state, now);
    expect(normalized.hearts).toBe(4);
    expect(normalized.msToNextHeart).toBe(25 * 60 * 1000);
  });

  it('never exceeds capacity', () => {
    const start = 1_000_000;
    const state = { version: 1 as const, hearts: 4, updatedAt: start };
    const normalized = normalizeHearts(state, start + HEART_RECOVERY_MS * 10);
    expect(normalized.hearts).toBe(HEART_MAX);
    expect(normalized.msToNextHeart).toBe(0);
  });

  it('computes remaining countdown when not full', () => {
    const start = 1_000_000;
    const state = { version: 1 as const, hearts: 3, updatedAt: start };
    const normalized = normalizeHearts(state, start + 10 * 60 * 1000);
    expect(normalized.hearts).toBe(3);
    expect(normalized.msToNextHeart).toBe(20 * 60 * 1000);
  });

  it('handles invalid/missing timestamps defensively', () => {
    const now = 2_000_000;
    expect(sanitizeHeartState({ hearts: 99, updatedAt: 'bad' }, now)).toEqual({ version: 1, hearts: 5, updatedAt: now });
    expect(sanitizeHeartState({ hearts: -2, updatedAt: 123 }, now)).toEqual({ version: 1, hearts: 0, updatedAt: 123 });
    expect(sanitizeHeartState(null, now)).toEqual({ version: 1, hearts: 5, updatedAt: now });
  });

  it('handles clock moving backward by clamping baseline to now', () => {
    const start = 5_000_000;
    const state = { version: 1 as const, hearts: 3, updatedAt: start };
    const nowBackward = start - 10 * 60 * 1000;
    const normalized = normalizeHearts(state, nowBackward);
    expect(normalized.hearts).toBe(3);
    expect(normalized.updatedAt).toBe(nowBackward);
    expect(normalized.msToNextHeart).toBe(HEART_RECOVERY_MS);
  });

  it('clamps future timestamps to avoid recovery from future time', () => {
    const now = 2_000_000;
    const state = { version: 1 as const, hearts: 3, updatedAt: now + 60 * 60 * 1000 };
    const normalized = normalizeHearts(state, now);
    expect(normalized.hearts).toBe(3);
    expect(normalized.updatedAt).toBe(now);
    expect(normalized.msToNextHeart).toBe(HEART_RECOVERY_MS);
  });

  it('consumes a heart on Number Merge loss and preserves recovery baseline when already recovering', () => {
    const start = 1_000_000;
    const now = start + 10 * 60 * 1000;
    const state = { version: 1 as const, hearts: 4, updatedAt: start }; // 20 min to next
    const result = consumeHeart(state, now);
    expect(result.consumed).toBe(true);
    expect(result.state.hearts).toBe(3);
    expect(result.state.msToNextHeart).toBe(20 * 60 * 1000);
  });

  it('consuming from full starts recovery baseline at now', () => {
    const now = 5_000_000;
    const result = consumeHeart({ version: 1, hearts: 5, updatedAt: now - 999999 }, now);
    expect(result.consumed).toBe(true);
    expect(result.state.hearts).toBe(4);
    expect(result.state.msToNextHeart).toBe(HEART_RECOVERY_MS);
  });

  it('does not consume at zero hearts (launch prevention baseline)', () => {
    const now = 5_000_000;
    const result = consumeHeart({ version: 1, hearts: 0, updatedAt: now - HEART_RECOVERY_MS + 1000 }, now);
    expect(result.consumed).toBe(false);
    expect(result.state.hearts).toBe(0);
    expect(result.state.msToNextHeart).toBe(1000);
  });

  it('prevents duplicate loss consumption for same attempt id', () => {
    const now = 5_000_000;
    const guard = createLossConsumptionGuard();
    const first = guard.consume('attempt-1', { version: 1, hearts: 3, updatedAt: now }, now);
    const second = guard.consume('attempt-1', first.state, now);
    expect(first.consumed).toBe(true);
    expect(first.duplicate).toBe(false);
    expect(second.consumed).toBe(false);
    expect(second.duplicate).toBe(true);
    expect(second.state.hearts).toBe(2);
  });

  it('win has no consumption by contract (consumeHeart not called for win)', () => {
    const now = 5_000_000;
    const state = { version: 1 as const, hearts: 4, updatedAt: now - 10 * 60 * 1000 };
    const normalized = normalizeHearts(state, now);
    expect(normalized.hearts).toBe(4);
    expect(normalized.msToNextHeart).toBe(20 * 60 * 1000);
  });

  it('Color Flow never consumes hearts by design (no consume path invoked)', () => {
    const now = 5_000_000;
    const state = { version: 1 as const, hearts: 1, updatedAt: now - 5 * 60 * 1000 };
    // Simulate Color Flow finish: only normalization for UI refresh, never consumeHeart.
    const normalized = normalizeHearts(state, now);
    expect(normalized.hearts).toBe(1);
  });
});
