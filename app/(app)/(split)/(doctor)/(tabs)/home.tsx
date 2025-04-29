import { View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Appbar, PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Image } from 'expo-image'
import { accent, appDark, light } from '@/utils/colors'
import { ThemedText } from '@/components/ThemedText'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { router } from 'expo-router'
import { FlashList } from '@shopify/flash-list'
import { Appointment } from '@/store/types/doctor/appointments'
import { formatCustomDate } from '@/libraries/formatDate'
import HapticWrapper from '@/components/Harptic'
import { auth, db } from '@/utils/fb'
import { addDoc, collection, doc, getDocs, query, serverTimestamp, where } from 'firebase/firestore'

export default function home () {
  const theme = useColorScheme()
  const { profile } = useSelector((state: RootState) => state.profile)
  const { appointments } = useSelector((state: RootState) => state.doctorAppointment)

  const [loading, setLoading] = useState(false)

  const startChatWithPatient = async (item: Appointment) => {
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
          createdAt: serverTimestamp(),
          lastMessage: null,
          isConsultionOpen: true,
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
              onPress={() => startChatWithPatient(item)}
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

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          backgroundColor: theme == 'dark' ? appDark : light
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
          <Image
            source={require('@/assets/images/imgs/johnDoe.png')}
            style={{
              width: 50,
              height: 50
            }}
          />

          <View style={{ gap: 3, justifyContent: 'center' }}>
            <ThemedText type='subtitle' font='Poppins-Bold'>{profile?.name}</ThemedText>
            <ThemedText type='caption'>{profile?.specialization}</ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            source={require('@/assets/images/icons/bell.png')}
            style={{
              width: 25,
              height: 25,
              tintColor: theme == 'dark' ? light : appDark
            }}
          />
        </TouchableOpacity>
      </Appbar.Header>

      <ThemedView style={{ flex: 1 }}>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: 50,
            borderColor: theme == 'dark' ? `${light}33` : `${appDark}33`,
            height: 50,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 20,
            paddingHorizontal: 20,
            margin: 20
          }}
        >
          <Image
            source={require('@/assets/images/icons/search.png')}
            style={{
              width: 20,
              height: 20,
              tintColor: theme == 'dark' ? light : appDark
            }}
          />

          <ThemedText type='body' font='Poppins-Light'>Search...</ThemedText>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 20
          }}
        >
          <ThemedText type='title' font='Poppins-Bold'>Upcoming Appointments</ThemedText>

          <TouchableOpacity onPress={() => router.navigate('/(app)/(split)/(doctor)/(appointments)/upcoming')}>
            <ThemedText type='body' font='Poppins-Medium'>See All</ThemedText>
          </TouchableOpacity>
        </View>

        <FlashList
          data={appointments}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={20}
          contentContainerStyle={{
            padding: 20
          }}
        />
      </ThemedView>
    </PaperProvider>
  )
}