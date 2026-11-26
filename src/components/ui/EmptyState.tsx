import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme/tokens';
import { AppText } from './AppText';
import { Button } from './Button';
import { Card } from './Card';

type Props = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, message, actionLabel, onAction }: Props) {
  return (
    <Card muted style={styles.card} accessibilityRole="summary">
      <View style={styles.text}>
        <AppText variant="heading">{title}</AppText>
        <AppText variant="body" tone="muted">
          {message}
        </AppText>
      </View>
      {actionLabel && onAction ? <Button label={actionLabel} variant="secondary" onPress={onAction} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  text: { gap: spacing.xs },
});
