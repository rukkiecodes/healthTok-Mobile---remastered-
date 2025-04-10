import { View, useColorScheme, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Appbar, PaperProvider } from 'react-native-paper'
import { ThemedText } from '@/components/ThemedText'
import { appDark, ice, light } from '@/utils/colors'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { QuickAccess } from '@/components/home/QuickAccess'
import { TopDoctors } from '@/components/home/TopDoctors'
import { TopBlogs } from '@/components/home/TopBlogs'

export default function home () {
  const theme = useColorScheme()
  const { profile } = useSelector((state: RootState) => state.profile)

  return (
    <PaperProvider>
      <Appbar.Header style={{ backgroundColor: theme == 'dark' ? appDark : light }}>
        <View />
      </Appbar.Header>

      <View style={{ paddingHorizontal: 20 }}>
        <ThemedText type='subtitle' font='Poppins-Bold'>Hello, {profile?.name}</ThemedText>
        <ThemedText type='body' font='Poppins-Regular'>Explore and get solutions to your desired health problems</ThemedText>
      </View>

      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 20,
          height: 50,
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

      <ScrollView style={{ flexGrow: 1, marginTop: 20 }} contentContainerStyle={{ gap: 40 }}>
        <View style={{ gap: 40 }}>
          <QuickAccess />
          <TopDoctors />
          <TopBlogs />
        </View>
      </ScrollView>
    </PaperProvider>
  )
}