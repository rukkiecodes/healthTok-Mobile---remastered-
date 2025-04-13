import React from 'react'
import { router, Stack } from 'expo-router'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { appDark, light } from '@/utils/colors'
import { Appbar, PaperProvider } from 'react-native-paper'
import { TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'

export default function _layout () {
  const theme = useColorScheme()

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme == 'dark' ? appDark : light,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('@/assets/images/icons/arrow_left.png')}
            style={{
              tintColor: theme == 'dark' ? light : appDark,
              width: 25,
              height: 25,
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('@/assets/images/icons/bell.png')}
            contentFit='contain'
            style={{
              tintColor: theme == 'dark' ? light : appDark,
              width: 25,
              height: 25,
            }}
          />
        </TouchableOpacity>
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