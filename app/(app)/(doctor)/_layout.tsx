import React, { useEffect, useLayoutEffect } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Stack } from 'expo-router'
import { appDark, light } from '@/utils/colors'
import { useDispatch } from 'react-redux'
import { fetchAppointments } from '@/store/actions/doctor/appointments'
import { fetchDoctorsProfile } from '@/store/actions/doctor/profile'
import { getUserCoordinates } from '@/libraries/getUserCoordinated'
import { updateUser } from '@/libraries/updateUserDocument'
import { auth, db } from '@/utils/fb'
import { fetchCanceledAppointments } from '@/store/actions/doctor/canceled_appointments'
import { fetchCompletedAppointments } from '@/store/actions/doctor/completed_appointments'

export default function _layout () {
  const theme = useColorScheme()
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    (async () => {
      const coords = await getUserCoordinates()
      await updateUser('doctors', { coords: coords })
    })()
  }, [auth, db])

  useEffect(() => {
    const unsubscribes = [
      dispatch(fetchDoctorsProfile()),
      dispatch(fetchAppointments()),
      dispatch(fetchCanceledAppointments()),
      dispatch(fetchCompletedAppointments()),
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