import { View } from 'react-native'
import React from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { appDark, light } from '@/utils/colors'
import { ThemedText } from '@/components/ThemedText'
import { PaperProvider } from 'react-native-paper'
import { FlashList } from '@shopify/flash-list'
import { formatCustomDate } from '@/libraries/formatDate'
import CustomImage from '@/components/CustomImage'

export default function completed () {
  const theme = useColorScheme()
  const { appointments } = useSelector((state: RootState) => state.patientCompletedAppointments)

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

          <CustomImage
            source={item?.doctor?.displayImage ? item?.doctor?.displayImage?.image : item?.doctor?.profilePicture}
            placeholder={require('@/assets/images/images/avatar.png')}
            placeholderContentFit='cover'
            style={{ borderRadius: 50 }}
            contentFit='contain'
            size={0.12}
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
            <CustomImage
              source={require('@/assets/images/icons/calendar.png')}
              contentFit='contain'
              size={0.03}
              style={{
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
            <CustomImage
              source={require('@/assets/images/icons/clock.png')}
              contentFit='contain'
              size={0.03}
              style={{
                tintColor: theme == 'dark' ? light : appDark,
                opacity: 0.8
              }}
            />

            <ThemedText type='caption' opacity={0.8} style={{ marginTop: 3 }}>{item?.appointment?.selectedTime?.time}</ThemedText>
          </View>
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
    </PaperProvider>
  )
}