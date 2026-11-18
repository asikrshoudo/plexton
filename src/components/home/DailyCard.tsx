import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { formatDayLabel, gameForDay, todayKey } from '@/features/daily/daily';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../ui/AppText';
import { PressableScale } from '../ui/PressableScale';

export function DailyCard() {
  const { palette } = useTheme();
  const { game, label } = useMemo(() => ({ game: gameForDay(todayKey()), label: formatDayLabel() }), []);

  return (
    <PressableScale
      onPress={() => router.push('/daily')}
      accessibilityRole="button"
      accessibilityLabel={`Daily challenge. ${label}. Featured game: ${game.name}`}
      style={[styles.card, { backgroundColor: palette.primary }]}>
      <View style={styles.body}>
        <AppText variant="caption" color={palette.onPrimary} style={{ opacity: 0.8 }}>
          DAILY CHALLENGE
        </AppText>
        <AppText variant="title" color={palette.onPrimary}>
          {game.name}
        </AppText>
        <AppText variant="label" color={palette.onPrimary} style={{ opacity: 0.85 }}>
          {label}
        </AppText>
      </View>
      <AppText variant="display" color={palette.onPrimary}>
        ›
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 88,
  },
  body: { flex: 1, gap: 2 },
});
