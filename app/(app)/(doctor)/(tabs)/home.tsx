import { View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Appbar, PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Image } from 'expo-image'
import { accent, appDark, light } from '@/utils/colors'
import { ThemedText } from '@/components/ThemedText'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { router } from 'expo-router'
import { FlashList } from '@shopify/flash-list'
import { Appointment } from '@/store/types/doctor/appointments'
import { formatCustomDate } from '@/libraries/formatDate'
import HapticWrapper from '@/components/Harptic'
import { auth } from '@/utils/fb'
import { calculateAge } from '@/libraries/calculateAge'
import { getOrCreateChat } from '@/libraries/getOrCreateChat'
import LoadingScreen from '@/components/LoadingScreen'

export default function home () {
  const theme = useColorScheme()
  const { profile } = useSelector((state: RootState) => state.doctorProfile)
  const { appointments } = useSelector((state: RootState) => state.doctorAppointment)

  const [loading, setLoading] = useState(false)
  const [screenLoading, setScreenLoading] = useState(true)

  const startChatWithPatient = async (item: Appointment) => {
    try {
      const userId: any = auth.currentUser?.uid;

      setLoading(true)

      const chatRef = await getOrCreateChat(
        String(item?.patient?.uid),
        userId,
        item,
        profile,
        item.patient
      );

      setLoading(false)
      router.push({
        pathname: '/(app)/(doctor)/(chats)/[chatId]',
        params: { chatId: chatRef.id },
      });
    } catch (error) {
      console.error('Error starting chat:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (profile) {
      if (profile.isApplicationSubmited) {
        setScreenLoading(false);
      } else {
        router.push("/(app)/(doctor)/doctorApplication");
        setTimeout(() => setScreenLoading(false), 500);
      }
    }
  }, [profile]);

  if (screenLoading)
    return <LoadingScreen />


  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          backgroundColor: theme == 'dark' ? appDark : light
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
          <Image
            source={profile?.displayImage ? profile?.displayImage?.image : (profile?.profilePicture ? profile?.profilePicture : require('@/assets/images/imgs/johnDoe.png'))}
            placeholder={require('@/assets/images/imgs/johnDoe.png')}
            contentFit='cover'
            placeholderContentFit='cover'
            transition={500}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50
            }}
          />

          <View style={{ gap: 3, justifyContent: 'center' }}>
            <ThemedText type='subtitle' font='Poppins-Bold'>{profile?.name}</ThemedText>
            <ThemedText type='caption'>{profile?.specialization}</ThemedText>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.navigate('/(app)/(doctor)/notification')}
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            source={require('@/assets/images/icons/bell.png')}
            style={{
              width: 25,
              height: 25,
              tintColor: theme == 'dark' ? light : appDark
            }}
          />
        </TouchableOpacity>
      </Appbar.Header>

      <ThemedView style={{ flex: 1 }}>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: 50,
            borderColor: theme == 'dark' ? `${light}33` : `${appDark}33`,
            height: 50,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 20,
            paddingHorizontal: 20,
            margin: 20
          }}
        >
          <Image
            source={require('@/assets/images/icons/search.png')}
            style={{
              width: 20,
              height: 20,
              tintColor: theme == 'dark' ? light : appDark
            }}
          />

          <ThemedText type='body' font='Poppins-Light'>Search...</ThemedText>
        </TouchableOpacity>

        <FlashList
          data={appointments}
          keyExtractor={(item: any) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20
              }}
            >
              <ThemedText type='subtitle' font='Poppins-Bold'>Upcoming Appointments</ThemedText>

              <TouchableOpacity onPress={() => router.navigate('/(app)/(doctor)/(appointments)/upcoming')}>
                <ThemedText type='body' font='Poppins-Medium'>See All</ThemedText>
              </TouchableOpacity>
            </View>
          )}
          estimatedItemSize={20}
          contentContainerStyle={{
            padding: 20,
          }}


          renderItem={({ item }: { item: Appointment }) => {
            return (
              <ThemedView
                style={{
                  borderWidth: 1,
                  borderColor: theme == 'dark' ? `${light}33` : `${appDark}33`,
                  borderRadius: 20,
                  padding: 10
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: 20
                  }}
                >
                  <Image
                    source={item?.patient?.displayImage?.image}
                    placeholder={require('@/assets/images/images/avatar.png')}
                    contentFit='cover'
                    placeholderContentFit='cover'
                    transition={500}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50
                    }}
                  />

                  <View>
                    <ThemedText type='subtitle' font='Poppins-Bold'>{item?.patient?.name}</ThemedText>
                    <ThemedText type='body' font='Poppins-Regular'>{item?.appointment?.appointment?.reason}</ThemedText>
                    <ThemedText type='body' font='Poppins-Regular'>{calculateAge(item?.patient?.birth)}</ThemedText>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    gap: 20
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
                    <View style={{ flexDirection: 'row', gap: 5 }}>
                      <Image
                        source={require('@/assets/images/icons/calendar.png')}
                        style={{
                          width: 12,
                          height: 12,
                          tintColor: theme == 'dark' ? light : accent
                        }}
                      />

                      <ThemedText type='caption' font='Poppins-Light'>{formatCustomDate(item?.appointment?.selectedDate)}</ThemedText>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 5 }}>
                      <Image
                        source={require('@/assets/images/icons/clock.png')}
                        style={{
                          width: 12,
                          height: 12,
                          tintColor: theme == 'dark' ? light : accent
                        }}
                      />

                      <ThemedText type='caption' font='Poppins-Light'>{item?.appointment?.selectedTime?.time}</ThemedText>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <HapticWrapper
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 10,
                        backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Image
                        source={require('@/assets/images/icons/phone_fill.png')}
                        style={{
                          width: 20,
                          height: 20,
                          tintColor: theme == 'dark' ? light : accent
                        }}
                      />
                    </HapticWrapper>

                    <HapticWrapper
                      onPress={() => startChatWithPatient(item)}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 10,
                        backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      {
                        loading ? (
                          <ActivityIndicator
                            size={18}
                            color={theme == 'dark' ? light : accent}
                            style={{
                              width: 20,
                              height: 20
                            }}
                          />
                        ) :
                          (
                            <Image
                              source={require('@/assets/images/icons/chat_alt_fill.png')}
                              style={{
                                width: 20,
                                height: 20,
                                tintColor: theme == 'dark' ? light : accent
                              }}
                            />
                          )
                      }
                    </HapticWrapper>
                  </View>
                </View>
              </ThemedView>
            )
          }}
        />
      </ThemedView>
    </PaperProvider>
  )
}