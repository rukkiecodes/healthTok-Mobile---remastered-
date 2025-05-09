import React, { useEffect } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Stack } from 'expo-router'
import { appDark, light } from '@/utils/colors'
import { useDispatch } from 'react-redux'
import { fetchPatientProfile } from '@/store/actions/patient/profile'
import { fetchQuickResponseDoctors } from '@/store/actions/patient/quickResponseDoctors'
import { fetchDoctors } from '@/store/actions/patient/doctors'
import { fetchBlogs } from '@/store/actions/patient/blogs'

export default function _layout () {
  const theme = useColorScheme()
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribes = [
      dispatch(fetchPatientProfile()),
      dispatch(fetchQuickResponseDoctors()),
      dispatch(fetchDoctors()),
      dispatch(fetchBlogs())
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