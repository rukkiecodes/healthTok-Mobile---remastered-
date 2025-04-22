import { Easing } from 'react-native'
import React from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Tabs } from 'expo-router';
import { accent, appDark, dark, light } from '@/utils/colors';
import { ThemedView } from '@/components/ThemedView';
import { Image } from 'expo-image';

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
            <Image
              source={focused ? require('@/assets/images/icons/homeFilled.png') : require('@/assets/images/icons/home.png')}
              tintColor={color}
              contentFit='contain'
              style={{
                width: 30,
                height: 30
              }}
            />,
          tabBarLabel: ({ color }) => null
        }}
      />
    </Tabs>
  )
}