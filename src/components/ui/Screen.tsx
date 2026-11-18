import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { ScreenHeader } from './ScreenHeader';

export function Screen({ title, children }: { title?: string; children: ReactNode }) {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.bg }}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.md,
        paddingBottom: insets.bottom + spacing.xxl,
        paddingHorizontal: spacing.lg,
        gap: spacing.lg,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {title ? <ScreenHeader title={title} /> : null}
      {children}
    </ScrollView>
  );
}
