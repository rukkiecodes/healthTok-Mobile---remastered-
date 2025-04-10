import { TouchableOpacity } from 'react-native'
import React from 'react'
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { appDark, dark, light } from '@/utils/colors';

const BackButton = () => {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={{
        backgroundColor: colorScheme == 'dark' ? appDark : light,
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Image
        source={require('@/assets/images/imgs/arrowLeft.png')}
        tintColor={colorScheme == 'dark' ? light : dark}
        style={{
          width: 25,
          height: 15
        }}
      />
    </TouchableOpacity>
  )
}

export default BackButton