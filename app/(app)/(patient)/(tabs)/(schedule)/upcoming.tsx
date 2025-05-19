import { Dimensions, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { accent, appDark, black, light, transparent } from '@/utils/colors'
import { ThemedText } from '@/components/ThemedText'
import { Divider, PaperProvider } from 'react-native-paper'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { formatCustomDate } from '@/libraries/formatDate'
import HapticWrapper from '@/components/Harptic'
import { addDoc, collection, deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/utils/fb'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { setSelectedDate, setSelectedTime } from '@/store/slices/appointmentSlice'
import { useNotification } from '@/context/notification'
const { width } = Dimensions.get('window')

const INFO_CARDS = (width / 4) - 35
const DAYS_CARDS = (width / 7) - 15
const TIME_CARDS = (width / 3) - 30

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function upcoming () {
  const theme = useColorScheme()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const dispatch = useDispatch()
  const { scheduleNotification } = useNotification()

  const { appointments } = useSelector((state: RootState) => state.patientAppointment)
  const { profile } = useSelector((state: RootState) => state.patientProfile)
  const { doctorProfile, selectedDate, selectedTime } = useSelector((state: RootState) => state.appointment)

  const [selectedAppointments, setSelectedAppointments] = useState<any>(null)

  const cancelAppointments = async (item: { [key: string]: any }) => {
    await setDoc(doc(db, 'patient', String(auth.currentUser?.uid), 'canceled_appointments', String(item?.id)), {
      ...item,
      canceledAt: serverTimestamp()
    })
    
    await setDoc(doc(db, 'doctors', String(item?.doctor?.uid), 'canceled_appointments', String(item?.id)), {
      ...item,
      canceledAt: serverTimestamp()
    })
    

    await deleteDoc(doc(db, 'patient', String(auth.currentUser?.uid), 'appointments', String(item?.id)))
    await deleteDoc(doc(db, 'doctors', String(item?.doctor?.uid), 'appointments', String(item?.id)))
    
    await addDoc(collection(db, 'doctors', String(item?.doctor?.uid), 'notifications'), {
      ...item,
      message: `Hello Dr. ${item?.doctor?.name}\nYour appointment with ${profile?.name} has ben canceled`,
      route: '/(app)/(doctor)/(tabs)/(appointments)/canceled',
      canceledAt: serverTimestamp()
    })

    await scheduleNotification(
      item?.doctor?.expoPushNotificationToken,
      `Hello Dr. ${item?.doctor?.name}`,
      `Your appointment with ${profile?.name} has ben canceled`,
      {
        type: 'booking',
        sound: 'cancel',
        route: '/(app)/(doctor)/(tabs)/(appointments)/canceled'
      }
    )
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

  const rescheduleAppointments = async () => {
    const newAppountment = {
      ...selectedAppointments,
      appointment: {
        ...selectedAppointments.appointment,
        selectedDate: selectedDate,
        selectedTime: selectedTime
      }
    }

    await updateDoc(doc(db, 'patient', String(auth.currentUser?.uid), 'appointments', String(selectedAppointments?.id)), {
      ...newAppountment,
      rescheduledAt: serverTimestamp()
    })

    await updateDoc(doc(db, 'doctors', String(selectedAppointments?.doctor?.id), 'appointments', String(selectedAppointments?.id)), {
      ...newAppountment,
      rescheduledAt: serverTimestamp()
    })

    bottomSheetRef.current?.close()
  }

  const renderBackdrop = useCallback((props: any) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close"
    />
  ), []);

  const RenderItem = ({ item }: any) => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: `${theme == 'dark' ? light : appDark}33`,
          borderRadius: 12,
          padding: 20,
          margin: 20
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <View>
            <ThemedText type='subtitle' font='Poppins-Bold'>{item?.doctor?.name}</ThemedText>
            <ThemedText type='body' font='Poppins-Medium' opacity={0.6}>{item?.doctor?.specialization}</ThemedText>
          </View>

          <Image
            source={item?.doctor?.displayImage ? item?.doctor?.displayImage?.image : item?.doctor?.profilePicture}
            placeholder={require('@/assets/images/images/avatar.png')}
            placeholderContentFit='cover'
            contentFit='contain'
            style={{ width: 50, height: 50, borderRadius: 50 }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 10,
            marginTop: 30
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 5
            }}
          >
            <Image
              source={require('@/assets/images/icons/calendar.png')}
              contentFit='contain'
              style={{
                width: 14,
                height: 14,
                tintColor: theme == 'dark' ? light : appDark,
                opacity: 0.8
              }}
            />

            <ThemedText type='caption' opacity={0.8} style={{ marginTop: 3 }}>{formatCustomDate(item?.appointment?.selectedDate)}</ThemedText>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 5
            }}
          >
            <Image
              source={require('@/assets/images/icons/clock.png')}
              contentFit='contain'
              style={{
                width: 14,
                height: 14,
                tintColor: theme == 'dark' ? light : appDark,
                opacity: 0.8
              }}
            />

            <ThemedText type='caption' opacity={0.8} style={{ marginTop: 3 }}>{item?.appointment?.selectedTime?.time}</ThemedText>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 20
          }}
        >
          <HapticWrapper
            onPress={() => cancelAppointments(item)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme == 'dark' ? black : `${accent}20`,
              height: 50,
              borderRadius: 12,
              flex: 1,
            }}
          >
            <ThemedText type='body' font='Poppins-Bold'>Cancel</ThemedText>
          </HapticWrapper>

          <HapticWrapper
            onPress={() => {
              setSelectedAppointments(item)
              bottomSheetRef.current?.expand()
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: accent,
              height: 50,
              borderRadius: 12,
              flex: 1,
            }}
          >
            <ThemedText type='body' font='Poppins-Bold' lightColor={light}>Reschedule</ThemedText>
          </HapticWrapper>
        </View>
      </View>
    )
  }

  return (
    <PaperProvider>
      <FlashList
        data={appointments}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        estimatedItemSize={75}
        renderItem={({ item }) => <RenderItem item={item} />}
      />

      <BottomSheet
        index={-1}
        ref={bottomSheetRef}
        snapPoints={[500]}
        enablePanDownToClose
        enableOverDrag
        enableDynamicSizing={false}
        animateOnMount
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView style={{ padding: 20 }}>
          <View style={{ flex: 1 }}>
            <ThemedText type='subtitle' font='Poppins-Bold' darkColor={appDark}>Date</ThemedText>

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
                    style={{
                      width: DAYS_CARDS,
                      borderWidth: 1.5,
                      borderRadius: 20,
                      borderColor: item.day == selectedDate?.day ? transparent : (item.isToday ? accent : `${appDark}33`),
                      backgroundColor: item.day == selectedDate?.day ? accent : transparent,
                      paddingVertical: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: item.expired ? 0.2 : 1
                    }}
                  >
                    <ThemedText
                      lightColor={item.day == selectedDate?.day ? light : appDark}
                      darkColor={item.day == selectedDate?.day ? light : appDark}
                      type='caption'
                      font='Poppins-Medium'
                    >
                      {item.dayName}
                    </ThemedText>
                    <ThemedText
                      lightColor={item.day == selectedDate?.day ? light : appDark}
                      darkColor={item.day == selectedDate?.day ? light : appDark}
                      type='default'
                      font='Poppins-Bold'
                    >
                      {item.day}
                    </ThemedText>
                  </TouchableOpacity>
                ))
              }

              {selectedDate && (
                <>
                  <Divider style={{ marginVertical: 40 }} />


                  <View>
                    <ThemedText type='subtitle' font='Poppins-Bold' darkColor={appDark}>Working Hours</ThemedText>

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
                          <ThemedText
                            lightColor={item.time == selectedTime?.time ? light : appDark}
                            darkColor={item.time == selectedTime?.time ? light : appDark}
                            type="body"
                          >
                            {item.time}
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>

          <HapticWrapper
            onPress={rescheduleAppointments}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: accent,
              height: 50,
              borderRadius: 12,
              flex: 1,
              marginVertical: 40
            }}
          >
            <ThemedText type='body' font='Poppins-Bold' lightColor={light}>Reschedule</ThemedText>
          </HapticWrapper>
        </BottomSheetScrollView>
      </BottomSheet>
    </PaperProvider>
  )
}