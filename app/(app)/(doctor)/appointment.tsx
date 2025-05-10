import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Appbar, PaperProvider } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { appDark, light } from '@/utils/colors'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'

export default function appointment () {
  const theme = useColorScheme()

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          paddingHorizontal: 20,
          backgroundColor: theme == 'dark' ? appDark : light,
          justifyContent: 'space-between'
        }}
      >
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
            source={require('@/assets/images/icons/arrow_left.png')}
            contentFit='contain'
            style={{
              width: 20,
              height: 20,
              tintColor: theme == 'dark' ? light : appDark
            }}
          />
        </TouchableOpacity>

        <ThemedText type='subtitle'>Appointments</ThemedText>

        <View style={{ width: 50 }} />
      </Appbar.Header>

      {/* TODO: come back here when the doctor has an appointment */}
      <Text>appointment</Text>
    </PaperProvider>
  )
}