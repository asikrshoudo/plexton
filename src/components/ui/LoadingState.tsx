import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from './AppText';

type Props = { label?: string };

export function LoadingState({ label = 'Loading' }: Props) {
  const { palette } = useTheme();
  return (
    <View style={styles.row} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator color={palette.primary} />
      <AppText variant="label" tone="muted">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
  },
});
