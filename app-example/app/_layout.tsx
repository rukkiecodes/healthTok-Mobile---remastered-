import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { LogBox } from 'react-native';
import { AuthProvider } from '@/context/auth';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout () {
  LogBox.ignoreAllLogs();
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),

    'Poppins-Black': require('@/assets/fonts/Poppins/Poppins-Black.ttf'),
    'Poppins-BlackItalic': require('@/assets/fonts/Poppins/Poppins-BlackItalic.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-BoldItalic': require('@/assets/fonts/Poppins/Poppins-BoldItalic.ttf'),
    'Poppins-ExtraBold': require('@/assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
    'Poppins-ExtraBoldItalic': require('@/assets/fonts/Poppins/Poppins-ExtraBoldItalic.ttf'),
    'Poppins-ExtraLight': require('@/assets/fonts/Poppins/Poppins-ExtraLight.ttf'),
    'Poppins-ExtraLightItalic': require('@/assets/fonts/Poppins/Poppins-ExtraLightItalic.ttf'),
    'Poppins-Italic': require('@/assets/fonts/Poppins/Poppins-Italic.ttf'),
    'Poppins-Light': require('@/assets/fonts/Poppins/Poppins-Light.ttf'),
    'Poppins-LightItalic': require('@/assets/fonts/Poppins/Poppins-LightItalic.ttf'),
    'Poppins-Medium': require('@/assets/fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-MediumItalic': require('@/assets/fonts/Poppins/Poppins-MediumItalic.ttf'),
    'Poppins-Regular': require('@/assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-SemiBoldItalic': require('@/assets/fonts/Poppins/Poppins-SemiBoldItalic.ttf'),
    'Poppins-Thin': require('@/assets/fonts/Poppins/Poppins-Thin.ttf'),
    'Poppins-ThinItalic': require('@/assets/fonts/Poppins/Poppins-ThinItalic.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />

      <AuthProvider>
        <Slot />
      </AuthProvider>
    </ThemeProvider>
  );
}
