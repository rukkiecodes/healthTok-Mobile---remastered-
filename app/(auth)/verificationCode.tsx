import { View, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useThemeColor } from '@/hooks/useThemeColor'
import { router } from 'expo-router'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { ActivityIndicator, Appbar, PaperProvider } from 'react-native-paper'
const { width } = Dimensions.get('window')
import { OtpInput } from "react-native-otp-entry";
import { RootState } from '@/utils/store'
import { accent, amber, black, dark, light, transparent } from '@/utils/colors'

const VerificationCodeScreens = () => {
  const buttonBackground = useThemeColor({ light: accent, dark: amber }, 'background');
  const buttonBackgroundText = useThemeColor({ light, dark }, 'text');
  const color = useThemeColor({ light: black, dark: light }, 'text');

  const { signupObject } = useSelector((state: RootState) => state.user);

  const [OTP, setOTP] = useState(false)
  const [loading, setLoading] = useState(false)

  const verify = async () => {
    if (!OTP) return

    setLoading(true)

    try {
      const response = await axios.post(`https://getartisan-e6411dd591d3.herokuapp.com/auth/verifyOTP`, {
        otp: OTP,
        userId: signupObject.mirrorDB_UID
      });
      router.navigate('/(auth)/displayPics')
    } catch (error) {
      console.error(error);
      alert('Failed to send verification email');
    } finally {
      setLoading(false);
    }
  }

  const resendOTP = async () => {
    try {
      const response = await axios.post(`https://getartisan-e6411dd591d3.herokuapp.com/auth/resendVerification`, {
        userId: signupObject.mirrorDB_UID,
        email: signupObject.email
      });
      console.log(response.data);
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
          <View style={{ backgroundColor: buttonBackground, height: 3, borderRadius: 12, flex: 1 }} />
        </View>


        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
          <ThemedText type='title' font='Poppins-Bold'>
            Enter Verification Code
          </ThemedText>


          <ThemedText style={{ marginTop: 10 }}>
            Please enter the verification code we sent to your Email.
          </ThemedText>


          <View style={{ marginTop: 20 }}>
            <OtpInput
              numberOfDigits={4}
              onTextChange={(text) => console.log(text)}
              focusColor={buttonBackground}
              focusStickBlinkingDuration={500}
              onFilled={(text: any) => setOTP(text)}
              textInputProps={{
                accessibilityLabel: "One-Time Password",
              }}
              theme={{
                containerStyle: { justifyContent: 'space-between', gap: 20 },
                pinCodeContainerStyle: { flex: 1, height: width / 5 },
                pinCodeTextStyle: { color }
              }}
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


            <TouchableOpacity
              onPress={resendOTP}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                height: 50,
                marginTop: 20
              }}
            >
              <ThemedText style={{ color: amber }}>Resend OTP</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    </PaperProvider>
  )
}

export default VerificationCodeScreens