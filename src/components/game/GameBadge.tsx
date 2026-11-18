import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../ui/AppText';

export function GameBadge({ glyph, accent, size = 52 }: { glyph: string; accent: string; size?: number }) {
  const { palette } = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.badge, { width: size, height: size, borderRadius: size * 0.32, backgroundColor: accent }]}>
      <AppText color={palette.ink} style={{ fontSize: size * 0.46, lineHeight: size * 0.58, fontWeight: '900' }}>
        {glyph}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignItems: 'center', justifyContent: 'center' },
});
