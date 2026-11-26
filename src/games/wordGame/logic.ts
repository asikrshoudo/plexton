import { hashSeed, createRng } from '@/engine/rng';
import type { GeneratedLevel, LevelConfig } from '@/engine/types';
import { WORD_GAME_DICTIONARY } from './wordList';

export type WordGameLevelConfig = LevelConfig & {
  gameId: 'wordGame';
  letters: string; // lowercase, length 5-7
  minWordLength: number;
  targetWords: string[];
  targetScore: number;
  maxWords: number;
};

export type WordGameLevel = GeneratedLevel<WordGameLevelConfig>;

export type WordGameState = {
  config: WordGameLevelConfig;
  found: string[];
  score: number;
  currentInput: string;
  phase: 'playing' | 'won' | 'lost';
};

const DICT_SET = new Set(WORD_GAME_DICTIONARY);

export function normalizeWord(input: string): string {
  return input.toLowerCase().replace(/[^a-z]/g, '');
}

export function canFormWord(word: string, letters: string): boolean {
  const pool = letters.split('');
  for (const ch of word) {
    const idx = pool.indexOf(ch);
    if (idx < 0) return false;
    pool.splice(idx, 1);
  }
  return true;
}

export function isValidWord(word: string, letters: string, minLen: number): boolean {
  const w = normalizeWord(word);
  if (w.length < minLen) return false;
  if (!DICT_SET.has(w)) return false;
  return canFormWord(w, letters);
}

export function scoreWord(word: string): number {
  const len = word.length;
  if (len <= 3) return 10;
  if (len === 4) return 20;
  if (len === 5) return 40;
  if (len === 6) return 70;
  return 100;
}

export function allValidWords(letters: string, minLen: number): string[] {
  return WORD_GAME_DICTIONARY.filter((w) => w.length >= minLen && canFormWord(w, letters));
}

function pickLetters(level: number, tier: number): { letters: string; words: string[] } {
  const desiredLen = level <= 4 ? 4 : level <= 10 ? 5 : 6;
  const minLen = 3;
  const availableLens = [desiredLen, 5, 4, 6, 3].filter((l, i, a) => a.indexOf(l) === i);
  for (const len of availableLens) {
    const candidates = WORD_GAME_DICTIONARY.filter((w) => w.length === len);
    if (candidates.length === 0) continue;
    for (let attempt = 0; attempt < 300; attempt += 1) {
      const seed = hashSeed(`wordGame:${level}:${tier}:${len}:${attempt}`);
      const rng = createRng(seed);
      const base = candidates[rng.int(candidates.length)];
      const chars = base.split('');
      for (let i = chars.length - 1; i > 0; i -= 1) {
        const j = rng.int(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
      const letters = chars.join('');
      const words = allValidWords(letters, minLen);
      const minWords = Math.min(10, 4 + Math.floor(level / 3));
      const maxWords = Math.min(24, 7 + level);
      if (words.length >= minWords) {
        const sorted = [...words].sort();
        const targetCount = Math.min(maxWords, Math.max(minWords, words.length));
        return { letters, words: sorted.slice(0, targetCount) };
      }
    }
  }
  const fallback = 'tone';
  const words = allValidWords(fallback, 3).sort().slice(0, 10);
  return { letters: fallback, words: words.length ? words : ['one', 'ten', 'toe', 'not', 'ton'] };
}

export function generateWordGameLevel(level: number, difficultyTier: number): WordGameLevel {
  const { letters, words } = pickLetters(level, difficultyTier);
  const minWordLength = 3;
  const targetScore = words.reduce((s, w) => s + scoreWord(w), 0);
  // win requires finding a portion of words/score - make achievable
  const winScore = Math.max(scoreWord(words[0] ?? 'ace'), Math.floor(targetScore * (level <= 3 ? 0.45 : level <= 8 ? 0.55 : 0.65)));
  const seed = hashSeed(`wordGame:${level}:${difficultyTier}`);
  return {
    config: {
      gameId: 'wordGame',
      level,
      seed,
      difficultyTier,
      letters,
      minWordLength,
      targetWords: words,
      targetScore: winScore,
      maxWords: words.length,
    },
  };
}

export function createWordGameState(level: WordGameLevel): WordGameState {
  return {
    config: level.config,
    found: [],
    score: 0,
    currentInput: '',
    phase: 'playing',
  };
}

export type WordSubmitResult =
  | { kind: 'accepted'; state: WordGameState; word: string }
  | { kind: 'duplicate'; state: WordGameState }
  | { kind: 'invalid'; state: WordGameState; reason: 'short' | 'not-in-dict' | 'bad-letters' | 'not-target' }
  | { kind: 'won'; state: WordGameState; word: string }
  | { kind: 'ignored'; state: WordGameState };

export function submitWord(state: WordGameState, raw: string): WordSubmitResult {
  if (state.phase !== 'playing') return { kind: 'ignored', state };
  const word = normalizeWord(raw);
  if (word.length < state.config.minWordLength) return { kind: 'invalid', state, reason: 'short' };
  if (!canFormWord(word, state.config.letters)) return { kind: 'invalid', state, reason: 'bad-letters' };
  if (!DICT_SET.has(word)) return { kind: 'invalid', state, reason: 'not-in-dict' };
  if (!state.config.targetWords.includes(word)) return { kind: 'invalid', state, reason: 'not-target' };
  if (state.found.includes(word)) return { kind: 'duplicate', state };
  const found = [...state.found, word];
  const score = state.score + scoreWord(word);
  const won = score >= state.config.targetScore || found.length >= state.config.targetWords.length;
  const next: WordGameState = { ...state, found, score, currentInput: '', phase: won ? 'won' : 'playing' };
  return won ? { kind: 'won', state: next, word } : { kind: 'accepted', state: next, word };
}

export function addLetter(state: WordGameState, letter: string): WordGameState {
  if (state.phase !== 'playing') return state;
  const ch = normalizeWord(letter).slice(0, 1);
  if (!ch) return state;
  if (state.currentInput.length >= state.config.letters.length) return state;
  // only allow letters that exist in pool considering current usage
  const pool = state.config.letters.split('');
  for (const used of state.currentInput) {
    const idx = pool.indexOf(used);
    if (idx >= 0) pool.splice(idx, 1);
  }
  if (!pool.includes(ch)) return state;
  return { ...state, currentInput: state.currentInput + ch };
}

export function removeLetter(state: WordGameState): WordGameState {
  if (state.phase !== 'playing') return state;
  if (!state.currentInput) return state;
  return { ...state, currentInput: state.currentInput.slice(0, -1) };
}

export function clearInput(state: WordGameState): WordGameState {
  if (state.phase !== 'playing') return state;
  return { ...state, currentInput: '' };
}

export function shuffleLetters(letters: string, seed: number): string {
  const arr = letters.split('');
  const rng = createRng(seed);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = rng.int(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

export function giveUp(state: WordGameState): WordGameState {
  if (state.phase !== 'playing') return state;
  return { ...state, phase: 'lost', currentInput: '' };
}

