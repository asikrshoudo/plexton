import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { GameLibrary } from '@/components/home/GameLibrary';
import { HomeHeader } from '@/components/home/HomeHeader';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { PressableScale } from '@/components/ui/PressableScale';
import { Screen } from '@/components/ui/Screen';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function HomeScreen() {
  const { palette } = useTheme();
  return (
    <Screen contentStyle={styles.content}>
      <HomeHeader />
      <Card muted style={styles.focusCard}>
        <View style={styles.focusCopy}>
          <AppText variant="caption" tone="subtle" style={styles.kicker}>
            TODAY
          </AppText>
          <AppText variant="heading">Pick a puzzle and settle in.</AppText>
          <AppText variant="body" tone="muted">
            Two games are ready to play now. Two more are in the library and clearly marked until their gameplay is complete.
          </AppText>
        </View>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => router.push('/profile')}
          style={[styles.focusAction, { borderColor: palette.border, backgroundColor: palette.surface }]}>
          <AppText variant="label">View progress</AppText>
        </PressableScale>
      </Card>
      <GameLibrary />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.xl },
  focusCard: { gap: spacing.lg },
  focusCopy: { gap: spacing.sm },
  kicker: { letterSpacing: 1.1 },
  focusAction: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 999,
    borderWidth: 1,
  },
});
