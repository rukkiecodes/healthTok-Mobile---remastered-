import { View, TouchableOpacity, ViewProps } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { ThemedText } from '../ThemedText'
import { accentLight, dark } from '@/utils/colors'

export type MessageAttatchementProps = ViewProps & {
  image?: string;
  title: string;
  action?: () => void
}

const MessageAttatchement = ({
  image,
  title,
  action
}: MessageAttatchementProps) => {
  return (
    <View style={{ width: '32%', justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={action}
        style={{
          width: 50,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
            borderCurve: 'continuous',
            backgroundColor: `${accentLight}23`,
            marginBottom: 5
          }}
        >
          <Image
            source={image}
            tintColor={accentLight}
            style={{
              width: 30,
              height: 30
            }}
          />
        </View>
        <ThemedText darkColor={dark} type='caption'>{title}</ThemedText>
      </TouchableOpacity>
    </View>
  )
}

export default MessageAttatchement