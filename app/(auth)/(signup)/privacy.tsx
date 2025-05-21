import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Appbar, PaperProvider } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, appDark, light } from '@/utils/colors'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import Privacy from '@/components/Privacy'

export default function privacy () {
  const theme = useColorScheme()

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          backgroundColor: theme == 'dark' ? appDark : light,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('@/assets/images/icons/arrow_left.png')}
            style={{
              tintColor: theme == 'dark' ? light : accent,
              width: 25,
              height: 25,
            }}
          />
        </TouchableOpacity>
      </Appbar.Header>

      <Privacy />
    </PaperProvider>
  )
}