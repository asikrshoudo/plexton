import { router, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import type { GameMeta } from '@/games/registry';
import { useGameProgress } from '@/features/progress/useGameProgress';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { GameBadge } from '../game/GameBadge';
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
      style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <GameBadge glyph={game.glyph} accent={game.accent} />
      <View style={styles.text}>
        <AppText variant="heading" numberOfLines={1}>
          {game.name}
        </AppText>
        <AppText variant="caption" tone="muted" numberOfLines={2}>
          {game.tagline}
        </AppText>
      </View>
      <View style={[styles.pill, { backgroundColor: game.accent + '33' }]}>
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
    padding: spacing.lg,
    gap: spacing.md,
    minHeight: 168,
  },
  text: { gap: 2, flex: 1 },
  pill: { alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill },
});
