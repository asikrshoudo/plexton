import { StyleSheet, View } from 'react-native';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

type Props = {
  label: string;
  value?: string;
  description?: string;
  onPress?: () => void;
  disabled?: boolean;
  selected?: boolean;
};

export function ListRow({ label, value, description, onPress, disabled = false, selected = false }: Props) {
  const { palette } = useTheme();
  const pressable = !!onPress && !disabled;
  return (
    <PressableScale
      scaleTo={0.99}
      disabled={!pressable}
      onPress={onPress}
      accessibilityRole={pressable ? 'button' : 'text'}
      accessibilityLabel={value ? `${label}, ${value}` : label}
      accessibilityState={{ disabled: !pressable && disabled, selected }}
      style={[
        styles.row,
        { backgroundColor: palette.surface, borderColor: selected ? palette.primary : palette.border, opacity: disabled ? 0.55 : 1 },
      ]}>
      <View style={styles.text}>
        <AppText variant="heading">{label}</AppText>
        {description ? (
          <AppText variant="label" tone="muted">
            {description}
          </AppText>
        ) : null}
      </View>
      {value ? (
        <AppText variant="label" tone="muted">
          {value}
        </AppText>
      ) : null}
      {selected ? <AppText variant="heading" tone="primary">✓</AppText> : null}
      {pressable ? <AppText variant="heading" tone="muted">›</AppText> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: MIN_TOUCH + 16,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  text: { flex: 1, gap: 2 },
});
