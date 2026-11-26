import { router, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useGameProgress } from '@/features/progress/useGameProgress';
import { GAMES, type GameMeta } from '@/games/registry';
import { PLAY_ROUTES } from '@/games/routes';
import { elevation, radius, spacing, stroke } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { GameArt } from '../game/GameArt';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';
import { PressableScale } from '../ui/PressableScale';
import { SectionLabel } from '../ui/SectionLabel';

export function GameLibrary() {
  return (
    <View style={styles.wrap}>
      <SectionLabel>Game library</SectionLabel>
      <View style={styles.list}>
        {GAMES.map((game, index) => (
          <LibraryRow key={game.id} game={game} featured={index === 0} />
        ))}
      </View>
    </View>
  );
}

function LibraryRow({ game, featured }: { game: GameMeta; featured: boolean }) {
  const { palette } = useTheme();
  const progress = useGameProgress(game.id);
  const playable = Boolean(PLAY_ROUTES[game.id]);

  return (
    <PressableScale
      onPress={() => router.push(`/game/${game.id}` as Href)}
      accessibilityRole="button"
      accessibilityLabel={`${game.name}. ${game.tagline}. ${playable ? `Level ${progress.level}` : 'Coming soon'}`}
      style={[
        styles.row,
        featured ? elevation.raised : elevation.card,
        { backgroundColor: palette.surface, borderColor: palette.border, shadowColor: palette.ink },
      ]}>
      <View style={[styles.art, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }]}>
        <View style={[styles.glow, { backgroundColor: `${game.accent}1C` }]} />
        <GameArt id={game.id} size={featured ? 78 : 62} />
      </View>
      <View style={styles.body}>
        <View style={styles.top}>
          <View style={styles.titleWrap}>
            <AppText variant="caption" tone="subtle" style={styles.kicker}>
              {playable ? 'PLAYABLE NOW' : 'COMING SOON'}
            </AppText>
            <AppText variant={featured ? 'title' : 'heading'} numberOfLines={1}>
              {game.name}
            </AppText>
          </View>
          <Icon name="chevron" size={18} color={palette.textSubtle} />
        </View>
        <AppText variant="body" tone="muted" numberOfLines={featured ? 3 : 2}>
          {game.description}
        </AppText>
        <View style={styles.meta}>
          <MetaPill label={playable ? `Level ${progress.level}` : 'In development'} accent={playable ? game.accent : undefined} />
          <MetaPill label={game.tagline} />
        </View>
      </View>
    </PressableScale>
  );
}

function MetaPill({ label, accent }: { label: string; accent?: string }) {
  const { palette } = useTheme();
  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: accent ? `${accent}16` : palette.surfaceAlt,
          borderColor: accent ? `${accent}40` : palette.border,
        },
      ]}>
      <AppText variant="caption" tone={accent ? 'default' : 'muted'} numberOfLines={1}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  list: { gap: spacing.md },
  row: {
    borderRadius: radius.xl,
    borderWidth: stroke.hairline,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'stretch',
  },
  art: {
    width: 112,
    minHeight: 112,
    borderRadius: radius.lg,
    borderWidth: stroke.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glow: { position: 'absolute', width: 88, height: 88, borderRadius: 44, top: 10, right: 4 },
  body: { flex: 1, gap: spacing.sm, paddingVertical: spacing.xs },
  top: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  titleWrap: { flex: 1, gap: 2 },
  kicker: { letterSpacing: 1.1 },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  pill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: stroke.hairline,
    maxWidth: '100%',
  },
});
