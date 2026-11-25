import type { ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { ScreenHeader } from './ScreenHeader';

type Props = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({ title, subtitle, children, scroll = true, contentStyle }: Props) {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: insets.top + spacing.md,
    paddingBottom: insets.bottom + spacing.xxl,
    paddingHorizontal: spacing.lg,
  };

  if (!scroll) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.bg, ...padding, gap: spacing.lg }}>
        {title ? <ScreenHeader title={title} subtitle={subtitle} /> : null}
        <View style={[{ flex: 1, gap: spacing.lg }, contentStyle]}>{children}</View>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.bg }}
      contentContainerStyle={[padding, { gap: spacing.lg, flexGrow: 1 }, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {title ? <ScreenHeader title={title} subtitle={subtitle} /> : null}
      {children}
    </ScrollView>
  );
}
