import Storage from 'expo-sqlite/kv-store';

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = Storage.getItemSync(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): boolean {
  try {
    Storage.setItemSync(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
