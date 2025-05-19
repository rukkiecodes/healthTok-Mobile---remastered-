import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { ActivityIndicator, PaperProvider, Text } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { Call, CallContent, StreamCall, useStreamVideoClient } from '@stream-io/video-react-native-sdk'
import CustomCallControls from './CustomCallControls'
import CustomFloatingPaticipant from './CustomFloatingPaticipant'
import { View, StyleSheet } from 'react-native'
import { Image, ImageBackground } from 'expo-image'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/utils/fb'
import { ThemedText } from '../ThemedText'
import { useNotification } from '@/context/notification'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Animated } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Conversation { [key: string]: any }

export function VideoCall ({ chatId }: any) {
  const client = useStreamVideoClient()
  const { scheduleNotification, registerCallRef } = useNotification();

  const { profile } = useSelector((state: RootState) => state.patientProfile)

  const [call, setCall] = useState<Call | null>(null)
  const [connecting, setConnecting] = useState<boolean>(true)
  const [conversationData, setConversationData] = useState<Conversation | null>(null)
  const [fadeAnim] = useState(new Animated.Value(0))
  const [loadingOpacity] = useState(new Animated.Value(1))

  useEffect(() => {
    if (!chatId) return

    const unsub = onSnapshot(doc(db, "chats", chatId), (docSnap) => {
      if (docSnap.exists()) {
        setConversationData(docSnap.data())
      }
    })

    return () => unsub()
  }, [chatId])

  useEffect(() => {
    if (!client || call || !conversationData) return;

    const joinCall = async () => {
      try {
        setConnecting(true);
        const call = client.call('default', chatId);

        const myId = String(auth.currentUser?.uid);
        const collectionType = await AsyncStorage.getItem('healthTok_collection');
        const isPatient = collectionType === 'patient'

        const counterpartId = isPatient
          ? conversationData?.appointmentsData?.doctor?.uid
          : conversationData?.appointmentsData?.patient?.uid

        if (!myId || !counterpartId) return

        const members = [myId, String(counterpartId)].map(user_id => ({ user_id }))

        await call.getOrCreate({
          ring: true,
          data: { members },
        })

        const userCollection = isPatient ? 'doctors' : 'patient'
        const userData = (await getDoc(doc(db, userCollection, String(counterpartId)))).data()

        await scheduleNotification(
          userData?.expoPushNotificationToken,
          'You have a call',
          `You have a call from your ${isPatient ? 'patient' : 'doctor'} ${profile?.name}`,
          {
            chatId,
            type: 'call',
            callType: 'video',
            name: profile?.name,
            image: profile?.displayImage?.image,
          }
        )

        registerCallRef(call)
        setCall(call)

        Animated.timing(loadingOpacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => {
          setConnecting(false)
        })
      } catch (err) {
        console.error('Failed to join call:', err)
        setConnecting(false)
      } finally {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start()
      }
    }
  }, [client, conversationData, call])

  // useEffect(() => {
  //   if (!client || call || !conversationData) return

  //   const joinCall = async () => {
  //     try {
  //       setConnecting(true)
  //       const call = client.call('default', chatId)
  //       await call.join({ create: true })
  //       setCall(call)
  //     } catch (err) {
  //       console.error('Failed to join call:', err)
  //     } finally {
  //       setConnecting(false)
  //     }
  //   }

  //   joinCall()
  // }, [client])

  // if (connecting || !call) {
  //   return (
  //     <PaperProvider>
  //       <ImageBackground
  //         source={require('@/assets/images/images/step3.png')}
  //         blurRadius={50}
  //         style={{
  //           flex: 1,
  //           justifyContent: 'center',
  //           alignItems: 'center'
  //         }}
  //       >
  //         <View
  //           style={{
  //             justifyContent: 'center',
  //             alignItems: 'center'
  //           }}
  //         >
  //           <View>
  //             <Image
  //               source={conversationData?.appointmentsData?.doctor?.displayImage?.image}
  //               placeholder={require('@/assets/images/images/avatar.png')}
  //               placeholderContentFit='cover'
  //               contentFit='cover'
  //               style={{
  //                 width: 100,
  //                 height: 100,
  //                 borderRadius: 100
  //               }}
  //             />
  //           </View>

  //           <ThemedText type='subtitle' font='Poppins-Bold'>{conversationData?.appointmentsData?.doctor?.name}</ThemedText>
  //         </View>
  //       </ImageBackground>
  //     </PaperProvider>
  //   )
  // }

  const avatar = conversationData?.appointmentsData?.doctor?.displayImage?.image
  const doctorName = conversationData?.appointmentsData?.doctor?.name
  
  if (connecting || !call) {
    return (
      <Animated.View style={{ flex: 1, opacity: loadingOpacity }}>
        <ImageBackground
          source={require('@/assets/images/images/step3.png')}
          blurRadius={50}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={avatar}
              placeholder={require('@/assets/images/images/avatar.png')}
              contentFit='cover'
              style={{ width: 100, height: 100, borderRadius: 100 }}
            />
            <ThemedText type='subtitle' font='Poppins-Bold'>
              {doctorName}
            </ThemedText>
          </View>
        </ImageBackground>
      </Animated.View>
    )
  }

  return (
    <PaperProvider>
      <ThemedView style={{ flex: 1 }}>
        <StreamCall call={call}>
          <CallContent
            onHangupCallHandler={router.back}
            CallControls={() => <CustomCallControls call={call} voice={false} />}
            FloatingParticipantView={() => <CustomFloatingPaticipant />}
          />
        </StreamCall>
      </ThemedView>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  callingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  callingText: {
    marginTop: 20,
    fontSize: 18
  }
})
