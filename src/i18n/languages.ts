// Planned languages are kept visible for roadmap clarity. Only available
// languages can be selected; UI copy remains English until localization lands.
export type LanguageCode = 'en-US' | 'bn' | 'hi' | 'es';

export type LanguageOption = {
  code: LanguageCode;
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
