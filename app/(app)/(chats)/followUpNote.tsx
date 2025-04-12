import { View, Text, TouchableOpacity } from 'react-native'
import React, { useRef } from 'react'
import { Appbar, PaperProvider } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { router, useLocalSearchParams } from 'expo-router'
import BottomSheet from '@gorhom/bottom-sheet'
import { Image } from 'expo-image'
import { appDark, light } from '@/utils/colors'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

export default function followUpNote () {
  const theme = useColorScheme()
  const { chatId, doctor } = useLocalSearchParams()
  const bottomSheetRef = useRef<BottomSheet>(null)

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
            source={require('@/assets/images/icons/arrow_left.png')}
            style={{
              width: 25,
              height: 25,
              tintColor: theme == 'dark' ? light : appDark
            }}
          />
        </TouchableOpacity>

        <ThemedText type='subtitle' font='Poppins-Bold'>Follow-up Note</ThemedText>
      </Appbar.Header>

      <ThemedView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Image
          source={require('@/assets/images/images/note.png')}
          style={{
            width: 80,
            height: 80,
            marginBottom: 20,
            tintColor: theme == 'dark' ? light : appDark
          }}
        />

        <ThemedText font='Poppins-Medium' type='subtitle'>No Follow-up Notes Found</ThemedText>
      </ThemedView>
    </PaperProvider>
  )
}