import React from 'react'
import { router, Stack, useSegments } from 'expo-router'
import { Appbar, PaperProvider } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, appDark, dark, light, transparent } from '@/utils/colors'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import HapticWrapper from '@/components/Harptic'

export default function _layout () {
  const theme = useColorScheme()
  const segments = useSegments();
  const activeTab = segments[segments.length - 1]

  const buttons: any[] = ["all", "group", "communities"]

  return (
    <PaperProvider>
      <Appbar.Header style={{ paddingHorizontal: 20, backgroundColor: theme == 'dark' ? appDark : light }}>
        <ThemedText type='subtitle' font='Poppins-Bold'>Messages</ThemedText>
      </Appbar.Header>

      <ThemedView
        lightColor={`${accent}33`}
        darkColor={dark}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 12,
          overflow: 'hidden',
          margin: 20,
        }}
      >
        {
          buttons.map((item, index) => {
            return (
              <HapticWrapper
                key={index}
                onPress={() => router.navigate(`/(app)/(patient)/(tabs)/(conversations)/${item}`)}
                height={45}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 12,
                  backgroundColor: activeTab == item ? (theme == 'dark' ? light : accent) : transparent
                }}
              >
                <ThemedText
                  type='default'
                  font={activeTab == item ? 'Poppins-Bold' : 'Poppins-Medium'}
                  lightColor={activeTab == item ? light : appDark}
                  darkColor={activeTab == item ? appDark : light}
                  style={{ textTransform: 'capitalize' }}
                >
                  {item}
                </ThemedText>
              </HapticWrapper>
            )
          })
        }
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
        <Stack.Screen name='all' />
        <Stack.Screen name='group' />
        <Stack.Screen name='communities' />
      </Stack>
    </PaperProvider>
  )
}