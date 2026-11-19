export type FlowColor = { bg: string; fg: string };

export const FLOW_COLORS: readonly FlowColor[] = [
  { bg: '#E53935', fg: '#FFFFFF' },
  { bg: '#1E88E5', fg: '#FFFFFF' },
  { bg: '#43A047', fg: '#FFFFFF' },
  { bg: '#FDD835', fg: '#1B1A2E' },
  { bg: '#FB8C00', fg: '#1B1A2E' },
  { bg: '#8E24AA', fg: '#FFFFFF' },
  { bg: '#00ACC1', fg: '#1B1A2E' },
  { bg: '#EC407A', fg: '#1B1A2E' },
  { bg: '#6D4C41', fg: '#FFFFFF' },
  { bg: '#90A4AE', fg: '#1B1A2E' },
];

export function flowColor(index: number): FlowColor {
  return FLOW_COLORS[index % FLOW_COLORS.length];
}
