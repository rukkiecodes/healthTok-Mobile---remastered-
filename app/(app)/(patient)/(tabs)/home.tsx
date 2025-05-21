import { View, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Appbar, PaperProvider } from 'react-native-paper'
import { appDark, ice } from '@/utils/colors'
import { ThemedText } from '@/components/ThemedText'
import { Image } from 'expo-image'
import { QuickAccess } from '@/components/home/QuickAccess'
import { TopDoctors } from '@/components/home/TopDoctors'
import { TopBlogs } from '@/components/home/TopBlogs'

export default function home () {
  const theme = useColorScheme()
  const { profile } = useSelector((state: RootState) => state.patientProfile)

  return (
    <PaperProvider>
      <View style={{ paddingHorizontal: 20, marginTop: 60 }}>
        <ThemedText type='subtitle' font='Poppins-Bold'>Hello, {profile?.name}</ThemedText>
        <ThemedText type='body' font='Poppins-Regular'>Explore and get solutions to your desired health problems</ThemedText>
      </View>

      <ScrollView style={{ marginTop: 20 }} contentContainerStyle={{ gap: 40 }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 20,
            height: 40,
            paddingHorizontal: 20,
            margin: 20,
            borderWidth: 1.5,
            borderColor: theme == 'dark' ? ice : appDark,
            borderRadius: 50
          }}
        >
          <Image
            source={require('@/assets/images/icons/search.png')}
            style={{
              width: 25,
              height: 25,
              tintColor: theme == 'dark' ? ice : appDark
            }}
          />
          <ThemedText type='body' font='Poppins-Regular'>Search doctors, articles,blogs...</ThemedText>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <QuickAccess />
          <TopDoctors />
          <TopBlogs />
        </View>
      </ScrollView>
    </PaperProvider>
  )
}