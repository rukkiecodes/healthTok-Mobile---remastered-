import { View, Text, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import { Appbar, PaperProvider } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { router, useLocalSearchParams } from 'expo-router'
import BottomSheet from '@gorhom/bottom-sheet'
import { accent, appDark, black, dark, ice, light, transparent } from '@/utils/colors'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

export default function medications () {
  const theme = useColorScheme()
  const { chatId, doctor } = useLocalSearchParams()
  const bottomSheetRef = useRef<BottomSheet>(null)

  const [activeTab, setActiveTab] = useState('Injectables')

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

        <ThemedText type='subtitle' font='Poppins-Bold'>Medications</ThemedText>
      </Appbar.Header>

      <ThemedView style={{ flex: 1 }}>
        <ThemedView
          darkColor={black}
          lightColor={`${accent}33`}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 3,
            borderRadius: 20,
            margin: 20
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab('Injectables')}
            style={{
              width: '50%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
              backgroundColor: activeTab == 'Injectables' ? (theme == 'dark' ? appDark : accent) : transparent
            }}
          >
            <ThemedText font='Poppins-Medium' lightColor={activeTab == 'Injectables' ? light : dark}>Injectables</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('Orals')}
            style={{
              width: '50%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
              backgroundColor: activeTab == 'Orals' ? (theme == 'dark' ? appDark : accent) : transparent
            }}
          >
            <ThemedText font='Poppins-Medium' lightColor={activeTab == 'Orals' ? light : dark}>Orals</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        
      </ThemedView>
    </PaperProvider>
  )
}