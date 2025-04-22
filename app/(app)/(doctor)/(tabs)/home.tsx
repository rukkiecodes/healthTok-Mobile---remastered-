import { View, Text } from 'react-native'
import React from 'react'
import { Appbar, PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Image } from 'expo-image'
import { appDark, light } from '@/utils/colors'

export default function home () {
  const theme = useColorScheme()

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          backgroundColor: theme == 'dark' ? appDark : light
        }}
      >
        <View>
          <Image
            source={require('@/assets/images/imgs/johnDoe.png')}
            style={{
              width: 50,
              height: 50
            }}
          />
        </View>
      </Appbar.Header>

      <ThemedView style={{ flex: 1 }}>

      </ThemedView>
    </PaperProvider>
  )
}