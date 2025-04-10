import { View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useThemeColor } from '@/hooks/useThemeColor'
import { router } from 'expo-router'
import AuthInputs from '@/components/auth/Inputs'
import axios from 'axios'
import { ActivityIndicator, Appbar, PaperProvider } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { setSignupObject } from '@/features/userSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RootState } from '@/utils/store'
import { accent, amber, dark, light, offWhite, transparent } from '@/utils/colors'

const VerifyEmailScreen = () => {
  const buttonBackground = useThemeColor({ light: accent, dark: amber }, 'background');
  const buttonBackgroundText = useThemeColor({ light, dark }, 'text');

  const dispatch = useDispatch()
  const { signupObject } = useSelector((state: RootState) => state.user);

  const [email, setEmail] = useState(signupObject.email)
  const [loading, setLoading] = useState(false)

  const verify = async () => {
    if (!email) return

    setLoading(true)

    try {
      const response = await axios.post(`https://getartisan-e6411dd591d3.herokuapp.com/auth/signup`, {
        email,
      });
      dispatch(setSignupObject({
        ...signupObject,
        mirrorDB_UID: response.data.user._id
      }))

      await AsyncStorage.setItem('healthTok_mirrorDB_UID', JSON.stringify(response.data.user._id))

      router.navigate('/(auth)/verificationCode')
    } catch (error) {
      resendOTP()
    } finally {
      setLoading(false);
    }
  }

  const resendOTP = async () => {
    try {
      const healthTok_mirrorDB_UID = await AsyncStorage.getItem('healthTok_mirrorDB_UID')



      const response = await axios.post(`https://getartisan-e6411dd591d3.herokuapp.com/auth/resendVerification`, {
        userId: healthTok_mirrorDB_UID,
        email: signupObject.email
      });

      router.navigate('/(auth)/verificationCode')
    } catch (error) {
      console.error(error);
      alert('Failed to send verification email');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PaperProvider>
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <Appbar.Header mode='small' style={{ backgroundColor: transparent }}>
          <Appbar.BackAction onPress={router.back} />
        </Appbar.Header>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', gap: 20 }}>
          <View style={{ backgroundColor: buttonBackground, height: 3, borderRadius: 12, flex: 1 }} />
          <View style={{ backgroundColor: buttonBackground, height: 3, borderRadius: 12, flex: 1 }} />
          <View style={{ backgroundColor: buttonBackground, height: 3, borderRadius: 12, flex: 1 }} />
          <View style={{ backgroundColor: buttonBackground, height: 3, borderRadius: 12, flex: 1 }} />
          <View style={{ backgroundColor: offWhite, height: 3, borderRadius: 12, flex: 1 }} />
        </View>


        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
          <ThemedText type='title' font='Poppins-Bold'> Verify Email </ThemedText>

          <ThemedText style={{ marginTop: 10 }}>
            To start your Journey, lets verify your Email
          </ThemedText>

          <View style={{ marginTop: 20 }}>
            <AuthInputs
              value={email}
              updateValue={text => setEmail(text)}
              placeholder='Enter Email'
              separation={20}
              passwordMode={false}
              inputMode='email'
            />

            <TouchableOpacity
              onPress={verify}
              style={{
                marginTop: 20,
                height: 50,
                borderRadius: 50,
                borderCurve: 'continuous',
                backgroundColor: buttonBackground,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {
                loading ?
                  <ActivityIndicator color={buttonBackgroundText} /> :
                  <ThemedText style={{ color: buttonBackgroundText }}>Verify</ThemedText>
              }
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    </PaperProvider>
  )
}

export default VerifyEmailScreen