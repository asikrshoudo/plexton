import { StyleSheet } from 'react-native';
import { elevation, MIN_TOUCH, radius, spacing, stroke } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  accent?: string;
};

export function Button({ label, onPress, variant = 'primary', disabled = false, accent }: Props) {
  const { palette } = useTheme();
  const base = accent ?? palette.primary;
  const bg = disabled
    ? palette.surfaceAlt
    : variant === 'primary'
      ? base
      : variant === 'secondary'
        ? palette.surface
        : 'transparent';
  const borderColor = disabled
    ? palette.border
    : variant === 'secondary'
      ? palette.borderStrong
      : variant === 'primary'
        ? base
        : 'transparent';
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
        variant !== 'ghost' ? elevation.press : null,
        {
          backgroundColor: bg,
          borderColor,
          borderWidth: variant === 'ghost' ? 0 : stroke.hairline,
          shadowColor: palette.ink,
          opacity: disabled ? 0.72 : 1,
        },
      ]}>
      <AppText variant="label" color={fg} style={styles.label}>
        {label}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { textAlign: 'center' },
});
