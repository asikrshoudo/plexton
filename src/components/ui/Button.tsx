import { StyleSheet } from 'react-native';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
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
  const bg = disabled ? palette.surfaceAlt : variant === 'primary' ? (accent ?? palette.primary) : 'transparent';
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
        { backgroundColor: bg, borderColor: variant === 'secondary' ? palette.border : 'transparent' },
      ]}>
      <AppText variant="heading" color={fg}>
        {label}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH + 4,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
