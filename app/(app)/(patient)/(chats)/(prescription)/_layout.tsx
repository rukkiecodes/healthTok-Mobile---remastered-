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

  const parsParams = () => JSON.parse(conversationData)

  const segments = useSegments();
  const activeTab = segments[segments.length - 1]

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          backgroundColor: theme == 'dark' ? appDark : light,
          paddingHorizontal: 20,
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
                pathname: '/(app)/(patient)/(chats)/[chatId]',
                params: { chatId: chatId, doctor: parsParams()?.doctor }
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
          <ThemedText type='subtitle' font='Poppins-Bold'>Medications</ThemedText>
        </View>
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
          onPress={() => {
            router.push({
              pathname: '/(app)/(patient)/(chats)/(prescription)/injectables',
              params: { chatId: String(chatId), conversationData: conversationData }
            })
          }}
          style={{
            flex: 1,
            height: 40,
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
          onPress={() => {
            router.push({
              pathname: '/(app)/(patient)/(chats)/(prescription)/orals',
              params: { chatId: String(chatId), conversationData: conversationData }
            })
          }}
          style={{
            flex: 1,
            height: 40,
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