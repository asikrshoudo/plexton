import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Props = ViewProps & { style?: StyleProp<ViewStyle> };

export function Card({ style, ...rest }: Props) {
  const { palette } = useTheme();
  return (
    <View
      {...rest}
      style={[
        styles.card,
        { backgroundColor: palette.surface, borderColor: palette.border, borderBottomColor: palette.edge },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderBottomWidth: 4,
    padding: spacing.lg,
  },
});
