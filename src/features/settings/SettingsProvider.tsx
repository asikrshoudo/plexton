import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_LANGUAGE, type LanguageCode } from '@/i18n/languages';
import { readJson, writeJson } from '@/storage/kv';

export type Settings = {
  music: boolean;
  sfx: boolean;
  vibration: boolean;
  breakReminder: boolean;
  language: LanguageCode;
};

const KEY = 'settings.v1';

export const DEFAULT_SETTINGS: Settings = {
  music: true,
  sfx: true,
  vibration: true,
  breakReminder: true,
  language: DEFAULT_LANGUAGE,
};

type SettingsContextValue = {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  saveFailed: boolean;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function load(): Settings {
  const stored = readJson<Partial<Settings>>(KEY, {});
  return { ...DEFAULT_SETTINGS, ...stored };
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);
  const [saveFailed, setSaveFailed] = useState(false);

  const update = useCallback(
    (patch: Partial<Settings>) => {
      const next = { ...settings, ...patch };
      setSettings(next);
      setSaveFailed(!writeJson(KEY, next));
    },
    [settings],
  );

  const value = useMemo(() => ({ settings, update, saveFailed }), [settings, update, saveFailed]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
