import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Appbar, PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Image } from 'expo-image'
import { appDark, light } from '@/utils/colors'

export default function voiceCall () {
  const theme = useColorScheme()
  const { chatId }: any = useLocalSearchParams()

  return (
    <PaperProvider>
      <Appbar.Header style={{ paddingHorizontal: 20, backgroundColor: theme == 'dark' ? appDark : light }}>
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            source={require('@/assets/images/icons/arrow_left.png')}
            contentFit='contain'
            style={{
              width: 20,
              height: 20,
              tintColor: theme == 'dark' ? light : appDark
            }}
          />
        </TouchableOpacity>
      </Appbar.Header>

      <ThemedView style={{ flex: 1 }}></ThemedView>
    </PaperProvider>
  )
}