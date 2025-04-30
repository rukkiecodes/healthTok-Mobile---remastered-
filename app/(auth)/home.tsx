import { View, TouchableOpacity } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { router } from 'expo-router'
import { accent, appDark, dark, light } from '@/utils/colors'
import { PaperProvider } from 'react-native-paper'
import { Image, ImageBackground } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient';
import HapticWrapper from '@/components/Harptic'

const WelcomeScreen = () => {
  return (
    <PaperProvider>
      <ThemedView style={{ flex: 1 }}>
        <ImageBackground source={require('@/assets/images/images/step1.jpg')} style={{ flex: 1 }}>
          <LinearGradient
            colors={[`${appDark}33`, appDark]}
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              padding: 20,
              paddingTop: 100
            }}
          >
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

            <View>
              <ThemedText type='title' font='Poppins-Bold' style={{ textAlign: 'center' }}>
                {'Consult professional\nmedical practitioners'}
              </ThemedText>

              <HapticWrapper
                onPress={() => router.navigate('/(auth)/step2')}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: accent,
                  width: '100%',
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
              </HapticWrapper>
            </View>
          </LinearGradient>
        </ImageBackground>
      </ThemedView>
    </PaperProvider>
  )
}

export default WelcomeScreen