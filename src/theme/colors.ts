export type Palette = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  edge: string;
  text: string;
  textMuted: string;
  primary: string;
  onPrimary: string;
  ink: string;
  success: string;
  danger: string;
};

export const lightPalette: Palette = {
  bg: '#FFF6E5',
  surface: '#FFFFFF',
  surfaceAlt: '#F1E7D2',
  border: '#E6DAC0',
  edge: '#DCCDAA',
  text: '#1F1B3A',
  textMuted: '#6E6A86',
  primary: '#5B3DF5',
  onPrimary: '#FFFFFF',
  ink: '#1B1A2E',
  success: '#12A06B',
  danger: '#D93A4A',
};

export const darkPalette: Palette = {
  bg: '#14131F',
  surface: '#1E1D2E',
  surfaceAlt: '#2A2940',
  border: '#2F2E45',
  edge: '#0D0C16',
  text: '#F4F2FF',
  textMuted: '#A09DBB',
  primary: '#8A74FF',
  onPrimary: '#14131F',
  ink: '#1B1A2E',
  success: '#3DD598',
  danger: '#FF6B7A',
};
