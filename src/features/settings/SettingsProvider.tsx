import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_LANGUAGE, LANGUAGES, type LanguageCode } from '@/i18n/languages';
import { readJson, writeJson } from '@/storage/kv';

export type Settings = {
  vibration: boolean;
  language: LanguageCode;
};

const KEY = 'settings.v1';

export const DEFAULT_SETTINGS: Settings = {
  vibration: true,
  language: DEFAULT_LANGUAGE,
};

type SettingsContextValue = {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  saveFailed: boolean;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function isLanguageCode(value: unknown): value is LanguageCode {
  return typeof value === 'string' && LANGUAGES.some((lang) => lang.code === value);
}

function load(): Settings {
  const stored = readJson<Partial<Settings> & Record<string, unknown>>(KEY, {});
  return {
    vibration: typeof stored.vibration === 'boolean' ? stored.vibration : DEFAULT_SETTINGS.vibration,
    language: isLanguageCode(stored.language) ? stored.language : DEFAULT_SETTINGS.language,
  };
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);
  const [saveFailed, setSaveFailed] = useState(false);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      setSaveFailed(!writeJson(KEY, next));
      return next;
    });
  }, []);

  const value = useMemo(() => ({ settings, update, saveFailed }), [settings, update, saveFailed]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
