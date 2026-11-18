const COLORS: Record<number, { bg: string; fg: string }> = {
  2: { bg: '#FFE0B2', fg: '#1B1A2E' },
  4: { bg: '#FFC77D', fg: '#1B1A2E' },
  8: { bg: '#FFA24D', fg: '#1B1A2E' },
  16: { bg: '#FF7F50', fg: '#1B1A2E' },
  32: { bg: '#F2506E', fg: '#FFFFFF' },
  64: { bg: '#D63384', fg: '#FFFFFF' },
  128: { bg: '#A855E0', fg: '#FFFFFF' },
  256: { bg: '#6C4DF5', fg: '#FFFFFF' },
  512: { bg: '#3F6CF0', fg: '#FFFFFF' },
  1024: { bg: '#12A6A0', fg: '#FFFFFF' },
  2048: { bg: '#12A06B', fg: '#FFFFFF' },
};

export function tileColors(value: number): { bg: string; fg: string } {
  return COLORS[value] ?? { bg: '#1B1A2E', fg: '#FFFFFF' };
}
