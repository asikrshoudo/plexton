import { router, useLocalSearchParams, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { GameArt } from '@/components/game/GameArt';
import { HowToPlay } from '@/components/game/HowToPlay';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { HeartStatus } from '@/components/ui/HeartStatus';
import { Screen } from '@/components/ui/Screen';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { StatTile } from '@/components/ui/StatTile';
import { useHearts } from '@/features/hearts/HeartsProvider';
import { useGameProgress } from '@/features/progress/useGameProgress';
import { getGame, type GameMeta } from '@/games/registry';
import { PLAY_ROUTES } from '@/games/routes';
import { radius, spacing, stroke } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function Lobby({ game }: { game: GameMeta }) {
  const { palette } = useTheme();
  const progress = useGameProgress(game.id);
  const { hearts, maxHearts, msToNextHeart, isFull, canStartNumberMerge } = useHearts();
  const playRoute = PLAY_ROUTES[game.id];
  const playable = Boolean(playRoute);
  const needsHeart = game.id === 'numberMerge';
  const canStart = playable && (!needsHeart || canStartNumberMerge);

  return (
    <Screen title={game.name} subtitle={playable ? 'Ready to play' : 'In development'}>
      <Card style={styles.hero} elevated>
        <View style={styles.heroTop}>
          <View style={[styles.artWrap, { backgroundColor: palette.surfaceAlt, borderColor: palette.border }]}>
            <View style={[styles.glow, { backgroundColor: `${game.accent}1C` }]} />
            <GameArt id={game.id} size={96} />
          </View>
          <View style={styles.heroCopy}>
            <AppText variant="caption" tone="subtle" style={styles.kicker}>
              {playable ? 'PUZZLE' : 'COMING SOON'}
            </AppText>
            <AppText variant="title">{game.tagline}</AppText>
            <AppText variant="body" tone="muted">
              {game.description}
            </AppText>
          </View>
        </View>
        <View style={[styles.statusRow, { borderColor: palette.border }]}>
          <AppText variant="label" tone="muted">
            {playable ? `Current level ${progress.level}` : 'This game is visible in the library, but gameplay is not available yet.'}
          </AppText>
        </View>
      </Card>

      <View style={styles.stats}>
        <StatTile label="Current level" value={String(progress.level)} />
        <StatTile label="Best score" value={progress.bestScore === null ? '-' : String(progress.bestScore)} />
      </View>

      {needsHeart ? <HeartStatus /> : null}

      {playable ? (
        <>
          <Button
            label={canStart ? `Play level ${progress.level}` : 'No hearts available'}
            onPress={canStart ? () => router.push(playRoute as Href) : undefined}
            disabled={!canStart}
          />
          {needsHeart && !canStart ? (
            <Card muted style={styles.notice}>
              <AppText variant="heading">Number Merge needs a heart</AppText>
              <AppText variant="body" tone="muted">
                You have {hearts}/{maxHearts} hearts. Number Merge uses 1 heart only when an attempt is lost. You can start again in {formatCountdown(msToNextHeart)}.
              </AppText>
              {!isFull ? (
                <AppText variant="caption" tone="muted">
                  Hearts recover automatically, even when the app is closed.
                </AppText>
              ) : null}
            </Card>
          ) : null}
          {game.id === 'colorFlow' ? (
            <AppText variant="caption" tone="muted">
              Color Flow does not use hearts and is always playable.
            </AppText>
          ) : null}
          {game.id === 'memoryFlash' ? (
            <AppText variant="caption" tone="muted">
              Memory Flash does not use hearts and is always playable.
            </AppText>
          ) : null}
          {game.id === 'wordGame' ? (
            <AppText variant="caption" tone="muted">
              Word Game does not use hearts and is always playable.
            </AppText>
          ) : null}
        </>
      ) : (
        <Card muted style={styles.comingSoon}>
          <AppText variant="heading">Coming soon</AppText>
          <AppText variant="body" tone="muted">
            We are keeping this game visible so you know what is coming, but there is no fake playable screen here. Check back after its gameplay stage is complete.
          </AppText>
        </Card>
      )}

      <SectionLabel>How to play</SectionLabel>
      <HowToPlay steps={game.howToPlay} accent={game.accent} />
    </Screen>
  );
}

export default function GameLobbyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const game = getGame(id);

  if (!game) {
    return (
      <Screen title="Game not found" subtitle="This page is unavailable">
        <Card muted style={styles.comingSoon}>
          <AppText variant="body" tone="muted">
            This game does not exist in the current library.
          </AppText>
          <Button label="Back to home" onPress={() => router.replace('/')} />
        </Card>
      </Screen>
    );
  }
  return <Lobby game={game} />;
}

const styles = StyleSheet.create({
  hero: { gap: spacing.lg },
  heroTop: { flexDirection: 'row', gap: spacing.lg, alignItems: 'center' },
  artWrap: {
    width: 132,
    height: 132,
    borderRadius: radius.lg,
    borderWidth: stroke.hairline,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glow: { position: 'absolute', width: 100, height: 100, borderRadius: 50, top: 10, right: 8 },
  heroCopy: { flex: 1, gap: spacing.sm },
  kicker: { letterSpacing: 1.1 },
  statusRow: { paddingTop: spacing.md, borderTopWidth: stroke.hairline },
  stats: { flexDirection: 'row', gap: spacing.md },
  comingSoon: { gap: spacing.md },
  notice: { gap: spacing.sm },
});

