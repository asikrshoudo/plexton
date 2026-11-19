export const GAME_IDS = ['numberMerge', 'colorFlow', 'memoryFlash', 'wordGame'] as const;
export type GameId = (typeof GAME_IDS)[number];

export type GameMeta = {
  id: GameId;
  name: string;
  tagline: string;
  description: string;
  glyph: string;
  accent: string;
  howToPlay: readonly string[];
};

export const GAMES: readonly GameMeta[] = [
  {
    id: 'numberMerge',
    name: 'Number Merge',
    tagline: 'Drag, match, grow.',
    description: 'Drag a tile onto an equal one to merge them into a bigger number.',
    glyph: '8',
    accent: '#FF8A3D',
    howToPlay: [
      'Press and hold a tile, then drag it onto a tile with the same number.',
      'Equal tiles merge into one tile with double the value.',
      'Every merge adds a new tile nearby, and the next tile value is always shown.',
      'Reach the target number before you run out of moves or matching pairs.',
    ],
  },
  {
    id: 'colorFlow',
    name: 'Color Flow',
    tagline: 'Connect the dots.',
    description: 'Join matching colored dots with a path that never crosses another.',
    glyph: '≈',
    accent: '#19B8A6',
    howToPlay: [
      'Drag from a dot to its matching partner to draw a path.',
      'Paths cannot overlap or cross each other.',
      'Fill the whole grid to finish the level.',
      'Redraw a path any time to fix a mistake.',
    ],
  },
  {
    id: 'memoryFlash',
    name: 'Memory Flash',
    tagline: 'Watch. Remember. Repeat.',
    description: 'A pattern flashes for a moment. Remember it and repeat it perfectly.',
    glyph: '?',
    accent: '#FF5C8A',
    howToPlay: [
      'Watch the pattern while it is shown.',
      'When it disappears, repeat it from memory.',
      'Each round gets a little longer.',
      'Stay accurate to keep your streak going.',
    ],
  },
  {
    id: 'wordGame',
    name: 'Word Game',
    tagline: 'Find the words.',
    description: 'Build valid words from the letters you are given.',
    glyph: 'Aa',
    accent: '#4C7DFF',
    howToPlay: [
      'Use the given letters to form valid words.',
      'Longer words score more points.',
      'Use hints sparingly when you are stuck.',
      'Find enough words to clear the level.',
    ],
  },
];

export function getGame(id: string | undefined): GameMeta | undefined {
  return GAMES.find((g) => g.id === id);
}
