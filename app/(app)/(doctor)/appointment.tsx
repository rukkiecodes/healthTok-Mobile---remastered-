import { View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Appbar, PaperProvider } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, appDark, light, teal } from '@/utils/colors'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { auth, db } from '@/utils/fb'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { ThemedView } from '@/components/ThemedView'
import { FlashList } from '@shopify/flash-list'
import { Appointment } from '@/store/types/doctor/appointments'
import { calculateAge } from '@/libraries/calculateAge'
import { formatCustomDate } from '@/libraries/formatDate'

export default function appointment () {
  const theme = useColorScheme()

  const [appointments, setAppointments] = useState<any[]>([])

  const fetchAppointments = async () => {
    const q = query(collection(db, "doctors", String(auth.currentUser?.uid), "concluded_appointments"), orderBy("concludedAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setAppointments(
        querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      )
    });

    return unsubscribe
  }

  useEffect(() => {
    fetchAppointments()
  }, [db])

  const renderItem = ({ item }: { item: Appointment }) => {
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
              width: 40,
              height: 40,
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
            <View
              style={{
                paddingHorizontal: 20,
                height: 40,
                borderRadius: 10,
                backgroundColor: teal,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ThemedText type='body' font='Poppins-Bold'>Done</ThemedText>
            </View>

            <View
              style={{
                paddingHorizontal: 20,
                height: 40,
                borderRadius: 10,
                backgroundColor: accent,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ThemedText type='body' font='Poppins-Bold'>Paid</ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>
    )
  }

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          paddingHorizontal: 20,
          backgroundColor: theme == 'dark' ? appDark : light,
          justifyContent: 'space-between'
        }}
      >
        <TouchableOpacity
          onPress={router.back}
          style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            source={require('@/assets/images/icons/arrow_left.png')}
            contentFit='contain'
            style={{
              width: 20,
              height: 20,
              tintColor: theme == 'dark' ? light : appDark
            }}
          />
        </TouchableOpacity>

        <ThemedText type='subtitle'>Appointments</ThemedText>

        <View style={{ width: 40 }} />
      </Appbar.Header>

      <ThemedView style={{ flex: 1, padding: 20 }}>
        <FlashList
          data={appointments}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={20}
        />
      </ThemedView>
    </PaperProvider>
  )
}