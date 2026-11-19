export type Pair = readonly [number, number];

export type ColorFlowState = {
  size: number;
  pairs: readonly Pair[];
  // paths[c] is the ordered cell list drawn for colour c (starts at an endpoint).
  paths: number[][];
};

export function createState(size: number, pairs: readonly Pair[]): ColorFlowState {
  return { size, pairs, paths: pairs.map(() => []) };
}

export function areAdjacent(a: number, b: number, size: number): boolean {
  const dr = Math.abs(Math.floor(a / size) - Math.floor(b / size));
  const dc = Math.abs((a % size) - (b % size));
  return dr + dc === 1;
}

export function endpointColor(state: ColorFlowState, cell: number): number {
  return state.pairs.findIndex(([a, b]) => a === cell || b === cell);
}

export function ownerOf(state: ColorFlowState, cell: number): number {
  return state.paths.findIndex((p) => p.includes(cell));
}

export function isComplete(state: ColorFlowState, color: number): boolean {
  const path = state.paths[color];
  if (!path || path.length < 2) return false;
  const [a, b] = state.pairs[color];
  const first = path[0];
  const last = path[path.length - 1];
  return (first === a && last === b) || (first === b && last === a);
}

export function connectedCount(state: ColorFlowState): number {
  let n = 0;
  for (let c = 0; c < state.pairs.length; c += 1) if (isComplete(state, c)) n += 1;
  return n;
}

export function filledCount(state: ColorFlowState): number {
  return state.paths.reduce((sum, p) => sum + p.length, 0);
}

export function isSolved(state: ColorFlowState): boolean {
  return connectedCount(state) === state.pairs.length && filledCount(state) === state.size * state.size;
}

export function startDrag(state: ColorFlowState, cell: number): { state: ColorFlowState; color: number } {
  const ec = endpointColor(state, cell);
  if (ec >= 0) {
    const paths = state.paths.slice();
    paths[ec] = [cell];
    return { state: { ...state, paths }, color: ec };
  }
  const owner = ownerOf(state, cell);
  if (owner >= 0) {
    const paths = state.paths.slice();
    paths[owner] = paths[owner].slice(0, paths[owner].indexOf(cell) + 1);
    return { state: { ...state, paths }, color: owner };
  }
  return { state, color: -1 };
}

// One step to an adjacent cell. Returns the same object when the step is not allowed.
export function stepTo(state: ColorFlowState, color: number, cell: number): ColorFlowState {
  const path = state.paths[color];
  if (!path || path.length === 0) return state;
  const last = path[path.length - 1];
  if (!areAdjacent(last, cell, state.size)) return state;

  const own = path.indexOf(cell);
  if (own === 0) return state;
  if (own > 0) {
    const paths = state.paths.slice();
    paths[color] = path.slice(0, own + 1);
    return { ...state, paths };
  }

  if (isComplete(state, color)) return state;
  const ec = endpointColor(state, cell);
  if (ec >= 0 && ec !== color) return state;

  const paths = state.paths.slice();
  const owner = ownerOf(state, cell);
  if (owner >= 0 && owner !== color) {
    paths[owner] = paths[owner].slice(0, paths[owner].indexOf(cell)); // cut the other path
  }
  paths[color] = [...path, cell];
  return { ...state, paths };
}

function stepCandidates(from: number, to: number, size: number): number[] {
  const fr = Math.floor(from / size);
  const fc = from % size;
  const dr = Math.floor(to / size) - fr;
  const dc = (to % size) - fc;
  const rowStep = dr !== 0 ? (fr + Math.sign(dr)) * size + fc : -1;
  const colStep = dc !== 0 ? fr * size + fc + Math.sign(dc) : -1;
  const ordered = Math.abs(dr) >= Math.abs(dc) ? [rowStep, colStep] : [colStep, rowStep];
  return ordered.filter((c) => c >= 0);
}

// Follows the finger even if it skipped cells between two touch events.
export function dragTo(state: ColorFlowState, color: number, cell: number): ColorFlowState {
  let current = state;
  for (let guard = state.size * state.size * 2; guard > 0; guard -= 1) {
    const path = current.paths[color];
    const last = path?.[path.length - 1];
    if (last === undefined || last === cell) break;
    let advanced = current;
    for (const next of stepCandidates(last, cell, current.size)) {
      advanced = stepTo(current, color, next);
      if (advanced !== current) break;
    }
    if (advanced === current) break;
    current = advanced;
  }
  return current;
}
