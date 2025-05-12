import { View } from 'react-native'
import React from 'react'
import { FloatingParticipantView, useCallStateHooks } from '@stream-io/video-react-native-sdk'

export default function CustomFloatingPaticipant () {
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  return (
    <View
      style={{
        position: 'absolute',
        top: 40,
        right: 20
      }}
    >
      <FloatingParticipantView participant={localParticipant} />
    </View>
  )
}