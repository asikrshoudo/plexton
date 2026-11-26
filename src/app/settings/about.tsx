import Constants from 'expo-constants';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { radius, spacing, stroke } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function AboutScreen() {
  const { palette } = useTheme();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Screen title="About Plexton" subtitle="A calm puzzle arcade">
      <Card style={styles.hero} elevated>
        <View style={[styles.mark, { backgroundColor: palette.primarySoft, borderColor: palette.border }]}>
          <AppText variant="caption" tone="subtle" style={styles.kicker}>
            PLEXTON
          </AppText>
        </View>
        <AppText variant="display">Play. Think. Ponder.</AppText>
        <AppText variant="body" tone="muted">
          A premium offline puzzle collection designed for thoughtful play, clear feedback, and quiet focus.
        </AppText>
      </Card>

      <SectionLabel>Details</SectionLabel>
      <Card style={styles.details}>
        <Detail label="Version" value={version} />
        <Detail label="Publisher" value="TheKami" />
        <Detail label="Mode" value="Offline, on-device" />
      </Card>
    </Screen>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <AppText variant="label" tone="muted">
        {label}
      </AppText>
      <AppText variant="heading">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { gap: spacing.md },
  mark: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: stroke.hairline,
  },
  kicker: { letterSpacing: 1.2 },
  details: { gap: spacing.lg },
  detailRow: { gap: spacing.xs },
});
