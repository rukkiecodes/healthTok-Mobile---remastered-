import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { LogBox } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AuthenticationProvider } from '@/context/auth';
import * as NavigationBar from 'expo-navigation-bar';
import { appDark, light } from '@/utils/colors';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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
  }, [])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <StatusBar style="auto" />

      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthenticationProvider>
          <Slot />
        </AuthenticationProvider>
      </ThemeProvider>
    </Provider>
  );
}
