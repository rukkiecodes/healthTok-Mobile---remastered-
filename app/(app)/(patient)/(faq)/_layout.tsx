import React from 'react'
import { router, Stack } from 'expo-router'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { appDark, light } from '@/utils/colors'
import { Appbar, PaperProvider } from 'react-native-paper'
import { TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'

export default function _layout () {
  const theme = useColorScheme()

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          backgroundColor: theme == 'dark' ? appDark : light,
          justifyContent: 'space-between'
        }}
      >
        <TouchableOpacity
          onPress={router.back}
          style={{
            width: 40,
            height: 40,
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

        <ThemedText type='subtitle'>Frequently asked questions</ThemedText>

        <View style={{ width: 40 }} />
      </Appbar.Header>
      
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: {
            backgroundColor: theme == 'dark' ? appDark : light
          }
        }}
      />
    </PaperProvider>
  )
}