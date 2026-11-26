import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type Props = {
  level: number;
  score: number;
  xp: number;
  moves: number;
  durationMs: number;
  accent: string;
  onNext: () => void;
  onReplay: () => void;
  onHome: () => void;
};

function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function FlowResult({ level, score, xp, moves, durationMs, accent, onNext, onReplay, onHome }: Props) {
  const { palette } = useTheme();
  return (
    <Card elevated style={[styles.card, { borderColor: palette.success }]} accessibilityLiveRegion="polite">
      <View style={styles.header}>
        <AppText variant="title">{`Level ${level} complete`}</AppText>
        <AppText tone="muted">
          All paths connected. Score {score}
          {xp > 0 ? ` · +${xp} XP` : ''}.
        </AppText>
      </View>
      <View style={styles.stats}>
        <AppText variant="label" tone="muted">
          Strokes {moves}
        </AppText>
        <AppText variant="label" tone="muted">
          Time {formatDuration(durationMs)}
        </AppText>
      </View>
      <View style={styles.actions}>
        <Button label="Next level" accent={accent} onPress={onNext} />
        <Button label="Replay level" variant="secondary" onPress={onReplay} />
        <Button label="Back to lobby" variant="ghost" onPress={onHome} />
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
