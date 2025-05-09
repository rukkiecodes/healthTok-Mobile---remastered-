import React from 'react'
import { Appbar, PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Image } from 'expo-image'
import { appDark, light } from '@/utils/colors'
import { ThemedText } from '@/components/ThemedText'

export default function doctorApplication () {
  const theme = useColorScheme()

  return (
    <PaperProvider>
      <Appbar.Header style={{ paddingHorizontal: 20, backgroundColor: theme == 'dark' ? appDark : light, justifyContent: 'center' }}>
        <ThemedText type='subtitle' font='Poppins-Bold'>Application</ThemedText>
      </Appbar.Header>

      <ThemedView style={{ flex: 1, padding: 20 }}>

      </ThemedView>
    </PaperProvider>
  )
}