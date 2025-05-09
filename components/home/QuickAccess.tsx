import { View, TouchableOpacity, Dimensions, FlatList } from 'react-native'
import React from 'react'
import { ThemedView } from '../ThemedView'
import { Image } from 'expo-image'
import { ThemedText } from '../ThemedText'
import { appDark, black, ice, light, red } from '@/utils/colors'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
const { width } = Dimensions.get('window')

const ITEM_SIZE = width * 0.92
const SPACING = 20
const FULLSIZE = ITEM_SIZE + SPACING * 2

export function QuickAccess () {
  const { doctors } = useSelector((state: RootState) => state.quickResponse)

  return (
    <FlatList
      data={doctors}
      keyExtractor={(item) => item.id}
      horizontal
      bounces={false}
      snapToAlignment='center'
      snapToInterval={FULLSIZE}
      decelerationRate={'fast'}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => {
        return (
          <ThemedView
            darkColor={black}
            lightColor={ice}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: ITEM_SIZE,
              padding: 20,
              marginHorizontal: SPACING,
              height: 200,
              borderRadius: 20
            }}
          >
            <View style={{ gap: 20, width: '60%' }}>
              <ThemedText type='subtitle' font='Poppins-Bold'>Quick access to our consultants</ThemedText>

              <TouchableOpacity
                style={{
                  backgroundColor: red,
                  alignSelf: 'flex-start',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 50
                }}
              >
                <ThemedText lightColor={light} font='Poppins-Medium' type='body'>EMERGENCY</ThemedText>
              </TouchableOpacity>
            </View>

            <ThemedView
              darkColor={appDark}
              lightColor={light}
              style={{
                width: 150,
                height: 150,
                borderRadius: 100,
                position: 'absolute',
                right: 20,
                bottom: 0
              }}
            >
              <Image
                source={require('@/assets/images/images/womanDoctror.png')}
                contentFit='contain'
                style={{
                  width: '90%',
                  height: 190,
                  position: 'absolute',
                  bottom: 0,
                  left: 10
                }}
              />
            </ThemedView>
          </ThemedView>
        )
      }}
    />
  )
}