import { View, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useThemeColor } from '@/hooks/useThemeColor'
import { router } from 'expo-router'
import AuthInputs from '@/components/auth/Inputs'
import { ScrollView } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { setSignupObject } from '@/features/userSlice'
import { Appbar, PaperProvider } from 'react-native-paper'
import { RootState } from '@/utils/store'
import { useColorScheme } from '@/hooks/useColorScheme'
import { accent, amber, black, dark, light, transparent } from '@/utils/colors'

const SignupScreen = () => {
  const colorScheme = useColorScheme()
  const dispatch = useDispatch()
  const { signupObject } = useSelector((state: RootState) => state.user);

  const buttonBackground = useThemeColor({ light: accent, dark: amber }, 'background');
  const buttonBackgroundText = useThemeColor({ light, dark }, 'text');
  const outlineColor = useThemeColor({ light: black, dark: light }, 'text');

  const [fullName, setFullName] = useState<string>(signupObject.fullName);
  const [username, setUsername] = useState<string>(signupObject.username);
  const [companyName, setCompanyName] = useState<string>(signupObject.companyName);
  const [email, setEmail] = useState<string>(signupObject.email);
  const [phone, setPhone] = useState<string>(signupObject.phone);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [password, setPassword] = useState<string>(signupObject.password);
  const [confirmPassword, setConfirmPassword] = useState<string>(signupObject.confirmPassword);

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/

  const next = () => {
    if (!fullName || !username || !email || !phone || !password || !confirmPassword) return;

    dispatch(
      setSignupObject({
        ...signupObject,
        fullName,
        username,
        companyName,
        email,
        phone,
        password,
        confirmPassword
      })
    );

    if (signupObject.joiningAs == 'artisan')
      router.navigate('/(auth)/artisanDetails')
    else
      router.navigate('/(auth)/displayPics')
      // router.navigate('/(auth)/verifyEmail')
  }

  const handlePhoneChange = (text: string): void => {
    // Remove any non-digit characters
    let sanitizedText = text.replace(/\D/g, '');

    // Check if the number starts with '0' and display an error message
    if (sanitizedText.startsWith('0')) {
      setErrorMessage("Please don't start with '0'. Enter your number without the leading zero.");
    } else {
      setErrorMessage('');
    }

    // Limit the phone number to 10 digits
    if (sanitizedText.length > 10) {
      sanitizedText = sanitizedText.slice(0, 10);
    }

    // Format the phone number as 916 642 2808 (without country code)
    if (sanitizedText.length === 10) {
      sanitizedText = sanitizedText.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    }

    setPhone(sanitizedText);
  };

  return (
    <PaperProvider>
      <ThemedView style={{ flex: 1, paddingHorizontal: 20 }}>
        <Appbar.Header mode='small' style={{ backgroundColor: transparent }}>
          <Appbar.BackAction onPress={router.back} />
        </Appbar.Header>

        <ThemedText type='title' font='Poppins-Bold'> Join healthTok </ThemedText>

        <ThemedText style={{ marginTop: 10 }}>
          Create your account with us to explore amazing offers and unique products.
        </ThemedText>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
            <AuthInputs
              value={fullName}
              updateValue={text => setFullName(text)}
              placeholder='Enter Full Name'
              label='Full Name'
              separation={20}
              passwordMode={false}
            />

            <AuthInputs
              value={username}
              updateValue={text => setUsername(text)}
              placeholder='Enter Username'
              label='Username'
              separation={30}
              passwordMode={false}
            />

            {
              signupObject.joiningAs == 'artisan' &&
              <AuthInputs
                value={companyName}
                updateValue={text => setCompanyName(text)}
                placeholder='Enter Company Name'
                label='Company Name'
                separation={30}
                passwordMode={false}
              />
            }

            <AuthInputs
              value={email}
              updateValue={text => setEmail(text)}
              placeholder='Email Address'
              label='Email Address'
              separation={30}
              passwordMode={false}
              inputMode='email'
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                borderWidth: .3,
                borderColor: outlineColor,
                height: 50,
                borderRadius: 10,
                borderCurve: 'continuous',
                paddingHorizontal: 20,
                gap: 20,
                marginTop: 40
              }}
            >
              <ThemedText>+234</ThemedText>
              <TextInput
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType='phone-pad'
                placeholderTextColor={colorScheme === 'dark' ? `${light}33` : `${dark}33`}
                placeholder='Phone Number'
                keyboardAppearance='default'
                style={{
                  flex: 1,
                  height: '70%',
                  borderLeftWidth: 1,
                  paddingHorizontal: 20,
                  borderLeftColor: `${outlineColor}33`,
                  color: outlineColor,
                }}
              />
            </View>
            {errorMessage ? (
              <ThemedText type='body' style={{ color: 'red', marginTop: 5 }}>{errorMessage}</ThemedText>
            ) : null}

            <AuthInputs
              value={password}
              updateValue={text => setPassword(text)}
              placeholder='******'
              label='* Password'
              separation={30}
              passwordMode={true}
            />
            {
              password?.length >= 1 &&
              <>
                {
                  !passwordRegex.test(password) &&
                  <ThemedText style={{ opacity: 0.6, color: 'red' }}>
                    Must have at least 6 characters, one special character, one number and only one uppercase
                  </ThemedText>
                }
              </>
            }

            <AuthInputs
              value={confirmPassword}
              updateValue={text => setConfirmPassword(text)}
              placeholder='******'
              label='* Confirm password'
              separation={30}
              passwordMode={true}
            />
            {
              confirmPassword?.length >= 1 &&
              <>
                {
                  password !== confirmPassword &&
                  <ThemedText style={{ opacity: 0.6, color: 'red' }}>
                    Must have at least 6 characters, one special character, one number and only one uppercase
                  </ThemedText>
                }
              </>
            }
          </ScrollView>
        </KeyboardAvoidingView>


        <TouchableOpacity
          onPress={next}
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
          <ThemedText style={{ color: buttonBackgroundText }}>Register</ThemedText>
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
          <ThemedText>Already have an account?</ThemedText><ThemedText style={{ color: amber }}>Login</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </PaperProvider>
  )
}

export default SignupScreen