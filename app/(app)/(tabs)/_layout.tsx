import React from 'react'
import { router, Tabs } from 'expo-router'
import { Appbar, PaperProvider } from 'react-native-paper'
import { Easing, TouchableOpacity, View } from 'react-native'
import { useColorScheme } from '@/hooks/useColorScheme'
import { accent, appDark, dark, light, offWhite } from '@/utils/colors'
import { Image } from 'expo-image'
import { useDrawer } from '@/context/DrawerContext'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useSelector } from 'react-redux'
import { RootState } from '@/utils/store'

const MainAppTabsLayout = () => {
  const colorScheme = useColorScheme();
  const { openDrawer } = useDrawer();
  const { profile } = useSelector((state: RootState) => state.user)

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
          tabBarLabel: ({ color }) => <ThemedText style={{ display: 'none' }}></ThemedText>
        }}
      />

      <Tabs.Screen
        name='conversations'
        options={{
          title: '',
          tabBarIcon: ({ focused, color }) =>
            <Image
              source={focused ? require('@/assets/images/icons/messageFilled.png') : require('@/assets/images/icons/message.png')}
              tintColor={color}
              contentFit='contain'
              style={{
                width: 30,
                height: 30
              }}
            />,
          tabBarLabel: ({ color }) => <ThemedText style={{ display: 'none' }}></ThemedText>
        }}
      />

      <Tabs.Screen
        name='schedule'
        options={{
          title: '',
          tabBarIcon: ({ focused, color }) =>
            <Image
              source={focused ? require('@/assets/images/icons/calendarFilled.png') : require('@/assets/images/icons/calendar.png')}
              tintColor={color}
              contentFit='contain'
              style={{
                width: 30,
                height: 30
              }}
            />,
          tabBarLabel: ({ color }) => <ThemedText style={{ display: 'none' }}></ThemedText>
        }}
      />
      
      <Tabs.Screen
        name='profile'
        options={{
          title: '',
          tabBarIcon: ({ focused, color }) =>
            <Image
              source={focused ? require('@/assets/images/icons/profileFilled.png') : require('@/assets/images/icons/profile.png')}
              tintColor={color}
              contentFit='contain'
              style={{
                width: 30,
                height: 30
              }}
            />,
          tabBarLabel: ({ color }) => <ThemedText style={{ display: 'none' }}></ThemedText>
        }}
      />
    </Tabs>
  )
}

export default MainAppTabsLayout