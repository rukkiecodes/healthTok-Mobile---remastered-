import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import { Image, ImageBackground } from 'expo-image'
import { useLocalSearchParams } from 'expo-router'
import { ThemedText } from '@/components/ThemedText'
import { green, light, red } from '@/utils/colors'
import HapticWrapper from '@/components/Harptic'
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'

const { width } = Dimensions.get('window')

export default function ringing () {
  const { data }: any = useLocalSearchParams()

  const parsedData = () => JSON.parse(data)

  return (
    <ImageBackground
      source={require('@/assets/images/images/step3.png')}
      blurRadius={100}
      style={{
        flex: 1,
        padding: 50
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10
        }}
      >
        <ThemedText lightColor={light} type='title' font='Poppins-Bold'>{parsedData().name}</ThemedText>
        <Image
          source={parsedData().image}
          placeholder={require('@/assets/images/images/avatar.png')}
          contentFit='cover'
          placeholderContentFit='cover'
          style={{
            width: width / 3,
            height: width / 3,
            borderRadius: 100
          }}
        />
        <ThemedText lightColor={light} type='body' font='Poppins-Bold'>Incoming call...</ThemedText>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          gap: 20
        }}
      >
        <HapticWrapper
          style={{
            width: width / 6,
            height: width / 6,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: red
          }}
        >
          <MaterialCommunityIcons name="phone-hangup" size={20} color={light} />
        </HapticWrapper>
        
        <HapticWrapper
          style={{
            width: width / 6,
            height: width / 6,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: green
          }}
        >
          <Entypo name="phone" size={20} color={light} />
        </HapticWrapper>
      </View>
    </ImageBackground>
  )
}