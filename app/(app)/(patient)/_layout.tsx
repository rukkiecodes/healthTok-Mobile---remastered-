import React, { useEffect, useLayoutEffect } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Stack } from 'expo-router'
import { appDark, light } from '@/utils/colors'
import { useDispatch } from 'react-redux'
import { fetchPatientProfile } from '@/store/actions/patient/profile'
import { fetchQuickResponseDoctors } from '@/store/actions/patient/quickResponseDoctors'
import { fetchDoctors } from '@/store/actions/patient/doctors'
import { fetchBlogs } from '@/store/actions/patient/blogs'
import { auth, db } from '@/utils/fb'
import { getUserCoordinates } from '@/libraries/getUserCoordinated'
import { updateUser } from '@/libraries/updateUserDocument'
import { fetchAppointments } from '@/store/actions/patient/appointments'
import { fetchCanceledAppointments } from '@/store/actions/patient/canceled_appointments'
import { fetchCompletedAppointments } from '@/store/actions/patient/completed_appointments'

export default function _layout () {
  const theme = useColorScheme()
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    (async () => {
      const coords = await getUserCoordinates()
      await updateUser('patient', { coords: coords })
    })()
  }, [auth, db])

  useEffect(() => {
    const unsubscribes = [
      dispatch(fetchPatientProfile()),
      dispatch(fetchDoctors()),
      dispatch(fetchQuickResponseDoctors()),
      dispatch(fetchBlogs()),
      dispatch(fetchAppointments()),
      dispatch(fetchCanceledAppointments()),
      dispatch(fetchCompletedAppointments())
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