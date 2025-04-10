import { View, Text, ViewProps, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme';
import { useNotification } from '@/context/NotificationContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { accent, accentDark, accentLight, amber, dark, faintAccent, light } from '@/utils/colors';
import { useSelector } from 'react-redux';
import { RootState } from '@/utils/store';
import getUserId from '@/libraries/uid';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, increment, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '@/utils/fb';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { ThemedText } from '../ThemedText';
import { ActivityIndicator } from 'react-native-paper';
import generateId from '@/libraries/generateId';

interface Item {
  photoURL: string;
  fullName: string;
  timestamp: { seconds: number };
  artisanType?: string;
  uid?: string;
}

export type BookingsRowProps = ViewProps & {
  item?: Item | any;
};

const Row: React.FC<BookingsRowProps> = ({ item }) => {
  const colorScheme = useColorScheme();
  const { scheduleNotification }: any = useNotification()

  const accentButton = useThemeColor({ light: accentLight, dark: amber }, 'background');
  const accentButtonText = useThemeColor({ light: light, dark: dark }, 'text');
  const declineButton = useThemeColor({ light: faintAccent, dark: accentDark }, 'background');
  const declineButtonText = useThemeColor({ light: dark, dark: light }, 'text');

  const { profile } = useSelector((state: RootState) => state.user);
  const [acceptLoading, setAcceptLoading] = useState<boolean | false>(false)
  const [declineLoading, setDeclineLoading] = useState<boolean | false>(false)
  const [isConnected, setIsConnected] = useState<boolean>(false)

  const sendPushNotification = async (userSwiped: any) => {
    const { expoPushNotificationToken }: any = (await getDoc(doc(db, 'users', userSwiped.uid))).data();

    await scheduleNotification(
      expoPushNotificationToken,
      profile?.fullName,
      `${profile?.fullName} has accepted your job request`
    )
  }

  const sendNotification = async (id: string, userSwiped: any) => {
    await addDoc(collection(db, 'users', userSwiped?.uid, 'notification'), {
      from: id,
      title: 'Job accepted',
      message: `${profile?.fullName} has accepted your job request`,
      timestamp: serverTimestamp()
    })
  }

  const accept = async () => {
    const id = await getUserId()
    const userSwiped: any = item
    setAcceptLoading(true)

    await getDoc(doc(db, 'users', userSwiped?.uid, 'swipes', id))
      .then(async documentSnapshot => {
        if (documentSnapshot?.exists()) {
          setDoc(doc(db, 'users', id, 'swipes', userSwiped?.uid), userSwiped)

          // create conversation
          setDoc(doc(db, 'matches', generateId(id, userSwiped?.uid)), {
            users: {
              [id]: profile,
              [userSwiped?.uid]: userSwiped
            },
            usersMatched: [id, userSwiped?.uid],
            timestamp: serverTimestamp()
          }).then(async () => {
            deleteDoc(doc(db, 'users', id, 'pendingSwipes', userSwiped?.id))
            updateDoc(doc(db, 'users', id), { pendingSwipes: increment(-1) })
          })

          sendNotification(id, userSwiped)
          await sendPushNotification(userSwiped)

          router.navigate('/(app)/(tabs)/chat')
        } else {
          setDoc(doc(db, 'users', id, 'swipes', userSwiped?.uid), userSwiped)
          setDoc(doc(db, 'users', userSwiped?.uid, 'pendingSwipes', id), profile)
          updateDoc(doc(db, 'users', userSwiped?.uid), { pendingSwipes: increment(1) })
        }
      })

    setAcceptLoading(false)
  }

  const decline = async () => {
    const id: string = await getUserId()

    await deleteDoc(doc(db, 'users', id, 'pendingSwipes', item?.uid))
    await deleteDoc(doc(db, 'users', item?.uid, 'swipes', id))
  }

  const cancelRequest = async () => {
    const id: string = await getUserId()

    await deleteDoc(doc(db, 'users', item?.uid, 'pendingSwipes', id))
    await deleteDoc(doc(db, 'users', id, 'swipes', item?.uid))
  }

  const checkConnection = async () => {
    const uid = await getUserId(); // Your user ID
    const otherUserId = item?.uid;  // The other user ID

    // Query Firestore for documents where `users` array contains `uid`
    const q = query(collection(db, "matches"), where("usersMatched", "array-contains", uid));

    try {
      const snapshot = await getDocs(q);
      const matches = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((doc: any) => doc.usersMatched.includes(otherUserId)); // Manually filter for both users

      if (matches.length > 0) setIsConnected(true)
      else return;

    } catch (error) {
      console.error("Error checking connection:", error);
    }
  }

  useEffect(() => {
    checkConnection()
  }, [db, item])

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          const updatedItem = {
            ...item,
            photoURL: encodeURIComponent(item?.photoURL), // Encode the photoURL
          };

          router.push({
            pathname: '/(app)/(profile)/artisanProfile',
            params: {
              artisanProfile: JSON.stringify(updatedItem),
              sent: 'true'
            }
          })
        }}
      >
        <Image
          source={{ uri: item?.photoURL }}
          placeholder={require('@/assets/images/imgs/johnDoe.png')}
          placeholderContentFit='cover'
          contentFit='cover'
          style={{
            width: 90,
            height: 90,
            borderRadius: 50
          }}
        />
      </TouchableOpacity>

      <View style={styles.details}>
        <View style={styles.header}>
          <ThemedText type='body'>{item?.fullName}</ThemedText>
          <ThemedText style={styles.timestamp}>
            {item ? new Date(item?.timestamp?.seconds * 1000).toLocaleTimeString() : ''}
          </ThemedText>
        </View>

        {item?.artisanType && (
          <ThemedText style={styles.artisanType}>
            {item.artisanType}
          </ThemedText>
        )}

        {
          isConnected ?
            <>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: colorScheme == 'dark' ? dark : `${accent}33`,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                  marginTop: 10
                }}
              >
                <ThemedText type='body' font='Poppins-Bold'>Accepted</ThemedText>
              </View>
            </> :
            <>
              {
                profile?.joiningAs == 'artisan' ?
                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={accept} style={[styles.button, { backgroundColor: accentButton }]}>
                      {
                        acceptLoading ? <ActivityIndicator color={accentButtonText} /> :
                          <ThemedText style={{ color: accentButtonText }}>Accept</ThemedText>
                      }
                    </TouchableOpacity>

                    <TouchableOpacity onPress={decline} style={[styles.button, { backgroundColor: declineButton }]}>
                      {
                        declineLoading ? <ActivityIndicator color={declineButtonText} /> :
                          <ThemedText style={{ color: declineButtonText }}>Decline</ThemedText>
                      }
                    </TouchableOpacity>
                  </View> :
                  <TouchableOpacity
                    onPress={cancelRequest}
                    style={{
                      backgroundColor: colorScheme == 'dark' ? accentDark : faintAccent,
                      height: 40,
                      borderRadius: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 20
                    }}
                  >
                    <ThemedText>Cancel</ThemedText>
                  </TouchableOpacity>
              }
            </>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 20,
    marginBottom: 20,
  },
  details: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    opacity: 0.6,
  },
  artisanType: {
    opacity: 0.6,
    marginTop: 5,
  },
  buttonsContainer: {
    marginTop: 10,
    gap: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});


export default Row