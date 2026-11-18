import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { readJson, writeJson } from '@/storage/kv';

export type Profile = { name: string; xp: number };

const KEY = 'profile.v1';
export const DEFAULT_PROFILE: Profile = { name: 'Player', xp: 0 };
export const MAX_NAME_LENGTH = 20;

type ProfileContextValue = {
  profile: Profile;
  rename: (name: string) => boolean;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

function load(): Profile {
  const stored = readJson<Partial<Profile>>(KEY, {});
  return {
    name: typeof stored.name === 'string' && stored.name.trim() ? stored.name : DEFAULT_PROFILE.name,
    xp: typeof stored.xp === 'number' && stored.xp >= 0 ? stored.xp : 0,
  };
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(load);

  const rename = useCallback(
    (name: string) => {
      const trimmed = name.trim().slice(0, MAX_NAME_LENGTH);
      if (!trimmed) return false;
      const next = { ...profile, name: trimmed };
      setProfile(next);
      return writeJson(KEY, next);
    },
    [profile],
  );

  const value = useMemo(() => ({ profile, rename }), [profile, rename]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside ProfileProvider');
  return ctx;
}
