import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';
import { PressableScale } from '../ui/PressableScale';

export function HomeHeader() {
  const { palette } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <AppText variant="caption" tone="subtle" style={styles.eyebrow}>
          PLEXTON
        </AppText>
        <AppText variant="display" accessibilityRole="header" style={styles.title}>
          Play. Think. <AppText variant="display" tone="primary">Ponder.</AppText>
        </AppText>
        <AppText variant="body" tone="muted">
          Two polished puzzle games, designed for quick focus and satisfying wins.
        </AppText>
      </View>
      <PressableScale
        onPress={() => router.push('/settings')}
        accessibilityRole="button"
        accessibilityLabel="Settings"
        style={[styles.gear, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Icon name="settings" color={palette.text} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md },
  brand: { flex: 1, gap: spacing.sm, paddingTop: spacing.xs },
  eyebrow: { letterSpacing: 1.6 },
  title: { maxWidth: 320 },
  gear: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
