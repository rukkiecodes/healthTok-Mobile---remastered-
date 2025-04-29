import React from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { router, Stack, useSegments } from 'expo-router'
import { accent, appDark, light, transparent } from '@/utils/colors'
import { Appbar, PaperProvider } from 'react-native-paper'
import { TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import HapticWrapper from '@/components/Harptic'

export default function _layout () {
  const theme = useColorScheme()
  const segments = useSegments()

  const screenName = segments[segments.length - 1];

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          backgroundColor: theme == 'dark' ? appDark : light
        }}
      >
        <ThemedText type='subtitle' font='Poppins-Bold'>Appointment</ThemedText>

        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            source={require('@/assets/images/icons/bell.png')}
            style={{
              width: 25,
              height: 25,
              tintColor: theme == 'dark' ? light : appDark
            }}
          />
        </TouchableOpacity>
      </Appbar.Header>

      <ThemedView
        lightColor={`${accent}33`}
        darkColor={`${light}33`}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 12,
          margin: 20
        }}
      >
        <HapticWrapper
          onPress={() => router.navigate('/(app)/(split)/(doctor)/(tabs)/(appointments)/upcoming')}
          style={{
            backgroundColor: screenName == 'upcoming' ? (theme == 'dark' ? light : accent) : transparent,
            flex: 1,
            height: 50,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ThemedText
            type='default'
            font={screenName == 'upcoming' ? 'Poppins-Bold' : 'Poppins-Medium'}
            lightColor={screenName == 'upcoming' ? light : appDark}
            darkColor={screenName == 'upcoming' ? appDark : light}
          >
            Upcoming
          </ThemedText>
        </HapticWrapper>

        <HapticWrapper
          onPress={() => router.navigate('/(app)/(split)/(doctor)/(tabs)/(appointments)/completed')}
          style={{
            backgroundColor: screenName == 'completed' ? (theme == 'dark' ? light : accent) : transparent,
            flex: 1,
            height: 50,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ThemedText
            type='default'
            font={screenName == 'completed' ? 'Poppins-Bold' : 'Poppins-Medium'}
            lightColor={screenName == 'completed' ? light : appDark}
            darkColor={screenName == 'completed' ? appDark : light}
          >
            Completed
          </ThemedText>
        </HapticWrapper>

        <HapticWrapper
          onPress={() => router.navigate('/(app)/(split)/(doctor)/(tabs)/(appointments)/canceled')}
          style={{
            backgroundColor: screenName == 'canceled' ? (theme == 'dark' ? light : accent) : transparent,
            flex: 1,
            height: 50,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ThemedText
            type='default'
            font={screenName == 'canceled' ? 'Poppins-Bold' : 'Poppins-Medium'}
            lightColor={screenName == 'canceled' ? light : appDark}
            darkColor={screenName == 'canceled' ? appDark : light}
          >
            Canceled
          </ThemedText>
        </HapticWrapper>
      </ThemedView>

      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: {
            backgroundColor: theme == 'dark' ? appDark : light
          }
        }}
      >
        <Stack.Screen name='upcoming' />
        <Stack.Screen name='completed' />
        <Stack.Screen name='canceled' />
      </Stack>
    </PaperProvider>
  )
}