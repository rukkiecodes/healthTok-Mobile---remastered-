import { View, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { OtpInput } from "react-native-otp-entry";
import { ActivityIndicator, Appbar, PaperProvider } from 'react-native-paper';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { accent, appDark, light } from '@/utils/colors';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { ThemedView } from '@/components/ThemedView';
import HapticWrapper from '@/components/Harptic';
import axios from 'axios';

const { width } = Dimensions.get('window')

export default function OTP () {
  const theme = useColorScheme()
  const { _uid } = useLocalSearchParams<{ _uid: string }>()
  const { email } = useSelector((state: RootState) => state.signup)

  const [OTP, setOTP] = useState(false)
  const [loading, setLoading] = useState(false)

  const verifyOTP = async () => {
    if (!OTP) return

    setLoading(true)

    try {
      await axios.post(`https://mailservice-e4b2cc7b9ef8.herokuapp.com/healthTok/verifyOTP`, {
        otp: OTP,
        userId: _uid
      });

      router.navigate('/(auth)/(signup)/(profile)/patient')
    } catch (error) {
      alert('Failed to send verification email');
    } finally {
      setLoading(false);
    }
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
              tintColor: theme == 'dark' ? light : appDark,
              width: 25,
              height: 25,
            }}
          />
        </TouchableOpacity>

        <ThemedText type='subtitle' font='Poppins-Bold'>Sign up</ThemedText>

        <View style={{ width: 50 }} />
      </Appbar.Header>

      <ThemedView style={{ flex: 1, padding: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <ThemedText type='subtitle' font='Poppins-Black' style={{ marginBottom: 10 }}>Enter 4 Digit Code</ThemedText>
          <ThemedText style={{ opacity: 0.6 }}>Please enter the 4 digit code we sent to</ThemedText>
          <ThemedText style={{ opacity: 0.6 }}>{email}</ThemedText>
        </View>

        <OtpInput
          numberOfDigits={4}
          onTextChange={(text) => console.log(text)}
          focusColor={light}
          focusStickBlinkingDuration={500}
          onFilled={(text: any) => setOTP(text)}
          textInputProps={{
            accessibilityLabel: "One-Time Password",
          }}
          theme={{
            containerStyle: { justifyContent: 'space-between', gap: 20 },
            pinCodeContainerStyle: { flex: 1, height: width / 5 },
            pinCodeTextStyle: { color: theme == 'dark' ? light : appDark },
            focusedPinCodeContainerStyle: { borderColor: theme == 'dark' ? light : appDark }
          }}
        />
      </ThemedView>

      <HapticWrapper
        onPress={verifyOTP}
        style={{
          height: 50,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 20,
          backgroundColor: accent
        }}
      >
        {
          loading ? <ActivityIndicator color={light} /> :
            <ThemedText lightColor={light} type='body' font='Poppins-Bold'>Next</ThemedText>
        }
      </HapticWrapper>
    </PaperProvider>
  )
}