import { View, Text } from 'react-native'
import React from 'react'
import { ThemedView } from '../ThemedView'
import { Call, HangUpCallButton, ReactionsButton, ToggleAudioPublishingButton, ToggleCameraFaceButton, ToggleVideoPreviewButton } from '@stream-io/video-react-native-sdk'
import { router } from 'expo-router'

export default function CustomCallControls ({ call, voice }: { call: Call, voice: boolean }) {
  return (
    <ThemedView
      style={{
        position: 'absolute',
        bottom: 20,
        marginHorizontal: 20,
        borderRadius: 50,
        padding: 10,
        alignSelf: 'center',
        gap: 20,
        flexDirection: 'row',
        alignItems: 'center'
      }}
    >
      <ReactionsButton />
      <ToggleAudioPublishingButton onPressHandler={() => call?.microphone?.toggle()} />
      {!voice && <ToggleVideoPreviewButton onPressHandler={() => call?.camera?.toggle()} />}
      {!voice && <ToggleCameraFaceButton onPressHandler={() => call?.camera?.flip()} />}
      <HangUpCallButton onPressHandler={() => {
        call?.endCall()
        router.back()
      }} />
    </ThemedView>
  )
}