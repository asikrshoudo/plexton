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
  roundsCleared: number;
  targetRounds: number;
  accent: string;
  onAgain: () => void;
  onHome: () => void;
};

export function MemoryResult({ won, level, score, xp, roundsCleared, targetRounds, accent, onAgain, onHome }: Props) {
  const { palette } = useTheme();
  return (
    <Card elevated style={[styles.card, { borderColor: won ? palette.success : palette.borderStrong }]} accessibilityLiveRegion="polite">
      <View style={styles.header}>
        <AppText variant="title">{won ? `Level ${level} cleared` : 'Run over'}</AppText>
        <AppText tone="muted">
          {won
            ? `You completed all ${targetRounds} rounds. Score ${score}${xp > 0 ? ` • +${xp} XP` : ''}.`
            : `You cleared ${roundsCleared}/${targetRounds} rounds. Score ${score}.`}
        </AppText>
      </View>
      <View style={styles.actions}>
        <Button label={won ? 'Next level' : 'Try again'} accent={won ? accent : undefined} onPress={onAgain} />
        <Button label="Back to lobby" variant="secondary" onPress={onHome} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  header: { gap: spacing.xs },
  actions: { gap: spacing.sm },
});
