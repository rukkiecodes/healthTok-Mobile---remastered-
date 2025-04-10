import { View, TouchableOpacity, Dimensions } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { accent, light } from '@/utils/colors'
import { PaperProvider } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Image } from 'expo-image'
import { BlurView } from 'expo-blur';
const { width, height } = Dimensions.get('window')

WebBrowser.maybeCompleteAuthSession()

const WelcomeScreen = () => {
  const theme = useColorScheme()

  return (
    <PaperProvider>
      <ThemedView style={{ flex: 1, position: 'relative' }}>
        <Image
          source={require('@/assets/images/images/step1.png')}
          contentFit='cover'
          style={{
            width: width,
            height: height / 1.2,
            position: 'absolute',
            top: 0,
          }}
        />

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
          <ThemedText type='title' font='Poppins-Bold' style={{ textAlign: 'center' }}>
            Consult professional
          </ThemedText>
          <ThemedText type='title' font='Poppins-Bold' style={{ textAlign: 'center' }}>
            medical practitioners
          </ThemedText>

          <TouchableOpacity
            onPress={() => router.navigate('/(auth)/step2')}
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

            <ThemedText font='Poppins-Bold' type='subtitle' lightColor={light}>Next</ThemedText>

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
                borderRadius: 50,
                opacity: 0.5,
              }}
            />
          </View>
        </BlurView>
      </ThemedView>
    </PaperProvider>
  )
}

export default WelcomeScreen