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

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

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

      notificationListener.current = Notifications.addNotificationReceivedListener(setNotification);

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Notification response received:', response);
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
    to: string = expoPushToken || '',
    title: string = '',
    body: string = '',
    data: any = null
  ) => {
    if (!to) {
      console.warn('Push token is not available.');
      return;
    }

    const message = {
      to,
      sound: 'default',
      title,
      body,
      data: { ...data, meta: { source: 'app' } },
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

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        notification,
        error,
        scheduleNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
