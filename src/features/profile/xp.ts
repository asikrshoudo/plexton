// XP needed to go from `level` to `level + 1`.
export function xpForLevel(level: number): number {
  return 100 + (level - 1) * 50;
}

export type LevelInfo = {
  level: number;
  xpIntoLevel: number;
  xpForNext: number;
  progress: number;
};

export function getLevelInfo(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = Math.max(0, Math.floor(totalXp));
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level += 1;
  }
  const xpForNext = xpForLevel(level);
  return { level, xpIntoLevel: remaining, xpForNext, progress: remaining / xpForNext };
}
