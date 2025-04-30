import React from 'react'
import { Stack } from 'expo-router'
import { useColorScheme } from '@/hooks/useColorScheme'
import { appDark, light } from '@/utils/colors'

const AuthLayout = () => {
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

export default AuthLayout