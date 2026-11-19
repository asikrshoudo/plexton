import { spawnValue } from './logic';

export type SolveInput = { seed: number; pool: readonly number[]; startTiles: number; target: number };

// Tile positions never affect which merges are possible, so solving works on the multiset of values.
// Returns the value merged at each step, or null when no solution is found within the limits.
export function solve({ seed, pool, startTiles, target }: SolveInput, cap: number, nodeBudget = 40000): number[] | null {
  const start = Array.from({ length: startTiles }, (_, i) => spawnValue(seed, i + 1, pool)).sort((a, b) => a - b);
  const dead = new Set<string>();
  const path: number[] = [];
  let nodes = 0;

  const dfs = (values: number[], step: number): boolean => {
    if (values[values.length - 1] >= target) return true;
    if (step >= cap) return false;
    const key = `${step}|${values.join(',')}`;
    if (dead.has(key)) return false;
    nodes += 1;
    if (nodes > nodeBudget) return false;

    const dupes: number[] = [];
    for (let i = values.length - 1; i > 0; i -= 1) {
      if (values[i] === values[i - 1] && dupes[dupes.length - 1] !== values[i]) dupes.push(values[i]);
    }
    for (const v of dupes) {
      const next = values.slice();
      next.splice(next.indexOf(v), 2, v * 2);
      next.push(spawnValue(seed, startTiles + 1 + step, pool));
      next.sort((a, b) => a - b);
      path.push(v);
      if (dfs(next, step + 1)) return true;
      path.pop();
    }
    dead.add(key);
    return false;
  };

  return dfs(start, 0) ? path.slice() : null;
}
