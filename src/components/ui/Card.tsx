import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { elevation, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Props = ViewProps & { style?: StyleProp<ViewStyle>; muted?: boolean };

export function Card({ style, muted = false, ...rest }: Props) {
  const { palette } = useTheme();
  return (
    <View
      {...rest}
      style={[
        styles.card,
        elevation.card,
        {
          backgroundColor: muted ? palette.surfaceAlt : palette.surface,
          borderColor: palette.border,
          shadowColor: palette.edge,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
});
