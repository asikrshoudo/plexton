import { router } from 'expo-router';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SwitchRow } from '@/components/ui/SwitchRow';
import { AppText } from '@/components/ui/AppText';
import { LANGUAGES } from '@/i18n/languages';
import { useSettings } from '@/features/settings/SettingsProvider';

export default function SettingsScreen() {
  const { settings, update, saveFailed } = useSettings();
  const language = LANGUAGES.find((l) => l.code === settings.language);

  return (
    <Screen title="Settings">
      {saveFailed ? (
        <AppText tone="danger" accessibilityLiveRegion="polite">
          Could not save settings on this device.
        </AppText>
      ) : null}

      <SectionLabel>Audio & feedback</SectionLabel>
      <SwitchRow label="Music" value={settings.music} onChange={(v) => update({ music: v })} />
      <SwitchRow label="Sound effects" value={settings.sfx} onChange={(v) => update({ sfx: v })} />
      <SwitchRow
        label="Vibration"
        description="Light haptic feedback on taps"
        value={settings.vibration}
        onChange={(v) => update({ vibration: v })}
      />

      <SectionLabel>Wellbeing</SectionLabel>
      <SwitchRow
        label="Break reminder"
        description="A gentle nudge after 25 minutes of active play"
        value={settings.breakReminder}
        onChange={(v) => update({ breakReminder: v })}
      />

      <SectionLabel>General</SectionLabel>
      <ListRow label="Language" value={language?.label} onPress={() => router.push('/settings/language')} />
      <ListRow label="About Plexton" onPress={() => router.push('/settings/about')} />
    </Screen>
  );
}
