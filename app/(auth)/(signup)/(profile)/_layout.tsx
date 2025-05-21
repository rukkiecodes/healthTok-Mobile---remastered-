import React from 'react'
import { router, Stack, useSegments } from 'expo-router'
import { useColorScheme } from '@/hooks/useColorScheme'
import { accent, appDark, light, transparent } from '@/utils/colors'
import { Appbar, PaperProvider } from 'react-native-paper'
import { TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import HapticWrapper from '@/components/Harptic'

const AuthLayout = () => {
  const theme = useColorScheme()
  const segments = useSegments();
  const activeTab = segments[segments.length - 1]

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

        <ThemedText type='subtitle' font='Poppins-Bold'>Create Profile</ThemedText>

        <View style={{ width: 40 }} />
      </Appbar.Header>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`,
          marginHorizontal: 20
        }}
      >
        <HapticWrapper
          onPress={() => router.navigate('/(auth)/(signup)/(profile)/patient')}
          height={40}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            backgroundColor: activeTab == 'patient' ? (theme == 'dark' ? light : accent) : transparent
          }}
        >
          <ThemedText
            type='default'
            font={activeTab == 'patient' ? 'Poppins-Bold' : 'Poppins-Medium'}
            lightColor={activeTab == 'patient' ? light : appDark}
            darkColor={activeTab == 'patient' ? appDark : light}
          >
            Patient
          </ThemedText>
        </HapticWrapper>
        
        <HapticWrapper
          onPress={() => router.navigate('/(auth)/(signup)/(profile)/doctor')}
          height={40}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            backgroundColor: activeTab == 'doctor' ? (theme == 'dark' ? light : accent) : transparent
          }}
        >
          <ThemedText
            type='default'
            font={activeTab == 'doctor' ? 'Poppins-Bold' : 'Poppins-Medium'}
            lightColor={activeTab == 'doctor' ? light : appDark}
            darkColor={activeTab == 'doctor' ? appDark : light}
          >
            Doctor
          </ThemedText>
        </HapticWrapper>
      </View>

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

export default AuthLayout