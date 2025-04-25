import React, { useEffect } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Stack } from 'expo-router'
import { appDark, light } from '@/utils/colors'
import { useDispatch } from 'react-redux'
import { fetchAppointments } from '@/store/actions/doctor/appointments'

export default function _layout () {
  const theme = useColorScheme()
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = dispatch(fetchAppointments());

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);


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