import { View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import AuthInputs from '@/components/auth/Inputs'
import { useThemeColor } from '@/hooks/useThemeColor'
import { router } from 'expo-router'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/utils/fb'
import { ActivityIndicator } from 'react-native-paper'
import { accent, amber, dark, light } from '@/utils/colors'

const ForgotPasswordScreen = () => {
  const buttonBackground = useThemeColor({ light: accent, dark: amber }, 'background');
  const buttonBackgroundText = useThemeColor({ light, dark }, 'text');

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  const sendMail = () => {
    if (!email.match(regex)) {
      alert('Please complete the form and try again ');

      return
    } else {
      setLoading(true)

      sendPasswordResetEmail(auth, email)
        .then(async () => {
          alert('An email has been sent to your inbox')

          setLoading(false)
        })
        .catch(async error => {
          alert('There was an error sending your email. Check your email address and try again.')

          setLoading(false)
        });
    }
  }

  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText type='subtitle' font='Poppins-Bold'>
          Forgot Password?
        </ThemedText>


        <ThemedText style={{ marginTop: 10 }}>
          Don't worry! It occurs. Please enter the email address linked with your account.
        </ThemedText>

        <View style={{ marginTop: 20 }}>
          <AuthInputs
            value={email}
            updateValue={text => setEmail(text)}
            placeholder='Email address'
            label='Email address'
            separation={20}
            passwordMode={false}
            inputMode='email'
          />


          <TouchableOpacity
            onPress={sendMail}
            style={{
              height: 50,
              borderRadius: 50,
              borderCurve: 'continuous',
              backgroundColor: buttonBackground,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20
            }}
          >
            {
              loading ? <ActivityIndicator color={buttonBackgroundText} /> :
                <ThemedText style={{ color: buttonBackgroundText }}>Submit</ThemedText>
            }
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.navigate('/(auth)/login')}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
              height: 50,
              marginTop: 20
            }}
          >
            <ThemedText>Remember Password?</ThemedText><ThemedText style={{ color: amber }}>Login</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  )
}

export default ForgotPasswordScreen