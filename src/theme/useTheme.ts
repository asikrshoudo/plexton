import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { darkPalette, lightPalette, type Palette } from './colors';

export type Theme = {
  palette: Palette;
  isDark: boolean;
  colorScheme: 'light' | 'dark';
};

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return useMemo(() => {
    const isDark = scheme === 'dark';
    return {
      palette: isDark ? darkPalette : lightPalette,
      isDark,
      colorScheme: isDark ? 'dark' : 'light',
    };
  }, [scheme]);
}
