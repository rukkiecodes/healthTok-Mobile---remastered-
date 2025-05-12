import React, { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { Call, CallContent, StreamCall, useStreamVideoClient } from '@stream-io/video-react-native-sdk'
import CustomCallControls from './CustomCallControls'
import CustomFloatingPaticipant from './CustomFloatingPaticipant'

export function VideoCall ({ chatId }: any) {
  const client = useStreamVideoClient()

  const [call, setCall] = useState<Call | null>(null)

  useEffect(() => {
    if (!client || call) return

    const joinCall = async () => {
      const call = client.call('default', chatId)
      await call.join({ create: true })
      setCall(call)
    }

    joinCall()
  }, [client])

  if (!call) return

  return (
    <PaperProvider>
      <ThemedView style={{ flex: 1 }}>
        <StreamCall call={call}>
          <CallContent
            onHangupCallHandler={router.back}
            CallControls={() => <CustomCallControls call={call} />}
            FloatingParticipantView={() => <CustomFloatingPaticipant />}
          />
        </StreamCall>
      </ThemedView>
    </PaperProvider>
  )
}