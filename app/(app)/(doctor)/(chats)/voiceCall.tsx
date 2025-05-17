import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { VoiceCall } from '@/components/videoCall/VoiceCall'

export default function voiceCall () {
  const { chatId }: any = useLocalSearchParams()

  return <VoiceCall chatId={chatId} />
}