import React from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { router, Stack, useSegments } from 'expo-router'
import { accent, appDark, light, transparent } from '@/utils/colors'
import { Appbar, PaperProvider } from 'react-native-paper'
import { TouchableOpacity } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import HapticWrapper from '@/components/Harptic'
import CustomImage from '@/components/CustomImage'

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
        <ThemedText type='subtitle' font='Poppins-Bold'>Conversations</ThemedText>

        <TouchableOpacity
          onPress={() => router.navigate('/(app)/(doctor)/notification')}
          style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CustomImage
            source={require('@/assets/images/icons/bell.png')}
            style={{ tintColor: theme == 'dark' ? light : appDark }}
            size={0.05}
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
          onPress={() => router.navigate('/(app)/(doctor)/(tabs)/(conversations)/conversations')}
          height={40}
          style={{
            backgroundColor: screenName == 'conversations' ? (theme == 'dark' ? light : accent) : transparent,
            flex: 1,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ThemedText
            type='body'
            font={screenName == 'conversations' ? 'Poppins-Bold' : 'Poppins-Medium'}
            lightColor={screenName == 'conversations' ? light : appDark}
            darkColor={screenName == 'conversations' ? appDark : light}
          >
            Messages
          </ThemedText>
        </HapticWrapper>

        <HapticWrapper
          onPress={() => router.navigate('/(app)/(doctor)/(tabs)/(conversations)/community')}
          height={40}
          style={{
            backgroundColor: screenName == 'community' ? (theme == 'dark' ? light : accent) : transparent,
            flex: 1,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ThemedText
            type='body'
            font={screenName == 'community' ? 'Poppins-Bold' : 'Poppins-Medium'}
            lightColor={screenName == 'community' ? light : appDark}
            darkColor={screenName == 'community' ? appDark : light}
          >
            Community
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
        <Stack.Screen name='conversations' />
        <Stack.Screen name='community' />
      </Stack>
    </PaperProvider>
  )
}