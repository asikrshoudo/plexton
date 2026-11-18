import { StyleSheet, View } from 'react-native';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../ui/AppText';
import { Card } from '../ui/Card';

export function HowToPlay({ steps, accent }: { steps: readonly string[]; accent: string }) {
  const { palette } = useTheme();
  return (
    <Card style={styles.card}>
      {steps.map((step, i) => (
        <View key={step} style={styles.step}>
          <View style={[styles.num, { backgroundColor: accent }]}>
            <AppText variant="label" color={palette.ink}>
              {i + 1}
            </AppText>
          </View>
          <AppText style={styles.text}>{step}</AppText>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  num: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1 },
});
