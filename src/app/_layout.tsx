import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ProfileProvider } from '@/features/profile/ProfileProvider';
import { SettingsProvider } from '@/features/settings/SettingsProvider';
import { useTheme } from '@/theme/useTheme';

function RootStack() {
  const { palette, isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.bg } }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <ProfileProvider>
        <RootStack />
      </ProfileProvider>
    </SettingsProvider>
  );
}
