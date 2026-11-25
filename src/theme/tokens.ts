import type { TextStyle } from 'react-native';

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 40 } as const;

export const radius = { sm: 12, md: 18, lg: 24, xl: 32, pill: 999 } as const;

export const iconSize = { sm: 18, md: 24, lg: 32 } as const;

export const elevation = {
  card: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  press: {
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

export const typography = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '800', letterSpacing: -0.8 },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '800', letterSpacing: -0.4 },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '700', letterSpacing: -0.2 },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '700' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 0.6 },
} as const satisfies Record<string, TextStyle>;

export const MIN_TOUCH = 48;
