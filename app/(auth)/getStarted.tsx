import { TouchableOpacity } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { Image } from 'expo-image'
import { useColorScheme } from '@/hooks/useColorScheme'
import { ThemedText } from '@/components/ThemedText'
import { accent, light, transparent } from '@/utils/colors'
import { router } from 'expo-router'
import HapticWrapper from '@/components/Harptic'
import CustomImage from '@/components/CustomImage'

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

        <CustomImage
          source={theme == 'dark' ? require('@/assets/images/images/logo1.png') : require('@/assets/images/images/logo2.png')}
          size={0.5}
        />

        <ThemedText type='title' font='Poppins-Bold' style={{ textAlign: 'center' }}>Let's get started!</ThemedText>
        <ThemedText type='default' style={{ textAlign: 'center', marginBottom: 20 }} font='Poppins-Regular'>
          {`Login to get access the best medical\nfeatures we have made to improve a healthy living.`}
        </ThemedText>

        <HapticWrapper
          onPress={() => router.push('/(auth)/login')}
          haptic={false}
          height={40}
          style={{
            backgroundColor: accent,
            width: '100%',
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <ThemedText lightColor={light} type='body' font='Poppins-Bold' style={{ textAlign: 'center' }}>Login</ThemedText>
        </HapticWrapper>

        <HapticWrapper
          onPress={() => router.push('/(auth)/(signup)/home')}
          haptic={false}
          height={40}
          style={{
            backgroundColor: transparent,
            borderWidth: 1,
            borderColor: theme == 'dark' ? light : accent,
            width: '100%',
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <ThemedText lightColor={accent} darkColor={light} type='body' font='Poppins-Bold' style={{ textAlign: 'center' }}>Sign Up</ThemedText>
        </HapticWrapper>
      </ThemedView>
    </PaperProvider>
  )
}