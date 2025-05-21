import React from 'react'
import { router, Stack, useLocalSearchParams, useSegments } from 'expo-router'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, appDark, light, transparent } from '@/utils/colors'
import { Appbar, PaperProvider } from 'react-native-paper'
import { TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import HapticWrapper from '@/components/Harptic'

export default function _layout () {
  const theme = useColorScheme()
  const { chatId, conversationData } = useLocalSearchParams<{ chatId: string; conversationData: string }>()

  const segments = useSegments();
  const activeTab = segments[segments.length - 1]

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          backgroundColor: theme == 'dark' ? appDark : light,
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 20
          }}
        >
          <TouchableOpacity
            onPress={() => {
              router.dismissTo({
                pathname: '/(app)/(doctor)/(chats)/[chatId]',
                params: { chatId: chatId }
              })
            }}
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('@/assets/images/icons/arrow_left.png')}
              style={{
                width: 25,
                height: 25,
                tintColor: theme == 'dark' ? light : appDark
              }}
            />
          </TouchableOpacity>
          <ThemedText type='subtitle' font='Poppins-Bold'>Presriptions</ThemedText>
        </View>

        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/(app)/(doctor)/(chats)/addPresriptions',
              params: { chatId: chatId, conversationData: conversationData }
            })
          }}
          style={{
            paddingHorizontal: 20,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ThemedText lightColor={accent} type='default' font='Poppins-Medium'>Add</ThemedText>
        </TouchableOpacity>
      </Appbar.Header>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 12,
          overflow: 'hidden',
          marginHorizontal: 20,
          backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`,
        }}
      >
        <HapticWrapper
          height={40}
          onPress={() => {
            router.push({
              pathname: '/(app)/(doctor)/(chats)/(prescription)/sent',
              params: { chatId: String(chatId), conversationData: conversationData }
            })
          }}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            backgroundColor: activeTab == 'sent' ? (theme == 'dark' ? light : accent) : transparent
          }}
        >
          <ThemedText
            type='default'
            font={activeTab == 'sent' ? 'Poppins-Bold' : 'Poppins-Medium'}
            lightColor={activeTab == 'sent' ? light : appDark}
            darkColor={activeTab == 'sent' ? appDark : light}
          >
            Sent
          </ThemedText>
        </HapticWrapper>

        <HapticWrapper
          height={40}
          onPress={() => {
            router.push({
              pathname: '/(app)/(doctor)/(chats)/(prescription)/injectables',
              params: { chatId: String(chatId), conversationData: conversationData }
            })
          }}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            backgroundColor: activeTab == 'injectables' ? (theme == 'dark' ? light : accent) : transparent
          }}
        >
          <ThemedText
            type='default'
            font={activeTab == 'injectables' ? 'Poppins-Bold' : 'Poppins-Medium'}
            lightColor={activeTab == 'injectables' ? light : appDark}
            darkColor={activeTab == 'injectables' ? appDark : light}
          >
            Injectables
          </ThemedText>
        </HapticWrapper>

        <HapticWrapper
          height={40}
          onPress={() => {
            router.push({
              pathname: '/(app)/(doctor)/(chats)/(prescription)/orals',
              params: { chatId: String(chatId), conversationData: conversationData }
            })
          }}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
            backgroundColor: activeTab == 'orals' ? (theme == 'dark' ? light : accent) : transparent
          }}
        >
          <ThemedText
            type='default'
            font={activeTab == 'orals' ? 'Poppins-Bold' : 'Poppins-Medium'}
            lightColor={activeTab == 'orals' ? light : appDark}
            darkColor={activeTab == 'orals' ? appDark : light}
          >
            Orals
          </ThemedText>
        </HapticWrapper>
      </View>

      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          contentStyle: {
            backgroundColor: theme == 'dark' ? appDark : light
          }
        }}
      />
    </PaperProvider>
  )
}