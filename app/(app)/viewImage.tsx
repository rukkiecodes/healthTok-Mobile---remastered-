import { Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import { Appbar, PaperProvider } from 'react-native-paper'
import { router, useLocalSearchParams } from 'expo-router'
import { Image } from 'expo-image'
import { Buffer } from 'buffer';
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { appDark, light } from '@/utils/colors'

const { width } = Dimensions.get('window')

export default function viewImage () {
  const theme = useColorScheme()
  const { link } = useLocalSearchParams();

  const decodedLink = typeof link === 'string'
    ? Buffer.from(link, 'base64').toString('utf-8')
    : '';

  return (
    <PaperProvider>
      <Appbar.Header style={{ backgroundColor: theme == 'dark' ? appDark : light }}>
        <TouchableOpacity
          onPress={router.back}
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            source={require('@/assets/images/imgs/arrowLeft.png')}
            contentFit='contain'
            style={{
              width: 25,
              height: 20,
              tintColor: theme == 'dark' ? light : appDark
            }}
          />
        </TouchableOpacity>
      </Appbar.Header>

      <ThemedView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Image
          source={decodedLink}
          contentFit='contain'
          style={{
            width,
            height: width + (width / 2)
          }}
        />
      </ThemedView>
    </PaperProvider>
  )
}