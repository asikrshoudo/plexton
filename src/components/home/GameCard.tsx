import { router, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import type { GameMeta } from '@/games/registry';
import { useGameProgress } from '@/features/progress/useGameProgress';
import { shade } from '@/theme/shade';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { GameArt } from '../game/GameArt';
import { AppText } from '../ui/AppText';
import { PressableScale } from '../ui/PressableScale';

export function GameCard({ game }: { game: GameMeta }) {
  const { palette } = useTheme();
  const progress = useGameProgress(game.id);

  return (
    <PressableScale
      onPress={() => router.push(`/game/${game.id}` as Href)}
      accessibilityRole="button"
      accessibilityLabel={`${game.name}. ${game.tagline} Level ${progress.level}`}
      style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border, borderBottomColor: palette.edge }]}>
      <View style={[styles.art, { backgroundColor: game.accent, borderBottomColor: shade(game.accent, -0.2) }]}>
        <GameArt id={game.id} size={78} />
      </View>
      <View style={styles.text}>
        <AppText variant="heading" numberOfLines={1}>
          {game.name}
        </AppText>
        <AppText variant="caption" tone="muted" numberOfLines={1}>
          {game.tagline}
        </AppText>
      </View>
      <View style={[styles.pill, { backgroundColor: palette.surfaceAlt }]}>
        <AppText variant="caption">Level {progress.level}</AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderBottomWidth: 4,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  art: {
    height: 112,
    borderRadius: radius.md,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { gap: 1, paddingHorizontal: spacing.xs },
  pill: {
    alignSelf: 'flex-start',
    marginHorizontal: spacing.xs,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
});
