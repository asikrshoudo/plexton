export type Palette = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  onPrimary: string;
  ink: string;
  success: string;
  danger: string;
};

export const lightPalette: Palette = {
  bg: '#FFF8EE',
  surface: '#FFFFFF',
  surfaceAlt: '#F3EBDC',
  border: '#EBE3D3',
  text: '#1B1A2E',
  textMuted: '#6B6882',
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
  text: '#F4F2FF',
  textMuted: '#A09DBB',
  primary: '#8A74FF',
  onPrimary: '#14131F',
  ink: '#1B1A2E',
  success: '#3DD598',
  danger: '#FF6B7A',
};
