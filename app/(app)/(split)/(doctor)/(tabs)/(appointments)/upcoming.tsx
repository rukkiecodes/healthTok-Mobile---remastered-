import { View } from 'react-native'
import React, { useState } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Appointment } from '@/store/types/doctor/appointments'
import { auth, db } from '@/utils/fb'
import { addDoc, collection, doc, getDocs, query, where } from 'firebase/firestore'
import { router } from 'expo-router'
import { ThemedView } from '@/components/ThemedView'
import { accent, appDark, light } from '@/utils/colors'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { formatCustomDate } from '@/libraries/formatDate'
import HapticWrapper from '@/components/Harptic'
import { ActivityIndicator } from 'react-native-paper'
import { FlashList } from '@shopify/flash-list'

export default function upcoming () {
  const theme = useColorScheme()
  const { profile } = useSelector((state: RootState) => state.profile)
  const { appointments } = useSelector((state: RootState) => state.doctorAppointment)

  const [loading, setLoading] = useState(false)

  const startChatWithDoctor = async (item: Appointment) => {
    const user = auth.currentUser;

    if (!user?.uid || !item?.doctor?.id) return;

    setLoading(true)

    try {
      // Check if a chat already exists between patient and doctor
      const chatQuery = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', user.uid)
      );

      const querySnapshot = await getDocs(chatQuery);
      let chatExists = false;
      let existingChatId: string | null = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(item?.doctor?.id)) {
          chatExists = true;
          existingChatId = doc.id;
        }
      });

      let chatDocRef;

      if (!chatExists) {
        // Create a new chat document
        chatDocRef = await addDoc(collection(db, 'chats'), {
          participants: [user.uid, item?.doctor?.id],
          createdAt: new Date(),
          lastMessage: null,
          isConsultionOpen: true,
          doctor: {
            uid: item?.doctor?.id,
            name: item?.doctor?.name || '',
            photoURL: (item?.doctor?.displayImage ? item?.doctor?.displayImage?.image : item?.doctor?.profilePicture) || '',
          },
          patient: {
            uid: user.uid,
            name: profile?.name || '',
            photoURL: (profile?.displayImage ? profile?.displayImage?.image : profile?.profilePicture) || '',
          },
        });
      } else {
        chatDocRef = doc(db, 'chats', existingChatId!);
      }

      setLoading(false)

      // Navigate to the chat screen with preloaded messages
      router.push({
        pathname: '/(app)/(split)/(doctor)/(chats)/[chatId]',
        params: { chatId: chatDocRef.id },
      });
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  }



  const renderItem = ({ item }: { item: Appointment }) => {
    return (
      <ThemedView
        style={{
          borderWidth: 1,
          borderColor: theme == 'dark' ? `${light}33` : `${appDark}33`,
          borderRadius: 20,
          padding: 10
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 20
          }}
        >
          <Image
            source={item?.doctor?.profilePicture}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50
            }}
          />

          <View>
            <ThemedText type='subtitle' font='Poppins-Bold'>{item?.doctor?.name}</ThemedText>
            <ThemedText type='body' font='Poppins-Regular'>{item?.appointment?.appointment?.reason}</ThemedText>
            <ThemedText type='body' font='Poppins-Regular'>{30}</ThemedText>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 20
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 20
            }}
          >
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <Image
                source={require('@/assets/images/icons/calendar.png')}
                style={{
                  width: 12,
                  height: 12,
                  tintColor: theme == 'dark' ? light : accent
                }}
              />

              <ThemedText type='caption' font='Poppins-Light'>{formatCustomDate(item?.appointment?.selectedDate)}</ThemedText>
            </View>

            <View style={{ flexDirection: 'row', gap: 5 }}>
              <Image
                source={require('@/assets/images/icons/clock.png')}
                style={{
                  width: 12,
                  height: 12,
                  tintColor: theme == 'dark' ? light : accent
                }}
              />

              <ThemedText type='caption' font='Poppins-Light'>{item?.appointment?.selectedTime?.time}</ThemedText>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <HapticWrapper
              style={{
                width: 50,
                height: 50,
                borderRadius: 10,
                backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                source={require('@/assets/images/icons/phone_fill.png')}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: theme == 'dark' ? light : accent
                }}
              />
            </HapticWrapper>

            <HapticWrapper
              onPress={() => startChatWithDoctor(item)}
              style={{
                width: 50,
                height: 50,
                borderRadius: 10,
                backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {
                loading ? (
                  <ActivityIndicator
                    size={18}
                    color={theme == 'dark' ? light : accent}
                    style={{
                      width: 20,
                      height: 20
                    }}
                  />
                ) :
                  (
                    <Image
                      source={require('@/assets/images/icons/chat_alt_fill.png')}
                      style={{
                        width: 20,
                        height: 20,
                        tintColor: theme == 'dark' ? light : accent
                      }}
                    />
                  )
              }
            </HapticWrapper>
          </View>
        </View>
      </ThemedView>
    )
  }


  return <FlashList
    data={appointments}
    renderItem={renderItem}
    keyExtractor={(item: any) => item.id}
    showsVerticalScrollIndicator={false}
    estimatedItemSize={20}
    contentContainerStyle={{
      padding: 20
    }}
  />
}