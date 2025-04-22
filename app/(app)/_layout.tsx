import React, { useEffect } from 'react'
import { Slot, Stack } from 'expo-router'
import { useDispatch } from 'react-redux';
import { fetchProfile } from '@/store/actions/fetchProfileAction';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { appDark, light } from '@/utils/colors';
import { auth } from '@/utils/fb';

const AppLayout = () => {
  const theme = useColorScheme()
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = dispatch(fetchProfile());

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

export default AppLayout