import React from 'react'
import { Image, ImageProps } from 'expo-image'

export type AutoHeightImageProps = ImageProps & {
  source?: string;
  size?: number;
};

const AutoHeightImage = ({ style, source, size, ...otherProps }: AutoHeightImageProps) => {
  return (
    <Image
      source={source}
      contentFit='contain'
      {...otherProps}
      style={[
        {
          alignSelf: 'center',
          width: size || 50,
          height: size || 50
        },
        style
      ]}
    />
  )
}

export default AutoHeightImage