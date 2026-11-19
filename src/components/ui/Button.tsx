import { StyleSheet } from 'react-native';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { shade } from '@/theme/shade';
import { useTheme } from '@/theme/useTheme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  accent?: string;
};

export function Button({ label, onPress, variant = 'primary', disabled = false, accent }: Props) {
  const { palette } = useTheme();
  const base = accent ?? palette.primary;
  const bg = disabled ? palette.surfaceAlt : variant === 'primary' ? base : palette.surface;
  const edge = disabled || variant === 'secondary' ? palette.edge : shade(base, -0.25);
  const fg = disabled
    ? palette.textMuted
    : variant === 'primary'
      ? accent
        ? palette.ink
        : palette.onPrimary
      : palette.text;

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderColor: palette.border,
          borderWidth: variant === 'secondary' ? 1.5 : 0,
          borderBottomWidth: 5,
          borderBottomColor: edge,
        },
      ]}>
      <AppText variant="heading" color={fg}>
        {label}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH + 8,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
