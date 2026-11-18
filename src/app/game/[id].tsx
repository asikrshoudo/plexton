import { router, useLocalSearchParams, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { GameBadge } from '@/components/game/GameBadge';
import { HowToPlay } from '@/components/game/HowToPlay';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { StatTile } from '@/components/ui/StatTile';
import { useGameProgress } from '@/features/progress/useGameProgress';
import { getGame, type GameMeta } from '@/games/registry';
import { PLAY_ROUTES } from '@/games/routes';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

function Lobby({ game }: { game: GameMeta }) {
  const { palette } = useTheme();
  const progress = useGameProgress(game.id);
  const playRoute = PLAY_ROUTES[game.id];

  return (
    <Screen title={game.name}>
      <View style={[styles.hero, { backgroundColor: game.accent }]}>
        <GameBadge glyph={game.glyph} accent={palette.surface} size={64} />
        <AppText variant="title" color={palette.ink}>
          {game.tagline}
        </AppText>
        <AppText color={palette.ink}>{game.description}</AppText>
      </View>

      <View style={styles.stats}>
        <StatTile label="Current level" value={String(progress.level)} />
        <StatTile label="Best score" value={progress.bestScore === null ? '—' : String(progress.bestScore)} />
      </View>

      {playRoute ? (
        <Button label={`Play level ${progress.level}`} accent={game.accent} onPress={() => router.push(playRoute as Href)} />
      ) : (
        <>
          <Button label="Coming soon" accent={game.accent} disabled />
          <AppText variant="caption" tone="muted" style={styles.note}>
            This game is not playable in this build yet.
          </AppText>
        </>
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
      <Screen title="Game not found">
        <AppText tone="muted">This game does not exist.</AppText>
        <Button label="Back to home" onPress={() => router.replace('/')} />
      </Screen>
    );
  }
  return <Lobby game={game} />;
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.lg, padding: spacing.xl, gap: spacing.md },
  stats: { flexDirection: 'row', gap: spacing.md },
  note: { textAlign: 'center' },
});
