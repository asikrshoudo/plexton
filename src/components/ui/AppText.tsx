import { Text, type TextProps } from 'react-native';
import { typography } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Tone = 'default' | 'muted' | 'primary' | 'onPrimary' | 'danger';

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
    primary: palette.primary,
    onPrimary: palette.onPrimary,
    danger: palette.danger,
  };
  return <Text {...rest} style={[typography[variant], { color: color ?? tones[tone] }, style]} />;
}
