import { StyleSheet, Switch, View } from 'react-native';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

type Props = {
  label: string;
  description?: string;
  value: boolean;
  onChange: (next: boolean) => void;
};

export function SwitchRow({ label, description, value, onChange }: Props) {
  const { palette } = useTheme();
  return (
    <PressableScale
      scaleTo={0.99}
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{ checked: value }}
      style={[styles.row, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <View style={styles.text}>
        <AppText variant="heading">{label}</AppText>
        {description ? (
          <AppText variant="label" tone="muted">
            {description}
          </AppText>
        ) : null}
      </View>
      <View pointerEvents="none" importantForAccessibility="no-hide-descendants">
        <Switch
          value={value}
          trackColor={{ false: palette.borderStrong, true: palette.primary }}
          thumbColor={palette.surface}
          ios_backgroundColor={palette.borderStrong}
        />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: MIN_TOUCH + 12,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  text: { flex: 1, gap: 2 },
});
