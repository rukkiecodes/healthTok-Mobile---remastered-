import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'

export default function answeres () {
  const { faq }: any = useLocalSearchParams()

  const parsParams = JSON.parse(faq)

  return (
    <ThemedView style={{ flex: 1, padding: 20, gap: 20 }}>
      <ThemedText type='subtitle' font='Poppins-Bold'>{parsParams?.question}</ThemedText>
      <ThemedText type='body' font='Poppins-Regular'>{parsParams?.answer}</ThemedText>
    </ThemedView>
  )
}