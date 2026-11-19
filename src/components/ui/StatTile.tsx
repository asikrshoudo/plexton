import { StyleSheet } from 'react-native';
import { spacing } from '@/theme/tokens';
import { AppText } from './AppText';
import { Card } from './Card';

export function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Card style={styles.tile} accessible accessibilityLabel={`${label}: ${value}`}>
      <AppText variant="caption" tone="muted" style={styles.label}>
        {label}
      </AppText>
      <AppText variant="title">{value}</AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, gap: 2, paddingVertical: spacing.md, paddingHorizontal: spacing.md },
  label: { textTransform: 'uppercase', letterSpacing: 0.8 },
});
