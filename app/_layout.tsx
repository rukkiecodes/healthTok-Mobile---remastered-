import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { LogBox } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { appDark, light } from '@/utils/colors';
import { store } from '@/store/store';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthenticationProvider } from '@/context/auth';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout () {
  LogBox.ignoreAllLogs();

  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const customizeNavigation = () => {
    NavigationBar.setBackgroundColorAsync(colorScheme == 'dark' ? appDark : light);
  }

  useEffect(() => {
    customizeNavigation()
  }, [colorScheme])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style="auto" />

          <AuthenticationProvider>
            <Slot />
          </AuthenticationProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
