import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { ActivityIndicator, PaperProvider, Text } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { Call, CallContent, StreamCall, useStreamVideoClient } from '@stream-io/video-react-native-sdk'
import CustomCallControls from './CustomCallControls'
import CustomFloatingPaticipant from './CustomFloatingPaticipant'
import { View, StyleSheet } from 'react-native'
import { Image, ImageBackground } from 'expo-image'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/utils/fb'
import { ThemedText } from '../ThemedText'

interface Conversation { [key: string]: any }

export function VideoCall ({ chatId }: any) {
  const client = useStreamVideoClient()

  const [call, setCall] = useState<Call | null>(null)
  const [connecting, setConnecting] = useState<boolean>(true)
  const [conversationData, setConversationData] = useState<Conversation | null>(null)

  const getConversationData = async () => {
    const unsub = onSnapshot(doc(db, "chats", String(chatId)), (doc: any) => {
      setConversationData(doc.data())
    });

    return unsub
  }

  useEffect(() => {
    if (!client || call) return

    const joinCall = async () => {
      getConversationData()
      try {
        setConnecting(true)
        const call = client.call('default', chatId)
        await call.join({ create: true })
        setCall(call)
      } catch (err) {
        console.error('Failed to join call:', err)
      } finally {
        setConnecting(false)
      }
    }

    joinCall()
  }, [client])

  if (connecting || !call) {
    return (
      <PaperProvider>
        <ImageBackground
          source={require('@/assets/images/images/step3.png')}
          blurRadius={50}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View>
              <Image
                source={conversationData?.appointmentsData?.doctor?.displayImage?.image}
                placeholder={require('@/assets/images/images/avatar.png')}
                contentFit='cover'
                placeholderContentFit='cover'
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100
                }}
              />
            </View>

            <ThemedText type='subtitle' font='Poppins-Bold'>{conversationData?.appointmentsData?.doctor?.name}</ThemedText>
          </View>
        </ImageBackground>
      </PaperProvider>
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
