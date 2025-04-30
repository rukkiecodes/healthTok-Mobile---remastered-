import { View, TouchableOpacity } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { Image, ImageBackground } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { accent, appDark, light } from '@/utils/colors'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import HapticWrapper from '@/components/Harptic'

export default function Step2 () {
  return (
    <PaperProvider>
      <ThemedView style={{ flex: 1 }}>
        <ImageBackground source={require('@/assets/images/images/step2.png')} style={{ flex: 1 }}>
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
                {'Schedule and book an\nappointment with registered\nmedical practioners'}
              </ThemedText>

              <HapticWrapper
                onPress={() => router.navigate('/(auth)/step3')}
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