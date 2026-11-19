import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { formatDayLabel, gameForDay, todayKey } from '@/features/daily/daily';
import { shade } from '@/theme/shade';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { GameArt } from '../game/GameArt';
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
      style={[styles.card, { backgroundColor: palette.primary, borderBottomColor: shade(palette.primary, -0.3) }]}>
      <View style={styles.body}>
        <AppText variant="caption" color={palette.onPrimary} style={styles.kicker}>
          DAILY CHALLENGE
        </AppText>
        <AppText variant="title" color={palette.onPrimary}>
          {game.name}
        </AppText>
        <AppText variant="label" color={palette.onPrimary} style={{ opacity: 0.85 }}>
          {label}
        </AppText>
      </View>
      <View style={[styles.art, { backgroundColor: game.accent }]}>
        <GameArt id={game.id} size={44} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderBottomWidth: 5,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 92,
  },
  body: { flex: 1, gap: 2 },
  kicker: { opacity: 0.8, letterSpacing: 1.2 },
  art: { width: 66, height: 66, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
