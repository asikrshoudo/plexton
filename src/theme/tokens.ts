import type { TextStyle } from 'react-native';

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { sm: 10, md: 16, lg: 24, pill: 999 } as const;

export const typography = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '800', letterSpacing: -0.5 },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '800' },
  heading: { fontSize: 17, lineHeight: 22, fontWeight: '700' },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0.3 },
} as const satisfies Record<string, TextStyle>;

export const MIN_TOUCH = 48;
