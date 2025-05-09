import React, { useEffect } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Stack } from 'expo-router'
import { appDark, light } from '@/utils/colors'
import { useDispatch } from 'react-redux'
import { fetchAppointments } from '@/store/actions/doctor/appointments'
import { fetchDoctorsProfile } from '@/store/actions/doctor/profile'

export default function _layout () {
  const theme = useColorScheme()
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribes = [
      dispatch(fetchDoctorsProfile()),
      dispatch(fetchAppointments()),
    ];

    return () => {
      unsubscribes.forEach(unsub => {
        if (typeof unsub === 'function') unsub();
      });
    };
  }, [dispatch]);


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