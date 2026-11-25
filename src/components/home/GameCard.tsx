import { router, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import type { GameMeta } from '@/games/registry';
import { useGameProgress } from '@/features/progress/useGameProgress';
import { PLAY_ROUTES } from '@/games/routes';
import { elevation, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { GameArt } from '../game/GameArt';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';
import { PressableScale } from '../ui/PressableScale';

export function GameCard({ game }: { game: GameMeta }) {
  const { palette } = useTheme();
  const progress = useGameProgress(game.id);
  const playable = Boolean(PLAY_ROUTES[game.id]);

  return (
    <PressableScale
      onPress={() => router.push(`/game/${game.id}` as Href)}
      accessibilityRole="button"
      accessibilityLabel={`${game.name}. ${game.tagline}. ${playable ? `Level ${progress.level}` : 'Coming soon'}`}
      style={[styles.card, elevation.card, { backgroundColor: palette.surface, borderColor: palette.border, shadowColor: palette.edge }]}>
      <View style={[styles.art, { backgroundColor: `${game.accent}1A`, borderColor: `${game.accent}33` }]}>
        <View style={[styles.artGlow, { backgroundColor: `${game.accent}20` }]} />
        <GameArt id={game.id} size={72} />
      </View>
      <View style={styles.text}>
        <AppText variant="heading" numberOfLines={1}>
          {game.name}
        </AppText>
        <AppText variant="label" tone="muted" numberOfLines={2}>
          {game.tagline}
        </AppText>
      </View>
      <View style={styles.footer}>
        <View
          style={[
            styles.pill,
            { backgroundColor: playable ? palette.primarySoft : palette.surfaceAlt, borderColor: palette.border },
          ]}>
          <AppText variant="caption" tone={playable ? 'primary' : 'muted'}>
            {playable ? `LEVEL ${progress.level}` : 'COMING SOON'}
          </AppText>
        </View>
        <Icon name="chevron" size={18} color={palette.textSubtle} />
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
    padding: spacing.md,
    gap: spacing.md,
  },
  art: {
    height: 124,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  artGlow: { position: 'absolute', width: 90, height: 90, borderRadius: 45, top: 10, right: 8 },
  text: { gap: 2, minHeight: 52 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
