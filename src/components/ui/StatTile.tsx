import { StyleSheet } from 'react-native';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from './AppText';
import { Card } from './Card';

export function StatTile({ label, value }: { label: string; value: string }) {
  const { palette } = useTheme();
  return (
    <Card style={[styles.tile, { backgroundColor: palette.surface }]} accessible accessibilityLabel={`${label}: ${value}`}>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
      <AppText variant="title">{value}</AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, gap: spacing.xs, borderRadius: radius.md },
});
