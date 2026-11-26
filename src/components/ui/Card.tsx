import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { elevation, radius, spacing, stroke } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Props = ViewProps & { style?: StyleProp<ViewStyle>; muted?: boolean; elevated?: boolean };

export function Card({ style, muted = false, elevated = false, ...rest }: Props) {
  const { palette } = useTheme();
  return (
    <View
      {...rest}
      style={[
        styles.card,
        elevated ? elevation.raised : elevation.card,
        {
          backgroundColor: muted ? palette.surfaceAlt : palette.surface,
          borderColor: muted ? palette.border : palette.border,
          shadowColor: palette.ink,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: stroke.hairline,
    padding: spacing.lg,
  },
});
