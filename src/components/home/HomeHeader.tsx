import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../ui/AppText';
import { PressableScale } from '../ui/PressableScale';

export function HomeHeader() {
  const { palette } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <AppText variant="display" accessibilityRole="header">
          Plexton
        </AppText>
        <AppText variant="label" tone="primary">
          Play. Think. Ponder.
        </AppText>
      </View>
      <PressableScale
        onPress={() => router.push('/settings')}
        accessibilityRole="button"
        accessibilityLabel="Settings"
        style={[styles.gear, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <AppText variant="title">⚙</AppText>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  brand: { flex: 1 },
  gear: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: MIN_TOUCH / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
