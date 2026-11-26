import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { useSettings } from '@/features/settings/SettingsProvider';
import { LANGUAGES } from '@/i18n/languages';
import { spacing } from '@/theme/tokens';

export default function SettingsScreen() {
  const { settings, update, saveFailed } = useSettings();
  const language = LANGUAGES.find((l) => l.code === settings.language);

  return (
    <Screen title="Settings" subtitle="Simple, local, and under your control">
      {saveFailed ? (
        <Card style={styles.notice} accessibilityLiveRegion="polite">
          <AppText variant="label" tone="danger">
            Could not save settings on this device.
          </AppText>
        </Card>
      ) : null}

      <Card style={styles.hero} muted>
        <AppText variant="caption" tone="subtle" style={styles.kicker}>
          PREFERENCES
        </AppText>
        <AppText variant="heading">Keep play comfortable.</AppText>
        <AppText variant="body" tone="muted">
          Plexton stores your settings on this device only. Only controls that work right now are shown.
        </AppText>
      </Card>

      <SectionLabel>Feedback</SectionLabel>
      <SwitchRow
        label="Vibration"
        description="Light haptic feedback for taps and supported interactions"
        value={settings.vibration}
        onChange={(v) => update({ vibration: v })}
      />

      <SectionLabel>General</SectionLabel>
      <View style={styles.group}>
        <ListRow label="Language" value={language?.label ?? 'English (US)'} onPress={() => router.push('/settings/language')} />
        <ListRow label="About Plexton" onPress={() => router.push('/settings/about')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: spacing.sm },
  kicker: { letterSpacing: 1.1 },
  group: { gap: spacing.sm },
  notice: { paddingVertical: spacing.md },
});
