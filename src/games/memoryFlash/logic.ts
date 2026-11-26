import type { MemoryFlashLevel, MemoryFlashLevelConfig } from './generator';
import { generateSequence, sequenceLengthForRound } from './generator';

export type MemoryPhase = 'loading' | 'showing' | 'input' | 'roundWon' | 'levelWon' | 'lost' | 'error';

export type MemoryFlashState = {
  config: MemoryFlashLevelConfig;
  phase: Exclude<MemoryPhase, 'loading' | 'error'>;
  round: number;
  sequence: number[];
  input: number[];
  score: number;
  mistakes: number;
  roundsCleared: number;
};

export type InputResult =
  | { kind: 'ignored'; state: MemoryFlashState }
  | { kind: 'correct'; state: MemoryFlashState }
  | { kind: 'roundWon'; state: MemoryFlashState }
  | { kind: 'levelWon'; state: MemoryFlashState }
  | { kind: 'lost'; state: MemoryFlashState };

export function createMemoryFlashState(level: MemoryFlashLevel): MemoryFlashState {
  const round = 0;
  return {
    config: level.config,
    phase: 'showing',
    round,
    sequence: generateSequence(level.config, round),
    input: [],
    score: 0,
    mistakes: 0,
    roundsCleared: 0,
  };
}

export function beginInput(state: MemoryFlashState): MemoryFlashState {
  if (state.phase !== 'showing') return state;
  return { ...state, phase: 'input' };
}

export function canAcceptInput(state: MemoryFlashState, cell: number): boolean {
  if (state.phase !== 'input') return false;
  if (!Number.isInteger(cell) || cell < 0 || cell >= state.config.gridSize * state.config.gridSize) return false;
  if (state.input.length >= state.sequence.length) return false;
  return true;
}

export function applyInput(state: MemoryFlashState, cell: number): InputResult {
  if (!canAcceptInput(state, cell)) return { kind: 'ignored', state };

  const expected = state.sequence[state.input.length];
  if (cell !== expected) {
    const next: MemoryFlashState = { ...state, phase: 'lost', mistakes: state.mistakes + 1 };
    return { kind: 'lost', state: next };
  }

  const input = [...state.input, cell];
  if (input.length < state.sequence.length) {
    return { kind: 'correct', state: { ...state, input } };
  }

  const roundScore = state.sequence.length * 10;
  const roundsCleared = state.roundsCleared + 1;
  const score = state.score + roundScore;
  if (roundsCleared >= state.config.targetRounds) {
    return { kind: 'levelWon', state: { ...state, input, score, roundsCleared, phase: 'levelWon' } };
  }

  return { kind: 'roundWon', state: { ...state, input, score, roundsCleared, phase: 'roundWon' } };
}

export function advanceRound(state: MemoryFlashState): MemoryFlashState {
  if (state.phase !== 'roundWon') return state;
  const round = state.round + 1;
  return {
    ...state,
    phase: 'showing',
    round,
    sequence: generateSequence(state.config, round),
    input: [],
  };
}

export function restartMemoryFlash(level: MemoryFlashLevel): MemoryFlashState {
  return createMemoryFlashState(level);
}

export function isValidSequence(config: MemoryFlashLevelConfig, sequence: number[]): boolean {
  const total = config.gridSize * config.gridSize;
  if (sequence.length !== sequenceLengthForRound(config, 0) && !sequence.length) return false;
  const seen = new Set<number>();
  for (const cell of sequence) {
    if (!Number.isInteger(cell) || cell < 0 || cell >= total) return false;
    if (seen.has(cell)) return false;
    seen.add(cell);
  }
  return true;
}

export function isValidRoundSequence(config: MemoryFlashLevelConfig, round: number, sequence: number[]): boolean {
  if (sequence.length !== sequenceLengthForRound(config, round)) return false;
  const total = config.gridSize * config.gridSize;
  const seen = new Set<number>();
  for (const cell of sequence) {
    if (!Number.isInteger(cell) || cell < 0 || cell >= total) return false;
    if (seen.has(cell)) return false;
    seen.add(cell);
  }
  return true;
}
