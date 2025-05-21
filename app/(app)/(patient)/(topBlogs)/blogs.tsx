import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Appbar, PaperProvider } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, appDark, black, light } from '@/utils/colors'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'

export default function blogs () {
  const theme = useColorScheme()

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme == 'dark' ? appDark : light,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('@/assets/images/icons/arrow_left.png')}
            style={{
              tintColor: theme == 'dark' ? light : appDark,
              width: 25,
              height: 25,
            }}
          />
        </TouchableOpacity>

        <ThemedText type='subtitle' font='Poppins-Bold'>Top Blogs</ThemedText>

        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('@/assets/images/icons/dots_vertical.png')}
            contentFit='contain'
            style={{
              tintColor: theme == 'dark' ? light : appDark,
              width: 20,
              height: 20,
            }}
          />
        </TouchableOpacity>
      </Appbar.Header>

      <ThemedView style={{ flex: 1, padding: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: theme == 'dark' ? appDark : light,
            shadowColor: black,
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,
            elevation: 10,
            padding: 20,
            borderRadius: 30,
            gap: 20
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 10
            }}
          >
            <Image
              source={require('@/assets/images/images/blog1.png')}
              style={{
                width: 150,
                height: 100,
                borderRadius: 20
              }}
            />

            <View style={{ flex: 1 }}>
              <ThemedText type='body' font='Poppins-Medium'>
                Individualized meal planning, weight control, blood glucose level, carbohydrate counting.
              </ThemedText>
            </View>

            <TouchableOpacity>
              <Image
                source={require('@/assets/images/icons/bookmark.png')}
                contentFit='contain'
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 20,
                  tintColor: theme == 'dark' ? light : accent
                }}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 40
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: 20
              }}
            >
              <ThemedText type='body' font='Poppins-Medium'>Feb 16, 2025</ThemedText>
              <ThemedText type='body' font='Poppins-Medium'>5min</ThemedText>
            </View>

            <ThemedText type='body' font='Poppins-Medium'>By Dr Steve</ThemedText>
          </View>
        </TouchableOpacity>
      </ThemedView>
    </PaperProvider>
  )
}