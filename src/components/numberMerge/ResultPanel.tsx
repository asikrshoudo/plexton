import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type Props = {
  won: boolean;
  level: number;
  score: number;
  xp: number;
  moves: number;
  moveLimit: number;
  target: number;
  highest: number;
  lossReason: string;
  accent: string;
  onAgain: () => void;
  onHome: () => void;
  heartConsumed?: boolean;
  hearts?: number;
  maxHearts?: number;
  nextHeartMs?: number;
};

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function ResultPanel({
  won,
  level,
  score,
  xp,
  moves,
  moveLimit,
  target,
  highest,
  lossReason,
  accent,
  onAgain,
  onHome,
  heartConsumed = false,
  hearts,
  maxHearts,
  nextHeartMs,
}: Props) {
  const { palette } = useTheme();
  const canRetry = won || (hearts ?? 1) > 0;
  const heartLine = !won && heartConsumed
    ? `Heart used: -1. ${typeof hearts === 'number' && typeof maxHearts === 'number' ? `${hearts}/${maxHearts} remaining.` : ''}${(hearts ?? 1) <= 0 && typeof nextHeartMs === 'number' ? ` Next heart in ${formatCountdown(nextHeartMs)}.` : ''}`
    : null;

  return (
    <Card
      elevated
      style={[styles.card, { borderColor: won ? palette.success : palette.borderStrong }]}
      accessibilityLiveRegion="polite">
      <View style={styles.header}>
        <AppText variant="title">{won ? `Level ${level} cleared` : 'Round over'}</AppText>
        <AppText tone="muted">
          {won
            ? `You reached ${target}. Score ${score}${xp > 0 ? ` � +${xp} XP` : ''}.`
            : `${lossReason} Highest tile ${highest}, target ${target}. Score ${score}.`}
        </AppText>
        {heartLine ? <AppText variant="label" tone="muted">{heartLine}</AppText> : null}
      </View>
      <View style={styles.stats}>
        <AppText variant="label" tone="muted">
          Moves {moves}/{moveLimit}
        </AppText>
        <AppText variant="label" tone="muted">
          Highest {highest}
        </AppText>
      </View>
      <View style={styles.actions}>
        <Button label={won ? 'Next level' : canRetry ? 'Try again' : 'No hearts available'} accent={won ? accent : undefined} onPress={canRetry ? onAgain : undefined} disabled={!canRetry} />
        <Button label="Back to lobby" variant="secondary" onPress={onHome} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  header: { gap: spacing.xs },
  stats: { flexDirection: 'row', gap: spacing.lg, flexWrap: 'wrap' },
  actions: { gap: spacing.sm },
});
