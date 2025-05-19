import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useContext,
  ReactNode,
} from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '@/libraries/registerForPushNotificationAsync';
import { router } from 'expo-router';
import { Button, Dimensions, Text, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Image } from 'expo-image';
import { accent, black, green, light, offWhite, red } from '@/utils/colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import HapticWrapper from '@/components/Harptic';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { Call } from '@stream-io/video-react-native-sdk'
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window')

interface NotificationContextProps {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
  scheduleNotification: (
    to?: string,
    title?: string,
    body?: string,
    data?: any
  ) => Promise<void>;
  registerCallRef: (call: Call) => void;
  endCall: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }: { children: React.ReactNode }) => {
  const theme = useColorScheme()
  const currentCallRef = useRef<Call | null>(null)

  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [initialRoute, setInitialRoute] = useState<string | any>(null);
  const [foregroundNotification, setForegroundNotification] = useState<Notifications.Notification | any>(null);
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [callType, setCallType] = useState('')
  const [chatId, setChatId] = useState('')

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // When the app starts: check if opened via notification
    Notifications.getLastNotificationResponseAsync().then(response => {
      const route = response?.notification?.request?.content?.data?.route;
      const callType = response?.notification?.request?.content?.data?.callType;
      const chatId = response?.notification?.request?.content?.data?.chatId;

      if (route) {
        setInitialRoute(route);
        setCallType(callType)
        setChatId(chatId)
      }
    });

    // Listener: handles taps while app is running (background -> foreground)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const route = response?.notification?.request?.content?.data?.route;
      const callType = response?.notification?.request?.content?.data?.callType;
      const chatId = response?.notification?.request?.content?.data?.chatId;

      if (route) {
        setInitialRoute(route);
        setCallType(callType)
        setChatId(chatId)
      }
    });

    return () => {
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  useEffect(() => {
    if (initialRoute) {
      router.navigate(initialRoute);
      setInitialRoute(null); // Clear after navigation
    }
  }, [initialRoute]);

  useEffect(() => {
    Notifications.setNotificationCategoryAsync('incoming_call', [
      {
        identifier: 'ACCEPT_CALL',
        buttonTitle: 'Accept',
        options: { opensAppToForeground: true }
      },
      {
        identifier: 'REJECT_CALL',
        buttonTitle: 'Reject',
        options: { isDestructive: true }
      }
    ])
  }, [])

  useEffect(() => {
    let isMounted = true;

    const initializeNotifications = async () => {
      try {
        const token: any = await registerForPushNotificationsAsync();
        if (isMounted) {
          setExpoPushToken(token);
        }
      } catch (err: any) {
        setError(err);
      }

      notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);

        const type = notification.request.content.data?.type;
        if (type === 'call') {
          setForegroundNotification(notification);
          console.log('call notification: ', notification)
        }
      });
    };

    initializeNotifications();

    return () => {
      isMounted = false;
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const scheduleNotification = async (
    token: string = expoPushToken || '',
    title: string = '',
    body: string = '',
    data: any = null
  ) => {
    if (!token) return;

    const message = {
      to: token,
      sound: 'notification',
      title,
      body,
      data: { ...data, meta: { source: 'app' } }
    };

    try {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      console.log('Notification Sent: ', message)
    } catch (err) {
      console.error('Failed to send push notification:', err);
    }
  };

  const registerCallRef = (call: Call) => {
    currentCallRef.current = call;
    setCurrentCall(call);
  };


  const handleCallEvents = (call: Call) => {
    const onRejected = () => {
      console.log('call rejected');
      currentCallRef.current = null;
      setForegroundNotification(null);
      setCurrentCall(null);
    };

    const onEnded = () => {
      console.log('call ended');
      currentCallRef.current = null;
      setForegroundNotification(null);
      setCurrentCall(null);
    };

    call.on('call.ended', onRejected)
    call.off('call.rejected', onRejected); // in case already registered
    call.off('call.session_ended', onEnded);
    call.on('call.rejected', onRejected);
    call.on('call.session_ended', onEnded);
  };



  useEffect(() => {
    if (currentCall) {
      handleCallEvents(currentCall);
    }
  }, [currentCall, currentCallRef]);

  const endCall = () => {
    currentCallRef.current?.leave()
    setForegroundNotification(null)
    currentCallRef.current = null
  }

  const pickCall = async () => {
    const collectionType = await AsyncStorage.getItem('healthTok_collection');
    
    if (callType == 'voice') {
      const route = collectionType == 'patient' ? '/(app)/(patient)/(chats)/voiceCall' : '/(app)/(doctor)/(chats)/voiceCall'

      router.push({
        pathname: route,
        params: { chatId }
      })
    } else {
      const route = collectionType == 'patient' ? '/(app)/(patient)/(chats)/videoCall' : '/(app)/(doctor)/(chats)/videoCall'

      router.push({
        pathname: route,
        params: { chatId }
      })
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        error,
        scheduleNotification,
        registerCallRef,
        endCall
      }}
    >
      {foregroundNotification &&
        (
          <ThemedView>
            <HapticWrapper
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 50,
                marginHorizontal: 20,
                borderRadius: 100,
                padding: 10,
                backgroundColor: theme == 'dark' ? black : offWhite
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  gap: 20,
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}
              >
                <Image
                  source={foregroundNotification.request.content.data?.image}
                  placeholder={require('@/assets/images/images/avatar.png')}
                  contentFit='cover'
                  placeholderContentFit='cover'
                  style={{
                    width: width / 9,
                    height: width / 9,
                    borderRadius: 50
                  }}
                />
                <View>
                  <ThemedText type='caption'>Calling...</ThemedText>
                  <ThemedText type='default' font='Poppins-Bold'>Terry Amagboro</ThemedText>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: 20
                }}
              >
                <HapticWrapper
                  onPress={endCall}
                  style={{
                    width: width / 9,
                    height: width / 9,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: red
                  }}
                >
                  <MaterialCommunityIcons name="phone-hangup" size={20} color={light} />
                </HapticWrapper>

                <HapticWrapper
                  onPress={pickCall}
                  style={{
                    width: width / 9,
                    height: width / 9,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: green
                  }}
                >
                  <Entypo name="phone" size={20} color={light} />
                </HapticWrapper>
              </View>
            </HapticWrapper>
          </ThemedView>
        )
      }

      {children}
    </NotificationContext.Provider >
  );
};
