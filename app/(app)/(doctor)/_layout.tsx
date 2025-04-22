import React from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Stack } from 'expo-router'
import { appDark, light } from '@/utils/colors'

export default function _layout () {
  const theme = useColorScheme()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade_from_bottom',
        contentStyle: {
          backgroundColor: theme == 'dark' ? appDark : light
        }
      }}
    />
  )
}