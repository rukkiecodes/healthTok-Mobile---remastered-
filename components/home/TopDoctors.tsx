import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { ThemedText } from '../ThemedText'
import { accent, black, green, light } from '@/utils/colors'
import { Image } from 'expo-image'
import { ThemedView } from '../ThemedView'
import { useColorScheme } from '@/hooks/useColorScheme'
import { router } from 'expo-router'

export function TopDoctors () {
  const theme = useColorScheme()

  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <ThemedText type='subtitle' font='Poppins-Bold'>Top Doctor</ThemedText>
        <TouchableOpacity
          onPress={() => router.push({
            pathname: '/(app)/(topDoctors)/doctor',
            params: { item: 'All' }
          })}
        >
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
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 20
          }}
        >
          <Image
            source={require('@/assets/images/images/avatar.png')}
            contentFit='contain'
            style={{
              width: 120,
              height: 120
            }}
          />

          <View
            style={{
              flex: 1,
              height: 100
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 20
              }}
            >
              <View>
                <ThemedText type='subtitle' font='Poppins-Bold'>Dr Majeed S.</ThemedText>
                <ThemedText type='body' font='Poppins-Regular'>Gynaecologist</ThemedText>
              </View>

              <View
                style={{
                  width: 15,
                  height: 15,
                  backgroundColor: green,
                  borderRadius: 50,
                  marginTop: 10
                }}
              />
            </View>

            <ThemedView
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 20
              }}
            >
              <ThemedView
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  backgroundColor: `${accent}20`,
                  alignSelf: 'flex-start',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                  gap: 5
                }}
              >
                <Image
                  source={require('@/assets/images/icons/star.png')}
                  contentFit='contain'
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: theme == 'dark' ? light : accent
                  }}
                />

                <ThemedText style={{ marginTop: 5 }}>4,7</ThemedText>
              </ThemedView>

              <ThemedView
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  borderRadius: 10,
                  paddingVertical: 5,
                  gap: 5
                }}
              >
                <Image
                  source={require('@/assets/images/icons/location_marker.png')}
                  contentFit='contain'
                  style={{
                    width: 20,
                    height: 20
                  }}
                />

                <ThemedText style={{ marginTop: 5 }}>300m away</ThemedText>
              </ThemedView>
            </ThemedView>
          </View>
        </ThemedView>
      </View>
    </View>
  )
}