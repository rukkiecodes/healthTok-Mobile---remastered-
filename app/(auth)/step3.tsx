import { View, Dimensions, TouchableOpacity } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { accent, light } from '@/utils/colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { BlurView } from 'expo-blur'
import { router } from 'expo-router'

const { width, height } = Dimensions.get('window')

export default function Step3 () {
  const theme = useColorScheme()

  return (
    <PaperProvider>
      <ThemedView style={{ flex: 1, position: 'relative' }}>
        <Image
          source={require('@/assets/images/images/step3.png')}
          contentFit='cover'
          style={{
            width: width,
            height: height / 1.2,
            position: 'absolute',
            top: 0,
          }}
        />

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

        <TouchableOpacity
          onPress={() => router.push('/(auth)/getStarted')}
          style={{
            position: 'absolute',
            top: 50,
            right: 30
          }}
        >
          <ThemedText font='Poppins-Bold'>Skip</ThemedText>
        </TouchableOpacity>

        <BlurView
          intensity={100}
          style={{
            backgroundColor: `${accent}63`,
            width: width / 1.2,
            paddingVertical: 40,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 50,
            left: 50,
            right: 50,
            overflow: 'hidden',
          }}
        >
          <ThemedText type='title' font='Poppins-Bold'>
            Initiate secure video consultations.
          </ThemedText>

          <TouchableOpacity
            onPress={() => router.navigate('/(auth)/getStarted')}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: accent,
              width: width / 1.5,
              height: 50,
              paddingHorizontal: 20,
              borderRadius: 50,
              marginTop: 20,
            }}
          >
            <Image
              source={require('@/assets/images/icons/arrow_right.png')}
              style={{
                width: 20,
                height: 20,
                opacity: 0,
              }}
            />

            <ThemedText font='Poppins-Bold' type='subtitle' lightColor={light}>Continue</ThemedText>

            <Image
              source={require('@/assets/images/icons/arrow_right.png')}
              style={{
                width: 20,
                height: 20,
              }}
            />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 30,
              gap: 10,
            }}
          >
            <View
              style={{
                width: 30,
                height: 5,
                backgroundColor: theme == 'dark' ? light : accent,
                borderRadius: 50,
                opacity: 0.5,
              }}
            />
            <View
              style={{
                width: 30,
                height: 5,
                backgroundColor: theme == 'dark' ? light : accent,
                borderRadius: 50,
                opacity: 0.5,
              }}
            />
            <View
              style={{
                width: 30,
                height: 5,
                backgroundColor: theme == 'dark' ? light : accent,
                borderRadius: 50
              }}
            />
          </View>
        </BlurView>
      </ThemedView>
    </PaperProvider>
  )
}