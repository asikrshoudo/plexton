import { AppText } from '@/components/ui/AppText';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { useSettings } from '@/features/settings/SettingsProvider';
import { LANGUAGES } from '@/i18n/languages';

export default function LanguageScreen() {
  const { settings, update } = useSettings();

  return (
    <Screen title="Language" subtitle="UI language">
      {LANGUAGES.map((lang) => (
        <ListRow
          key={lang.code}
          label={lang.label}
          description={lang.available ? lang.native : `${lang.native} · Coming soon`}
          selected={lang.code === settings.language}
          disabled={!lang.available}
          onPress={lang.available ? () => update({ language: lang.code }) : undefined}
        />
      ))}
      <AppText variant="caption" tone="muted">
        English is currently the only available UI language. More languages will appear here when fully supported.
      </AppText>
    </Screen>
  );
}
