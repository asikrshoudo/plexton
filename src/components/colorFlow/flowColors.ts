export type FlowColor = { bg: string; fg: string; mark: string };

export const FLOW_COLORS: readonly FlowColor[] = [
  { bg: '#D95C54', fg: '#FFF8F5', mark: 'A' },
  { bg: '#3D7DD9', fg: '#F6FAFF', mark: 'B' },
  { bg: '#4A9A62', fg: '#F5FFF8', mark: 'C' },
  { bg: '#D7A63A', fg: '#201A10', mark: 'D' },
  { bg: '#D97A3A', fg: '#20140E', mark: 'E' },
  { bg: '#8557C7', fg: '#FAF7FF', mark: 'F' },
  { bg: '#2E9AA8', fg: '#F4FEFF', mark: 'G' },
  { bg: '#CC628F', fg: '#FFF7FB', mark: 'H' },
  { bg: '#7A6258', fg: '#FFF8F4', mark: 'I' },
  { bg: '#70838F', fg: '#F7FBFD', mark: 'J' },
];

export function flowColor(index: number): FlowColor {
  return FLOW_COLORS[index % FLOW_COLORS.length];
}

export function flowMark(index: number): string {
  return flowColor(index).mark;
}
