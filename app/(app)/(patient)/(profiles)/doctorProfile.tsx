import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Appbar, Divider, PaperProvider } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, amber, appDark, light, transparent } from '@/utils/colors'
import { router, useLocalSearchParams } from 'expo-router'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { auth, db } from '@/utils/fb'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { setDoctorProfile, setSelectedDate, setSelectedTime } from '@/store/slices/appointmentSlice'
import Rating from '@/components/home/Rating'
import Address from '@/components/profile/Address'
import CountPatients from '@/components/profile/CountPatients'
import CountReviews from '@/components/profile/CountReviews'
import HapticWrapper from '@/components/Harptic'
import { getOrCreateChat } from '@/libraries/getOrCreateChat'

const { width } = Dimensions.get('window')


const INFO_CARDS = (width / 4) - 35
const DAYS_CARDS = (width / 7) - 15
const TIME_CARDS = (width / 3) - 30

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function doctorProfile () {
  const theme = useColorScheme()
  const { doctorUID } = useLocalSearchParams()
  const dispatch = useDispatch()

  const { doctorProfile, selectedDate, selectedTime } = useSelector((state: RootState) => state.appointment)
  const { profile } = useSelector((state: RootState) => state.patientProfile)

  const [loadBookingButton, setLoadBookingButton] = useState(true)
  const [appointmentId, setAppointmentId] = useState('')

  const fetchDoctorProfile = async () => {
    const profile: any = await getDoc(doc(db, 'doctors', String(doctorUID)))
    dispatch(setDoctorProfile({ id: profile?.id, ...profile.data() }))
  }

  const checkIfAlreadyBooked = async () => {
    try {
      const q = query(collection(db, 'patient', String(auth.currentUser?.uid), 'appointments'), where('doctor.id', "==", doctorUID))
      const snapshot = await getDocs(q)
      setAppointmentId(snapshot.docs[0]?.id)

      setLoadBookingButton(snapshot.docs.length > 0 ? true : false)
    } catch (error) {
      console.log(error)
    }
  }

  const getRemainingMonthDays = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const year = today.getFullYear();
    const month = today.getMonth();

    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const days = [];

    for (let day = today.getDate(); day <= lastDayOfMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);

      const isToday = date.getTime() === today.getTime();
      const expired = date < today;

      days.push({
        dayName: dayNames[date.getDay()],
        day: date.getDate(),
        month: monthNames[month],
        year: year.toString(),
        expired,
        isToday,
      });
    }

    return days;
  };



  const getTimeSlots = (selectedDate: Date) => {
    const startHour = 7;
    const endHour = 20;
    const excludeHours = [12, 17]; // 12PM and 5PM

    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();

    const slots = [];

    for (let hour = startHour; hour <= endHour; hour++) {
      if (excludeHours.includes(hour)) continue;

      const isPM = hour >= 12;
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const period = isPM ? 'PM' : 'AM';

      const slotTime = new Date(selectedDate);
      slotTime.setHours(hour, 0, 0, 0);

      const isPast = isToday && slotTime < now;

      slots.push({
        time: `${displayHour}:00 ${period}`,
        active: !isPast,
      });
    }

    return slots;
  };

  const startChatWithDoctor = async () => {
    try {
      const userId: any = auth.currentUser?.uid;

      const q = query(collection(db, 'patient', String(auth.currentUser?.uid), 'appointments'), where('doctor.id', "==", doctorUID))
      const snapshot = await getDocs(q)

      const chatRef = await getOrCreateChat(
        userId,
        String(doctorProfile?.id),
        snapshot.docs[0].data(),
        doctorProfile,
        profile,
        appointmentId
      );

      router.push({
        pathname: '/(app)/(patient)/(chats)/[chatId]',
        params: { chatId: chatRef.id },
      });
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  }





  useEffect(() => {
    fetchDoctorProfile()
    checkIfAlreadyBooked()
  }, [doctorUID])

  if (!doctorProfile) {
    return (
      <ThemedView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator color={theme == 'dark' ? light : accent} />
      </ThemedView>
    )
  }

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
              width: 20,
              height: 20,
            }}
          />
        </TouchableOpacity>

        <ThemedText type='subtitle' font='Poppins-Bold'>Doctor’s Details</ThemedText>

        <View style={{ width: 50 }} />
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
              placeholder={require('@/assets/images/images/avatar.png')}
              placeholderContentFit='cover'
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

              {doctorProfile && <Rating item={doctorProfile} />}
            </ThemedView>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 5,
                maxWidth: 300
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

              <Address item={doctorProfile} />
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

            <CountPatients item={doctorProfile} />
            <ThemedText type='caption'>Patients</ThemedText>
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

            <ThemedText type='body' font='Poppins-Bold' lightColor={accent}>10+</ThemedText>
            <ThemedText type='caption'>Years Exp.</ThemedText>
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

            <ThemedText type='body' font='Poppins-Bold' lightColor={accent}>{doctorProfile?.phone}</ThemedText>
            <ThemedText type='caption'>Call</ThemedText>
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

            <CountReviews item={doctorProfile} />
            <ThemedText type='caption'>Reviews</ThemedText>
          </View>
        </View>

        {
          doctorProfile?.about &&
          <View style={{ marginTop: 40, gap: 20 }}>
            <ThemedText type='subtitle' font='Poppins-Bold'>About</ThemedText>
            <ThemedText type='body' font='Poppins-Regular'>{doctorProfile?.about}</ThemedText>
          </View>
        }

        <View style={{ marginTop: 40 }}>
          <ThemedText type='subtitle' font='Poppins-Bold'>Date</ThemedText>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 10,
              flexWrap: 'wrap'
            }}
          >
            {
              getRemainingMonthDays().map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => dispatch(setSelectedDate(item))}
                  disabled={loadBookingButton}
                  style={{
                    width: DAYS_CARDS,
                    borderWidth: 1.5,
                    borderRadius: 20,
                    borderColor: item.day == selectedDate?.day ? transparent : (item.isToday ? (theme == 'dark' ? amber : accent) : `${theme == 'dark' ? light : appDark}33`),
                    backgroundColor: item.day == selectedDate?.day ? accent : transparent,
                    paddingVertical: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: item.expired ? 0.2 : 1
                  }}
                >
                  <ThemedText lightColor={item.day == selectedDate?.day ? light : appDark} type='caption' font='Poppins-Medium'>
                    {item.dayName}
                  </ThemedText>
                  <ThemedText lightColor={item.day == selectedDate?.day ? light : appDark} type='default' font='Poppins-Bold'>
                    {item.day}
                  </ThemedText>
                </TouchableOpacity>
              ))
            }
          </View>
        </View>

        {selectedDate && (
          <>
            <Divider style={{ marginVertical: 40 }} />


            <View>
              <ThemedText type='subtitle' font='Poppins-Bold'>Working Hours</ThemedText>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 20,
                }}
              >
                {getTimeSlots(new Date(selectedDate.year, monthNames.indexOf(selectedDate.month), selectedDate.day)).map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => dispatch(setSelectedTime(item))}
                    disabled={!item.active || loadBookingButton}
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
                    <ThemedText lightColor={item.time == selectedTime?.time ? light : appDark} type="body">
                      {item.time}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
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
        {
          !loadBookingButton ?
            <HapticWrapper
              onPress={() => {
                router.push({
                  pathname: '/(app)/(patient)/(profiles)/appointment',
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
            </HapticWrapper> :
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                gap: 5
              }}
            >
              <ThemedText type='body' font='Poppins-Bold'>Already Booked</ThemedText>
              <ThemedText type='caption' font='Poppins-Medium' style={{ textAlign: 'center' }}>You have alredy book {doctorProfile?.name}. Please finish your already existing session before you can rebook</ThemedText>

              <HapticWrapper
                onPress={() => startChatWithDoctor()}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: accent,
                  borderRadius: 20,
                  height: 50,
                  marginTop: 10
                }}
              >
                <ThemedText lightColor={light} font='Poppins-Bold' type='body'>Chat Doctor</ThemedText>
              </HapticWrapper>
            </View>
        }
      </View>
    </PaperProvider>
  )
}