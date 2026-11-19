import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { shade } from '@/theme/shade';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../ui/AppText';
import { Icon } from '../ui/Icon';
import { PressableScale } from '../ui/PressableScale';

const LETTERS = ['P', 'L', 'E', 'X', 'T', 'O', 'N'];
const TINTS = ['#5B3DF5', '#FF8A3D', '#19B8A6', '#FF5C8A', '#4C7DFF', '#FF8A3D', '#19B8A6'];

export function HomeHeader() {
  const { palette } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <View accessible accessibilityRole="header" accessibilityLabel="Plexton" style={styles.word}>
          {LETTERS.map((ch, i) => (
            <View
              key={i}
              importantForAccessibility="no-hide-descendants"
              style={[
                styles.letter,
                {
                  backgroundColor: TINTS[i],
                  borderBottomColor: shade(TINTS[i], -0.25),
                  transform: [{ rotate: i % 2 === 0 ? '-3deg' : '3deg' }],
                },
              ]}>
              <AppText color={i === 0 ? '#FFFFFF' : palette.ink} style={styles.glyph}>
                {ch}
              </AppText>
            </View>
          ))}
        </View>
        <AppText variant="label" tone="muted">
          Play. Think. Ponder.
        </AppText>
      </View>
      <PressableScale
        onPress={() => router.push('/settings')}
        accessibilityRole="button"
        accessibilityLabel="Settings"
        style={[styles.gear, { backgroundColor: palette.surface, borderColor: palette.border, borderBottomColor: palette.edge }]}>
        <Icon name="settings" />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  brand: { flex: 1, gap: spacing.sm },
  word: { flexDirection: 'row', gap: 3 },
  letter: { width: 32, height: 36, borderRadius: 9, borderBottomWidth: 4, alignItems: 'center', justifyContent: 'center' },
  glyph: { fontSize: 19, lineHeight: 24, fontWeight: '900' },
  gear: {
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: MIN_TOUCH / 2,
    borderWidth: 1,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
