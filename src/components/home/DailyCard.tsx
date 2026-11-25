import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { formatDayLabel, gameForDay, todayKey } from '@/features/daily/daily';
import { elevation, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { GameArt } from '../game/GameArt';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';
import { PressableScale } from '../ui/PressableScale';

export function DailyCard() {
  const { palette } = useTheme();
  const { game, label } = useMemo(() => ({ game: gameForDay(todayKey()), label: formatDayLabel() }), []);

  return (
    <PressableScale
      onPress={() => router.push('/daily')}
      accessibilityRole="button"
      accessibilityLabel={`Daily pick. ${label}. Featured game: ${game.name}`}
      style={[styles.card, elevation.card, { backgroundColor: palette.primary, borderColor: palette.primary, shadowColor: palette.primary }]}>
      <View style={styles.body}>
        <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.16)' }]}>
          <AppText variant="caption" color={palette.onPrimary} style={styles.kicker}>
            DAILY PICK
          </AppText>
        </View>
        <AppText variant="title" color={palette.onPrimary}>
          {game.name}
        </AppText>
        <AppText variant="label" color={palette.onPrimary} style={styles.subtle}>
          {label}
        </AppText>
        <View style={styles.cta}>
          <AppText variant="label" color={palette.onPrimary}>View details</AppText>
          <Icon name="chevron" size={18} color={palette.onPrimary} />
        </View>
      </View>
      <View style={[styles.art, { backgroundColor: 'rgba(255,255,255,0.14)', borderColor: 'rgba(255,255,255,0.18)' }]}>
        <GameArt id={game.id} size={52} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 128,
  },
  body: { flex: 1, gap: spacing.xs },
  badge: { alignSelf: 'flex-start', paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.pill },
  kicker: { letterSpacing: 1.1 },
  subtle: { opacity: 0.86 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: spacing.xs, opacity: 0.95 },
  art: {
    width: 84,
    height: 84,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
