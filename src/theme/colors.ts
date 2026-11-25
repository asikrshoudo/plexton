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
  danger: string;
  dangerSoft: string;
  overlay: string;
  focus: string;
};

export const lightPalette: Palette = {
  bg: '#F7F4FF',
  bgElevated: '#FFFDF9',
  surface: '#FFFFFF',
  surfaceAlt: '#F1ECFF',
  surfacePressed: '#E8E1FF',
  border: '#DDD4F2',
  borderStrong: '#C7B8EA',
  edge: '#CFC1EB',
  text: '#211C35',
  textMuted: '#635C7A',
  textSubtle: '#857DA0',
  primary: '#5A42E6',
  primarySoft: '#EAE4FF',
  onPrimary: '#FFFFFF',
  ink: '#1B1730',
  success: '#148562',
  successSoft: '#DCF3EA',
  warning: '#E08A00',
  danger: '#D24557',
  dangerSoft: '#FBE4E8',
  overlay: 'rgba(33, 28, 53, 0.24)',
  focus: '#3B82F6',
};

export const darkPalette: Palette = {
  bg: '#141225',
  bgElevated: '#1B1830',
  surface: '#211D35',
  surfaceAlt: '#2A2542',
  surfacePressed: '#342E52',
  border: '#3A3458',
  borderStrong: '#524A79',
  edge: '#100E1B',
  text: '#F5F3FF',
  textMuted: '#B6B0D0',
  textSubtle: '#928BAF',
  primary: '#8C79FF',
  primarySoft: '#332B57',
  onPrimary: '#151227',
  ink: '#151227',
  success: '#45C793',
  successSoft: '#1F3A35',
  warning: '#FFBF47',
  danger: '#FF7788',
  dangerSoft: '#432832',
  overlay: 'rgba(7, 6, 14, 0.5)',
  focus: '#8AB4FF',
};
