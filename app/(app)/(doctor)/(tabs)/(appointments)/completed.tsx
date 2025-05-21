import { View } from 'react-native'
import React from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Appointment } from '@/store/types/doctor/appointments'
import { ThemedView } from '@/components/ThemedView'
import { accent, appDark, light } from '@/utils/colors'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { formatCustomDate } from '@/libraries/formatDate'
import { FlashList } from '@shopify/flash-list'
import { calculateAge } from '@/libraries/calculateAge'

export default function completed() {
  const theme = useColorScheme()
  const { appointments } = useSelector((state: RootState) => state.doctorCompletedAppointments)

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
            gap: 20,
            marginTop: 20
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
        </View>
      </ThemedView>
    )
  }


  return <FlashList
    data={appointments}
    renderItem={renderItem}
    keyExtractor={(item: any) => item.id}
    showsVerticalScrollIndicator={false}
    estimatedItemSize={20}
    ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
    contentContainerStyle={{
      padding: 20
    }}
  />
}