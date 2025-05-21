import { View, TouchableOpacity } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { Image, ImageBackground } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { accent, appDark, light } from '@/utils/colors'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import HapticWrapper from '@/components/Harptic'

export default function Step3 () {
  return (
    <PaperProvider>
      <ThemedView style={{ flex: 1, position: 'relative' }}>
        <ImageBackground source={require('@/assets/images/images/step3.png')} style={{ flex: 1 }}>
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
              <ThemedText font='Poppins-Bold' lightColor={light}>Skip</ThemedText>
            </TouchableOpacity>

            <View>
              <ThemedText type='title' font='Poppins-Bold' lightColor={light} style={{ textAlign: 'center' }}>
                {'Initiate secure\nvideo consultations.'}
              </ThemedText>

              <HapticWrapper
                onPress={() => router.navigate('/(auth)/getStarted')}
                height={40}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: accent,
                  width: '100%',
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
              </HapticWrapper>
            </View>
          </LinearGradient>
        </ImageBackground>
      </ThemedView>
    </PaperProvider>
  )
}