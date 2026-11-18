import { AppText } from '@/components/ui/AppText';
import { ListRow } from '@/components/ui/ListRow';
import { Screen } from '@/components/ui/Screen';
import { useSettings } from '@/features/settings/SettingsProvider';
import { LANGUAGES } from '@/i18n/languages';

export default function LanguageScreen() {
  const { settings, update } = useSettings();

  return (
    <Screen title="Language">
      {LANGUAGES.map((lang) => (
        <ListRow
          key={lang.code}
          label={lang.label}
          description={lang.available ? lang.native : `${lang.native} · Coming soon`}
          selected={lang.code === settings.language}
          disabled={!lang.available}
          onPress={lang.code === 'en-US' ? () => update({ language: 'en-US' }) : undefined}
        />
      ))}
      <AppText variant="caption" tone="muted">
        More languages will be added in future updates.
      </AppText>
    </Screen>
  );
}
