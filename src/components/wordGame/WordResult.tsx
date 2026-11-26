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
  found: number;
  targetWords: number;
  targetScore: number;
  accent: string;
  onAgain: () => void;
  onHome: () => void;
};

export function WordResult({ won, level, score, xp, found, targetWords, targetScore, accent, onAgain, onHome }: Props) {
  const { palette } = useTheme();
  return (
    <Card elevated style={[styles.card, { borderColor: won ? palette.success : palette.borderStrong }]} accessibilityLiveRegion="polite">
      <View style={styles.header}>
        <AppText variant="title">{won ? `Level ${level} cleared` : 'Round ended'}</AppText>
        <AppText tone="muted">
          {won
            ? `You reached ${score} points (${found}/${targetWords} words).${xp > 0 ? ` +${xp} XP.` : ''}`
            : `You found ${found}/${targetWords} words for ${score} points. Target was ${targetScore}.`}
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
