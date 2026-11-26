export type Palette = {
  bg: string;
  bgElevated: string;
  surface: string;
  surfaceAlt: string;
  surfacePressed: string;
  border: string;
  borderStrong: string;
  edge: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  primary: string;
  primarySoft: string;
  onPrimary: string;
  ink: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  overlay: string;
  focus: string;
  accentNumberMerge: string;
  accentColorFlow: string;
  accentMemoryFlash: string;
  accentWordGame: string;
};

export const lightPalette: Palette = {
  bg: '#FBF7F1',
  bgElevated: '#FFFDF9',
  surface: '#FFFDF8',
  surfaceAlt: '#F3EEE5',
  surfacePressed: '#EAE3D7',
  border: '#E5DDD0',
  borderStrong: '#D1C4B2',
  edge: '#D8CCBC',
  text: '#1F1B17',
  textMuted: '#665D54',
  textSubtle: '#8A8075',
  primary: '#2A241E',
  primarySoft: '#ECE4D8',
  onPrimary: '#FFF9F1',
  ink: '#1F1B17',
  success: '#2F6B4F',
  successSoft: '#E4EFE8',
  warning: '#A16207',
  warningSoft: '#F7EDD8',
  danger: '#B54A3C',
  dangerSoft: '#F8E7E4',
  overlay: 'rgba(31, 27, 23, 0.28)',
  focus: '#7A5C3A',
  accentNumberMerge: '#C96F3C',
  accentColorFlow: '#2F7C72',
  accentMemoryFlash: '#B4556C',
  accentWordGame: '#5A6DA8',
};

export const darkPalette: Palette = {
  bg: '#171411',
  bgElevated: '#1E1A16',
  surface: '#221D19',
  surfaceAlt: '#2B2520',
  surfacePressed: '#352E28',
  border: '#3A332C',
  borderStrong: '#54493F',
  edge: '#110F0C',
  text: '#F5EFE6',
  textMuted: '#C9BEB0',
  textSubtle: '#A39687',
  primary: '#F1E4D2',
  primarySoft: '#352D25',
  onPrimary: '#201A15',
  ink: '#201A15',
  success: '#7CB58F',
  successSoft: '#26352D',
  warning: '#E2B35A',
  warningSoft: '#3A3121',
  danger: '#E07A6D',
  dangerSoft: '#3B2825',
  overlay: 'rgba(8, 6, 5, 0.56)',
  focus: '#D2B48C',
  accentNumberMerge: '#E08A58',
  accentColorFlow: '#63AFA3',
  accentMemoryFlash: '#D88798',
  accentWordGame: '#92A4E0',
};
