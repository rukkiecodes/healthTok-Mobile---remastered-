import React, { useEffect, useState } from 'react'
import { PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { Call, StreamCall, useStreamVideoClient } from '@stream-io/video-react-native-sdk'
import CustomCallControls from './CustomCallControls'
import { View } from 'react-native'
import { Image, ImageBackground } from 'expo-image'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/utils/fb'
import { ThemedText } from '../ThemedText'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Animated } from 'react-native'

interface Conversation { [key: string]: any }

export function VoiceCall ({ chatId }: any) {
  const client = useStreamVideoClient()

  const { profile } = useSelector((state: RootState) => state.patientProfile)
  const [call, setCall] = useState<Call | null>(null)
  const [connecting, setConnecting] = useState<boolean>(true)
  const [conversationData, setConversationData] = useState<Conversation | null>(null)
  const [fadeAnim] = useState(new Animated.Value(0))
  const [loadingOpacity] = useState(new Animated.Value(1)) // Start fully visible

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
        call.camera.disable()
        call.microphone.enable()
        await call.join({
          create: true,
          video: false,
        })
        setCall(call)
        Animated.timing(loadingOpacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => {
          setConnecting(false) // Only hide loading after fade out finishes
        })
      } catch (err) {
        console.error('Failed to join call:', err)
      } finally {
        setConnecting(false)
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start()
      }
    }

    joinCall()
  }, [client])

  if (connecting || !call) {
    return (
      <Animated.View style={{ flex: 1, opacity: loadingOpacity }}>
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

            <ThemedText type='subtitle' font='Poppins-Bold'>{conversationData?.appointmentsData?.doctor?.name}</ThemedText>
          </View>
        </ImageBackground>
      </Animated.View>
    )
  }

  return (
    <PaperProvider>
      <ThemedView style={{ flex: 1 }}>
        <StreamCall call={call}>
          <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
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
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: -50
                  }}
                >
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
                  <Image
                    source={profile?.displayImage?.image}
                    placeholder={require('@/assets/images/images/avatar.png')}
                    contentFit='cover'
                    placeholderContentFit='cover'
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 100,
                      position: 'absolute',
                      left: 50
                    }}
                  />
                </View>
              </View>

              <CustomCallControls call={call} voice={true} />
            </ImageBackground>
          </Animated.View>
        </StreamCall>
      </ThemedView>
    </PaperProvider>
  )
}