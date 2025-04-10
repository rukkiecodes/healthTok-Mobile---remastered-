import { TouchableOpacity } from 'react-native'
import React from 'react'
import { PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { Image } from 'expo-image'
import { useColorScheme } from '@/hooks/useColorScheme'
import { ThemedText } from '@/components/ThemedText'
import { accent, light, transparent } from '@/utils/colors'
import { router } from 'expo-router'

export default function GetStared () {
  const theme = useColorScheme()

  return (
    <PaperProvider>
      <ThemedView
        style={{
          flex: 1,
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 40,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            top: 50,
            left: 30,
          }}
        >
          <Image
            source={require('@/assets/images/icons/arrow_left.png')}
            style={{
              tintColor: theme == 'dark' ? light : accent,
              width: 25,
              height: 25,
            }}
          />
        </TouchableOpacity>

        <Image
          source={theme == 'dark' ? require('@/assets/images/images/logo1.png') : require('@/assets/images/images/logo2.png')}
          style={{
            width: 250,
            height: 250,
          }}
        />

        <ThemedText type='title' font='Poppins-Bold' style={{ textAlign: 'center' }}>Let's get started!</ThemedText>
        <ThemedText type='body' style={{ textAlign: 'center', marginTop: 20 }} font='Poppins-Regular'>
          Login to get access the best medical features we have made to improve a healthy living.
        </ThemedText>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          style={{
            backgroundColor: accent,
            width: '100%',
            height: 50,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <ThemedText lightColor={light} type='body' font='Poppins-Bold' style={{ textAlign: 'center' }}>Login</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/signup')}
          style={{
            backgroundColor: transparent,
            borderWidth: 1,
            borderColor: theme == 'dark' ? light : accent,
            width: '100%',
            height: 50,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <ThemedText lightColor={accent} darkColor={light} type='body' font='Poppins-Bold' style={{ textAlign: 'center' }}>Sign Up</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </PaperProvider>
  )
}