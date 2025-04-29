import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { RootState } from '@/store/store';
import { accent } from '@/utils/colors';
import { db } from '@/utils/fb';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';

export default function index () {
  const { profile } = useSelector((state: RootState) => state.profile)
  const [loading, setLoading] = useState(true);
  const [activeRoute, setActiveRoute] = useState('');

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = () => {
      try {
        if (isMounted) {
          if (profile) {
            if (profile?.accountType === 'patient') setActiveRoute('patient')
            else setActiveRoute('doctor')
          } else {
          }
          setLoading(false);
        }
      } catch (error) {
        console.log(error)
      }
    }

    initializeAuth()

    return () => {
      isMounted = false
    }
  }, [profile, db])

  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={accent} />
        <ThemedText font="Poppins-Regular">Loading...</ThemedText>
      </ThemedView>
    );
  }

  if (!activeRoute) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={accent} />
        <ThemedText font="Poppins-Regular">Loading...</ThemedText>
      </ThemedView>
    )
  } else {
    if (activeRoute == 'patient') {
      return <Redirect href='/(app)/(split)/(patient)/(tabs)/home' />;
    } else {
      return <Redirect href='/(app)/(split)/(doctor)/(tabs)/home' />;
    }
  }
}