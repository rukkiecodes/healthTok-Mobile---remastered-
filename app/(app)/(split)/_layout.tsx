import React, { useEffect, useState } from 'react'
import { Redirect, Slot } from 'expo-router'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { ThemedView } from '@/components/ThemedView'
import { ActivityIndicator } from 'react-native-paper'
import { accent } from '@/utils/colors'

export default function _layout () {
  const { profile } = useSelector((state: RootState) => state.profile)
  const [redirectPath, setRedirectPath] = useState<string | any>(null)

  useEffect(() => {
    if (profile?.accountType === 'patient') {
      setRedirectPath('/(app)/(patient)/(tabs)/home')
    } else if (profile?.accountType === 'doctor') {
      setRedirectPath('/(app)/(doctor)/home')
    }
  }, [profile])

  if (redirectPath) {
    return <Redirect href={redirectPath} />
  }

  if (!profile) {
    return (
      <ThemedView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator size={20} color={accent} />
      </ThemedView>
    )
  }

  return <Slot />
}