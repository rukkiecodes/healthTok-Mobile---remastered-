import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/utils/fb';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Update the current user's profile in Firestore with the Expo push token.
 */
const updateProfileWithPushToken = async (token: string) => {
  try {
    const collectionType = await AsyncStorage.getItem('healthTok_collection');
    const userId = auth.currentUser?.uid;

    if (!collectionType || !userId) {
      console.warn('Missing collection type or user ID');
      return;
    }

    const userDocRef = doc(db, collectionType, userId);
    await updateDoc(userDocRef, {
      expoPushNotificationToken: token,
    });

  } catch (error) {
    console.error('Failed to update profile with push token:', error);
  }
};

/**
 * Registers the device for push notifications and updates the user profile with the token.
 * Returns the push token or undefined if registration fails.
 */
export async function registerForPushNotificationsAsync (): Promise<string | undefined> {
  let token: string | undefined;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    // Alert.alert('Push Notification', 'Must use physical device for Push Notifications.');
    return;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Push Notification', 'Failed to get permission for push notifications.');
      return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

    if (!projectId) {
      throw new Error('Missing Expo project ID for push token generation.');
    }

    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    await updateProfileWithPushToken(token);
  } catch (error) {
    console.error('Error during push notification registration:', error);
  }

  return token;
}
