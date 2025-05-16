import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { ThemedText } from '../ThemedText'
import { accent, appDark, black, green, light } from '@/utils/colors'
import { Image } from 'expo-image'
import { ThemedView } from '../ThemedView'
import { useColorScheme } from '@/hooks/useColorScheme'
import { router } from 'expo-router'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/types/types'
import { Doctor } from '@/store/types/patient/doctor'
import { getDistanceFromLatLonInKm } from '@/libraries/distance'
import Rating from './Rating'

export function TopDoctors () {
  const theme = useColorScheme()

  const { doctors } = useSelector((state: RootState) => state.doctors)
  const { profile } = useSelector((state: RootState) => state.patientProfile)

  const topDoctors = doctors.slice(0, 5)

  return (
    <View style={{ paddingHorizontal: 20, display: topDoctors?.length ? 'flex' : 'none' }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <ThemedText type='subtitle' font='Poppins-Bold'>Top Doctors</ThemedText>
        <TouchableOpacity
          onPress={() => router.push({
            pathname: '/(app)/(patient)/(topDoctors)/doctor',
            params: { item: 'All' }
          })}
        >
          <ThemedText type='body' font='Poppins-Bold' lightColor={accent}>See all</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={{ gap: 20, marginTop: 20 }}>
        {
          topDoctors?.map((item: Doctor, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  router.push({
                    pathname: '/(app)/(patient)/(profiles)/doctorProfile',
                    params: { doctorUID: item?.uid }
                  })
                }}
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
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 20
                }}
              >
                <View
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 100,
                    overflow: 'hidden'
                  }}
                >
                  <Image
                    source={item?.displayImage ? item?.displayImage?.image : item?.profilePicture}
                    placeholder={require('@/assets/images/images/avatar.png')}
                    contentFit='cover'
                    placeholderContentFit='cover'
                    style={{ width: 120, height: 120 }}
                  />
                </View>

                <View style={{ flex: 1, height: 100 }}>
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
                      <ThemedText type='subtitle' font='Poppins-Bold'>{item?.name}</ThemedText>
                      <ThemedText type='body' font='Poppins-Medium'>{item?.specialization}</ThemedText>
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
                        backgroundColor: theme == 'dark' ? `${light}33` : `${accent}20`,
                        alignSelf: 'flex-start',
                        paddingHorizontal: 10,
                        paddingVertical: 3,
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

                      <Rating item={item} />
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
                          height: 20,
                          tintColor: theme == 'dark' ? light : appDark
                        }}
                      />

                      <ThemedText style={{ marginTop: 5 }}>{getDistanceFromLatLonInKm(Number(profile?.coords?.latitude), Number(profile?.coords?.longitude), Number(item?.coords?.latitude), Number(item?.coords?.longitude)).toFixed(1)}km away</ThemedText>
                    </ThemedView>
                  </ThemedView>
                </View>
              </TouchableOpacity>
            )
          })
        }
      </View>
    </View>
  )
}