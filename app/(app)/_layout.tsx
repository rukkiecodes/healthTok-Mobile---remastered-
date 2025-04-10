import React, { useEffect } from 'react'
import { Stack } from 'expo-router'
import CustomDrawer from '@/components/CustomDrawer'
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
  }, [dispatch]);

  return (
    <CustomDrawer>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: {
            backgroundColor: theme == 'dark' ? appDark : light
          }
        }}
      />
    </CustomDrawer>
  )
}

export default AppLayout