import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/tokens';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

type Props = {
  level: number;
  score: number;
  xp: number;
  accent: string;
  onNext: () => void;
  onHome: () => void;
};

export function FlowResult({ level, score, xp, accent, onNext, onHome }: Props) {
  return (
    <Card style={styles.card} accessibilityLiveRegion="polite">
      <AppText variant="title">{`Level ${level} cleared!`}</AppText>
      <AppText tone="muted">{`Score ${score}${xp > 0 ? `  ·  +${xp} XP` : ''}`}</AppText>
      <Button label="Next level" accent={accent} onPress={onNext} />
      <Button label="Back to lobby" variant="secondary" onPress={onHome} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
});
