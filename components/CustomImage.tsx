import { Dimensions } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'

const { width: screenWidth } = Dimensions.get('window')

interface ImageProps {
  source?: string
  placeholder?: string
  contentFit?: string | any
  placeholderContentFit?: string | any
  transition?: number
  size?: number
  style?: any
}

export default function CustomImage ({
  source,
  placeholder,
  contentFit = 'cover',
  placeholderContentFit = 'cover',
  transition = 300,
  size = 1,
  style,
  ...res
}: ImageProps) {
  const imageSize = screenWidth * size

  return (
    <Image
      source={source}
      placeholder={placeholder}
      contentFit={contentFit}
      placeholderContentFit={placeholderContentFit}
      transition={transition || 500}
      style={[
        { width: imageSize, height: imageSize },
        style
      ]}
      {...res}
    />
  )
}
