import { View, Text } from 'react-native'
import React from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { router, Stack, useSegments } from 'expo-router';
import { Appbar, PaperProvider } from 'react-native-paper';
import { ThemedText } from '@/components/ThemedText';
import { accent, appDark, dark, light, transparent } from '@/utils/colors';
import { ThemedView } from '@/components/ThemedView';
import HapticWrapper from '@/components/Harptic';

export default function _layout () {
  const theme = useColorScheme()
  const segments = useSegments();
  const activeTab = segments[segments.length - 1]

  const buttons: any[] = ["upcoming", "completed", "canceled"]

  return (
    <PaperProvider>
      <Appbar.Header style={{ paddingHorizontal: 20, backgroundColor: theme == 'dark' ? appDark : light }}>
        <ThemedText type='subtitle' font='Poppins-Bold'>Schedule</ThemedText>
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
                onPress={() => router.navigate(`/(app)/(patient)/(tabs)/(schedule)/${item}`)}
                style={{
                  flex: 1,
                  height: 50,
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
        <Stack.Screen name='upcoming' />
        <Stack.Screen name='completed' />
        <Stack.Screen name='canceled' />
      </Stack>
    </PaperProvider>
  )
}