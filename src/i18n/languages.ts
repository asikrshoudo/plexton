// To add a language: add an entry here, set available: true, and add its
// string table when the localisation layer lands. Settings only stores the code.
export type LanguageCode = 'en-US';

export type LanguageOption = {
  code: string;
  label: string;
  native: string;
  available: boolean;
};

export const DEFAULT_LANGUAGE: LanguageCode = 'en-US';

export const LANGUAGES: readonly LanguageOption[] = [
  { code: 'en-US', label: 'English (US)', native: 'English', available: true },
  { code: 'bn', label: 'Bangla', native: 'বাংলা', available: false },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', available: false },
  { code: 'es', label: 'Spanish', native: 'Español', available: false },
];
