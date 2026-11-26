import { Stack } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HeartsProvider } from '@/features/hearts/HeartsProvider';
import { ProfileProvider } from '@/features/profile/ProfileProvider';
import { SettingsProvider } from '@/features/settings/SettingsProvider';
import { useTheme } from '@/theme/useTheme';

function RootStack() {
  const { palette, isDark } = useTheme();

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void NavigationBar.setStyle(isDark ? 'light' : 'dark');
  }, [isDark]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: palette.bg },
          animation: 'fade',
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <ProfileProvider>
          <HeartsProvider>
            <RootStack />
          </HeartsProvider>
        </ProfileProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
