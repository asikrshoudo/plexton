import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/tokens';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type Props = {
  won: boolean;
  level: number;
  score: number;
  xp: number;
  lossReason: string;
  accent: string;
  onAgain: () => void;
  onHome: () => void;
};

export function ResultPanel({ won, level, score, xp, lossReason, accent, onAgain, onHome }: Props) {
  return (
    <Card style={styles.card} accessibilityLiveRegion="polite">
      <AppText variant="title">{won ? `Level ${level} cleared!` : 'Out of moves'}</AppText>
      <AppText tone="muted">
        {won ? `Score ${score}${xp > 0 ? `  ·  +${xp} XP` : ''}` : `${lossReason} Score ${score}. Try again, same level.`}
      </AppText>
      <Button label={won ? 'Next level' : 'Try again'} accent={accent} onPress={onAgain} />
      <Button label="Back to lobby" variant="secondary" onPress={onHome} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
});
