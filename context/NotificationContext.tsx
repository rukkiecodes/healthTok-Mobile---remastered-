import React, { createContext, useState, useEffect, useRef, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { Subscription } from 'expo-modules-core';
import { registerForPushNotificationsAsync } from '@/libraries/registerForPushNotificationAsync';

interface NotificationContextProps {
  expoPushToken: any;
  channels: Notifications.NotificationChannel[];
  notification: Notifications.Notification | any;
  error: Error | null;
  scheduleNotification: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token: any) => setExpoPushToken(token),
      error => setError(error)
    )

    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const scheduleNotification: any = async (expoPushToken?: any, title?: string, body?: string, data?: any) => {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: title || '',
      body: body || '',
      data: { data: data || null, test: { test1: 'more data' } },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
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
