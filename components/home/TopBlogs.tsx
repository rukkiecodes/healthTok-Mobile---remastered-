import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ThemedText } from '../ThemedText'
import { accent, black, light } from '@/utils/colors'
import { ThemedView } from '../ThemedView'
import { Image } from 'expo-image'
import { useColorScheme } from '@/hooks/useColorScheme'

export function TopBlogs() {
  const theme = useColorScheme()

  return (
    <View style={{ paddingHorizontal: 20, flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <ThemedText type='subtitle' font='Poppins-Bold'>Top Blogs</ThemedText>
        <TouchableOpacity>
          <ThemedText type='body' font='Poppins-Bold' lightColor={accent}>See all</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={{ gap: 20, marginTop: 20 }}>
        <ThemedView
          style={{
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
        </ThemedView>
      </View>
    </View>
  )
}