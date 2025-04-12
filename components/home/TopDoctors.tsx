import { View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedText } from '../ThemedText'
import { accent, appDark, black, green, light } from '@/utils/colors'
import { Image } from 'expo-image'
import { ThemedView } from '../ThemedView'
import { useColorScheme } from '@/hooks/useColorScheme'
import { router } from 'expo-router'
import { db } from '@/utils/fb'
import { collection, doc, getDocs, limit, orderBy, query, where } from 'firebase/firestore'

export function TopDoctors () {
  const theme = useColorScheme()

  const [topDoctors, setTopDoctors] = useState<object[] | null>(null)

  const fetchTopDoctors = async () => {
    try {
      const q = query(collection(db, "users"), where('accountType', '==', 'doctor'), orderBy('createdAt', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);

      setTopDoctors(querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { fetchTopDoctors() }, [db])

  return (
    <View style={{ paddingHorizontal: 20 }}>
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
            pathname: '/(app)/(topDoctors)/doctor',
            params: { item: 'All' }
          })}
        >
          <ThemedText type='body' font='Poppins-Bold' lightColor={accent}>See all</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={{ gap: 20, marginTop: 20 }}>
        {
          topDoctors?.map((item: any, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  router.push({
                    pathname: '/(app)/(profiles)/doctorProfile',
                    params: { doctorUID: item.uid }
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
                    borderRadius: '50%',
                    overflow: 'hidden'
                  }}
                >
                  <Image
                    source={item?.displayImage ? item?.displayImage?.image : item?.profilePicture}
                    placeholder={require('@/assets/images/images/avatar.png')}
                    placeholderContentFit='cover'
                    contentFit='contain'
                    style={{ width: 120, height: 120 }}
                  />
                </View>

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
                          height: 20,
                          tintColor: theme == 'dark' ? light : appDark
                        }}
                      />

                      <ThemedText style={{ marginTop: 5 }}>300m away</ThemedText>
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