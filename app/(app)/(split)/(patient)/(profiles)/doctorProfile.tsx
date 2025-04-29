import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { Appbar, Divider, PaperProvider } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, appDark, light, transparent } from '@/utils/colors'
import { router, useLocalSearchParams } from 'expo-router'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/utils/fb'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { setDoctorProfile, setSelectedDate, setSelectedTime } from '@/store/slices/appointmentSlice'

const { width } = Dimensions.get('window')



const INFO_CARDS = (width / 4) - 35
const DAYS_CARDS = (width / 7) - 15
const TIME_CARDS = (width / 3) - 30

export default function doctorProfile () {
  const theme = useColorScheme()
  const { doctorUID } = useLocalSearchParams()
  const dispatch = useDispatch()

  const { doctorProfile, selectedDate, selectedTime } = useSelector((state: RootState) => state.appointment)

  const fetchDoctorProfile = async () => {
    const profile: any = (await getDoc(doc(db, 'users', String(doctorUID)))).data()
    dispatch(setDoctorProfile(profile))
  }

  const getCurrentWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const diffToMonday = (currentDay + 6) % 7; // Shift so Monday is 0

    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);

    const weekDays = [];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);

      weekDays.push({
        dayName: dayNames[date.getDay()],
        day: date.getDate(),
        month: monthNames[date.getMonth()],
        year: date.getFullYear().toString(),
      });
    }

    return weekDays;
  };

  const getTimeSlots = () => {
    const startHour = 7;
    const endHour = 20;
    const excludeHours = [12, 17]; // 12PM and 5PM

    const slots = [];

    for (let hour = startHour; hour <= endHour; hour++) {
      if (excludeHours.includes(hour)) continue;

      const isPM = hour >= 12;
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const period = isPM ? 'PM' : 'AM';

      slots.push({
        time: `${displayHour}:00 ${period}`,
        active: true,
      });
    }

    return slots;
  };


  useEffect(() => {
    fetchDoctorProfile()
  }, [doctorUID])

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
            width: 50,
            height: 50,
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

        <ThemedText type='subtitle' font='Poppins-Bold'>Doctor’s Details</ThemedText>

        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0
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

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 20
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              borderRadius: 20,
              overflow: 'hidden'
            }}
          >
            <Image
              source={doctorProfile?.displayImage ? doctorProfile?.displayImage?.image : doctorProfile?.profilePicture}
              contentFit='contain'
              style={{ width: 150, height: 150 }}
            />
          </TouchableOpacity>

          <View>
            <ThemedText type='subtitle' font='Poppins-Bold'>{doctorProfile?.name}</ThemedText>
            <ThemedText type='body' font='Poppins-Regular'>{doctorProfile?.specialization}</ThemedText>

            <ThemedView
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`,
                alignSelf: 'flex-start',
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderRadius: 10,
                gap: 5,
                marginVertical: 10
              }}
            >
              <Image
                source={require('@/assets/images/icons/star.png')}
                contentFit='contain'
                style={{
                  width: 15,
                  height: 15,
                  tintColor: theme == 'dark' ? light : accent
                }}
              />

              <ThemedText type='caption' style={{ marginTop: 5 }}>4,7</ThemedText>
            </ThemedView>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 5
              }}
            >
              <Image
                source={require('@/assets/images/icons/location_marker.png')}
                contentFit='contain'
                style={{
                  width: 20,
                  height: 20,
                  marginBottom: 3,
                  tintColor: theme == 'dark' ? light : appDark
                }}
              />

              <ThemedText type='body' font='Poppins-Bold'>Benin City, Nigeria.</ThemedText>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 40
          }}
        >
          <View
            style={{
              width: INFO_CARDS,
              height: INFO_CARDS,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                width: INFO_CARDS - 30,
                height: INFO_CARDS - 30,
                backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <Image
                source={require('@/assets/images/icons/account_group_fill.png')}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: theme == 'dark' ? light : accent
                }}
              />
            </View>

            <ThemedText type='default' font='Poppins-Bold' lightColor={accent}>3.500+</ThemedText>
            <ThemedText type='body'>Patients</ThemedText>
          </View>


          <View
            style={{
              width: INFO_CARDS,
              height: INFO_CARDS,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                width: INFO_CARDS - 30,
                height: INFO_CARDS - 30,
                backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <Image
                source={require('@/assets/images/icons/mortarboard_fill.png')}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: theme == 'dark' ? light : accent
                }}
              />
            </View>

            <ThemedText type='default' font='Poppins-Bold' lightColor={accent}>10+</ThemedText>
            <ThemedText type='body'>Years Exp.</ThemedText>
          </View>


          <View
            style={{
              width: INFO_CARDS,
              height: INFO_CARDS,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                width: INFO_CARDS - 30,
                height: INFO_CARDS - 30,
                backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <Image
                source={require('@/assets/images/icons/phone_fill.png')}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: theme == 'dark' ? light : accent
                }}
              />
            </View>

            <ThemedText type='default' font='Poppins-Bold' lightColor={accent}>09097038888</ThemedText>
            <ThemedText type='body'>Call</ThemedText>
          </View>


          <View
            style={{
              width: INFO_CARDS,
              height: INFO_CARDS,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                width: INFO_CARDS - 30,
                height: INFO_CARDS - 30,
                backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <Image
                source={require('@/assets/images/icons/chat_alt_fill.png')}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: theme == 'dark' ? light : accent
                }}
              />
            </View>

            <ThemedText type='default' font='Poppins-Bold' lightColor={accent}>2,450</ThemedText>
            <ThemedText type='body'>Reviews</ThemedText>
          </View>
        </View>

        <View style={{ marginTop: 40, gap: 20 }}>
          <ThemedText type='subtitle' font='Poppins-Bold'>About</ThemedText>
          <ThemedText type='body' font='Poppins-Regular'>
            Graduated from the National University of Ireland in 1998 with Bachelor of Medicine and Bachelor of Surgery degrees. ... Obtained post-graduate qualification...
            <ThemedText lightColor={accent} type='body' font='Poppins-Bold'>Read more</ThemedText>
          </ThemedText>
        </View>

        <View style={{ marginTop: 40 }}>
          <ThemedText type='subtitle' font='Poppins-Bold'>Date</ThemedText>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {
              getCurrentWeekDays().map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => dispatch(setSelectedDate(item))}
                  style={{
                    width: DAYS_CARDS,
                    borderWidth: 1.5,
                    borderRadius: 20,
                    borderColor: item.day == selectedDate?.day ? transparent : (theme == 'dark' ? `${light}33` : `${accent}33`),
                    backgroundColor: item.day == selectedDate?.day ? accent : transparent,
                    paddingVertical: 15,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <ThemedText lightColor={item.day == selectedDate?.day ? light : appDark} type='body'>
                    {item.dayName}
                  </ThemedText>
                  <ThemedText lightColor={item.day == selectedDate?.day ? light : appDark} type='subtitle' font='Poppins-Bold'>
                    {item.day}
                  </ThemedText>
                </TouchableOpacity>
              ))
            }
          </View>
        </View>

        <Divider style={{ marginVertical: 40 }} />

        <View>
          <ThemedText type='subtitle' font='Poppins-Bold'>Working Hours</ThemedText>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 20
            }}
          >
            {
              getTimeSlots().map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => dispatch(setSelectedTime(item))}
                  disabled={!item.active}
                  style={{
                    width: TIME_CARDS,
                    height: 50,
                    borderWidth: 1.5,
                    borderRadius: 20,
                    borderColor: item.time == selectedTime?.time ? transparent : (theme == 'dark' ? `${light}33` : `${accent}33`),
                    backgroundColor: item.time == selectedTime?.time ? accent : transparent,
                    paddingVertical: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: item.active ? 1 : 0.5,
                  }}
                >
                  <ThemedText lightColor={item.time == selectedTime?.time ? light : appDark} type="default">
                    {item.time}
                  </ThemedText>
                </TouchableOpacity>
              ))
            }
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 20,
          gap: 20
        }}
      >
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`,
            borderRadius: 20
          }}
        >
          <Image
            source={require('@/assets/images/icons/chat.png')}
            style={{
              width: 25,
              height: 25,
              tintColor: theme == 'dark' ? light : accent
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/(app)/(split)/(patient)/(profiles)/appointment',
              params: { doctorUID }
            })
          }}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: accent,
            borderRadius: 20,
            height: 50
          }}
        >
          <ThemedText lightColor={light} font='Poppins-Bold' type='body'>Book Apointment</ThemedText>
        </TouchableOpacity>
      </View>
    </PaperProvider>
  )
}