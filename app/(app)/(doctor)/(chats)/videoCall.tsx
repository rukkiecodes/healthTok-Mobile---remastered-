import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { VideoCall } from '@/components/videoCall/VideoCall'

export default function videoCall () {
  const { chatId }: any = useLocalSearchParams()

  return <VideoCall chatId={chatId} />
}