import { Text, type TextProps } from 'react-native';
import { typography } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Tone = 'default' | 'muted' | 'subtle' | 'primary' | 'onPrimary' | 'success' | 'danger' | 'warning';

export type AppTextProps = TextProps & {
  variant?: keyof typeof typography;
  tone?: Tone;
  color?: string;
};

export function AppText({ variant = 'body', tone = 'default', color, style, ...rest }: AppTextProps) {
  const { palette } = useTheme();
  const tones: Record<Tone, string> = {
    default: palette.text,
    muted: palette.textMuted,
    subtle: palette.textSubtle,
    primary: palette.primary,
    onPrimary: palette.onPrimary,
    success: palette.success,
    danger: palette.danger,
    warning: palette.warning,
  };
  return <Text {...rest} maxFontSizeMultiplier={1.35} style={[typography[variant], { color: color ?? tones[tone] }, style]} />;
}
