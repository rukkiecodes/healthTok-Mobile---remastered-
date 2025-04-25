import React, { useEffect } from 'react'
import { Slot, Stack } from 'expo-router'
import { useDispatch } from 'react-redux';
import { fetchProfile } from '@/store/actions/fetchProfileAction';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { appDark, light } from '@/utils/colors';

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
    <Slot />
  )
}

export default AppLayout