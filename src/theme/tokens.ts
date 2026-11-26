import { Platform, type TextStyle } from 'react-native';

export const spacing = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 40 } as const;

export const radius = { xs: 8, sm: 12, md: 16, lg: 20, xl: 28, pill: 999 } as const;

export const iconSize = { sm: 18, md: 22, lg: 28 } as const;

export const stroke = { hairline: 1, strong: 1.5 } as const;

export const elevation = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  card: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  raised: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  press: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
} as const;

export const motion = {
  duration: { fast: 120, normal: 180, slow: 280 },
  pressScale: 0.985,
  pressOpacity: 0.92,
} as const;

const displayFont = Platform.select({ ios: 'Georgia', android: 'serif', default: undefined });
const bodyFont = Platform.select({ ios: 'System', android: 'sans-serif', default: undefined });

export const typography = {
  display: {
    fontFamily: displayFont,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  title: {
    fontFamily: displayFont,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  heading: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: bodyFont,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodyStrong: {
    fontFamily: bodyFont,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  label: {
    fontFamily: bodyFont,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  caption: {
    fontFamily: bodyFont,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
} as const satisfies Record<string, TextStyle>;

export const MIN_TOUCH = 48;
export const MAX_FONT_SIZE_MULTIPLIER = 1.35;
