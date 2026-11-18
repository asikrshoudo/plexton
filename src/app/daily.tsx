import { router, type Href } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { GameBadge } from '@/components/game/GameBadge';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { formatDayLabel, gameForDay, todayKey } from '@/features/daily/daily';
import { spacing } from '@/theme/tokens';

export default function DailyScreen() {
  const { game, label } = useMemo(() => ({ game: gameForDay(todayKey()), label: formatDayLabel() }), []);

  return (
    <Screen title="Daily Challenge">
      <Card style={styles.card}>
        <GameBadge glyph={game.glyph} accent={game.accent} size={64} />
        <AppText variant="caption" tone="muted">
          {label.toUpperCase()}
        </AppText>
        <AppText variant="title">{game.name}</AppText>
        <AppText tone="muted">
          Today’s featured game is picked from the date, so everyone gets the same one. Playable daily
          challenges, streaks and rewards arrive once gameplay ships.
        </AppText>
      </Card>
      <Button
        label={`Open ${game.name}`}
        accent={game.accent}
        onPress={() => router.push(`/game/${game.id}` as Href)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
});
