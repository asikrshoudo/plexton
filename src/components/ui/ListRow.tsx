import { StyleSheet, View } from 'react-native';
import { MIN_TOUCH, radius, spacing, stroke } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from './AppText';
import { Icon } from './Icon';
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
      scaleTo={0.995}
      disabled={!pressable}
      onPress={onPress}
      accessibilityRole={pressable ? 'button' : 'text'}
      accessibilityLabel={value ? `${label}, ${value}` : label}
      accessibilityState={{ disabled: !pressable && disabled, selected }}
      style={[
        styles.row,
        {
          backgroundColor: selected ? palette.primarySoft : palette.surface,
          borderColor: selected ? palette.borderStrong : palette.border,
          opacity: disabled ? 0.55 : 1,
        },
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
        <AppText variant="label" tone="muted" style={styles.value}>
          {value}
        </AppText>
      ) : null}
      {selected ? <AppText variant="heading" tone="primary">✓</AppText> : null}
      {pressable ? <Icon name="chevron" size={18} color={palette.textSubtle} /> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: MIN_TOUCH + 12,
    borderRadius: radius.md,
    borderWidth: stroke.hairline,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  text: { flex: 1, gap: 2 },
  value: { flexShrink: 1, textAlign: 'right' },
});
