import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { LogBox } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { appDark, light } from '@/utils/colors';
import { store } from '@/store/store';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthenticationProvider } from '@/context/auth';
import * as SecureStore from 'expo-secure-store';
import { auth } from '@/utils/fb';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-native-sdk'
import { OverlayProvider } from "stream-chat-expo"
import { NotificationProvider } from '@/context/notification';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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

  const InitialLayout = () => {
    const [client, setClient] = useState<StreamVideoClient | null>(null)


    useEffect(() => {
      (async () => {
        const token = await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY!)
        if (auth.currentUser?.uid && token) {
          const user: any = { id: auth.currentUser?.uid! }

          try {
            const client = await StreamVideoClient.getOrCreateInstance({
              apiKey: process.env.EXPO_PUBLIC_STREAM_ACCESS_KEY!,
              user,
              token
            });
            setClient(client)
          } catch (error) {
            console.log('Error creating client: ', error)
          }
        } else client?.disconnectUser()
      })()
    }, [auth])

    return (
      <>
        {
          !client ? (
            <Slot />
          ) : (
            <StreamVideo client={client}>
              <OverlayProvider>
                <Slot />
              </OverlayProvider>
            </StreamVideo>
          )
        }
      </>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />

      <NotificationProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Provider store={store}>
            <AuthenticationProvider>
              <InitialLayout />
            </AuthenticationProvider>
          </Provider>
        </ThemeProvider>
      </NotificationProvider>
    </GestureHandlerRootView>
  );
}