import { AppText } from './AppText';

export function SectionLabel({ children }: { children: string }) {
  return (
    <AppText
      variant="caption"
      tone="subtle"
      accessibilityRole="header"
      style={{ textTransform: 'uppercase', letterSpacing: 1.1, marginTop: 4 }}>
      {children}
    </AppText>
  );
}
