import { StyleSheet, View } from 'react-native';
import { radius } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export function ProgressBar({ progress, color }: { progress: number; color?: string }) {
  const { palette } = useTheme();
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct) }}
      style={[styles.track, { backgroundColor: palette.surfaceAlt }]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color ?? palette.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 10, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
});
