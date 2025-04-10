import { View, TouchableOpacity, Platform, Keyboard } from 'react-native'
import React from 'react'
import { ActivityIndicator, Appbar, PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import { useColorScheme } from '@/hooks/useColorScheme'
import { accent, appDark, light } from '@/utils/colors'
import { ThemedText } from '@/components/ThemedText'
import { Input } from '@/components/auth/Input'
import { KeyboardAvoidingView } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/utils/firebase'

export default function ForgotPaswsord () {
  const theme = useColorScheme()
  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const recoverPasword = async () => {
    if (!email) return

    setLoading(true)
    await sendPasswordResetEmail(auth, email)
    setLoading(false)
    router.push('/(auth)/login')
  }

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          backgroundColor: theme == 'dark' ? appDark : light,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
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

        <ThemedText type='subtitle' font='Poppins-Bold'>Recover Password</ThemedText>

        <View style={{ width: 70 }} />
      </Appbar.Header>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ThemedView style={{ flex: 1, paddingHorizontal: 20 }}>
            <View style={{ marginTop: 50 }}>
              <Input
                value={email}
                updateValue={setEmail}
                label={'Enter your email'}
                left={require('@/assets/images/icons/mail.png')}
              />
            </View>

            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <ThemedText lightColor={accent} type='body'>
                Sign in instead
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={recoverPasword}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                backgroundColor: accent,
                width: '100%',
                height: 50,
                paddingHorizontal: 20,
                borderRadius: 50,
                marginTop: 20,
              }}
            >
              {loading && <ActivityIndicator size={18} color={light} />}
              <ThemedText lightColor={light} type='body' font='Poppins-Bold'>Send Recovery Mail</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </PaperProvider>
  )
}