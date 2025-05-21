import { Easing } from 'react-native'
import React from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Tabs } from 'expo-router';
import { accent, appDark, dark, light } from '@/utils/colors';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'expo-image';
import CustomImage from '@/components/CustomImage';

export default function _layout () {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: colorScheme == 'dark' ? `${light}80` : `${dark}80`,
        tabBarActiveTintColor: colorScheme == 'dark' ? light : accent,
        animation: 'fade',
        transitionSpec: {
          animation: 'timing',
          config: {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
          },
        },
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0
        },
        sceneStyle: {
          backgroundColor: colorScheme == 'dark' ? appDark : light
        },
        tabBarBackground: () => <ThemedView style={{ flex: 1 }} />,
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: '',
          tabBarIcon: ({ focused, color }) =>
            <CustomImage
              source={focused ? require('@/assets/images/icons/homeFilled.png') : require('@/assets/images/icons/home.png')}
              style={{ tintColor: color }}
              contentFit='contain'
              size={0.06}
            />,
          tabBarLabel: () => null
        }}
      />

      <Tabs.Screen
        name='(conversations)'
        options={{
          title: '',
          tabBarIcon: ({ focused, color }) =>
            <CustomImage
              source={focused ? require('@/assets/images/icons/messageFilled.png') : require('@/assets/images/icons/message.png')}
              style={{ tintColor: color }}
              contentFit='contain'
              size={0.06}
            />,
          tabBarLabel: () => null
        }}
      />

      <Tabs.Screen
        name='(appointments)'
        options={{
          title: '',
          tabBarIcon: ({ focused, color }) =>
            <CustomImage
              source={focused ? require('@/assets/images/icons/calendarFilled.png') : require('@/assets/images/icons/calendar.png')}
              style={{ tintColor: color }}
              contentFit='contain'
              size={0.06}
            />,
          tabBarLabel: () => null
        }}
      />

      <Tabs.Screen
        name='profile'
        options={{
          title: '',
          tabBarIcon: ({ focused, color }) =>
            <CustomImage
              source={focused ? require('@/assets/images/icons/profileFilled.png') : require('@/assets/images/icons/profile.png')}
              style={{ tintColor: color }}
              contentFit='contain'
              size={0.06}
            />,
          tabBarLabel: () => null
        }}
      />
    </Tabs>
  )
}