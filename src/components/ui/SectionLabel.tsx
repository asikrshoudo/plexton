import { AppText } from './AppText';

export function SectionLabel({ children }: { children: string }) {
  return (
    <AppText variant="caption" tone="muted" accessibilityRole="header" style={{ textTransform: 'uppercase', letterSpacing: 1.2 }}>
      {children}
    </AppText>
  );
}
