import { View, TouchableOpacity, Platform, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Appbar, Checkbox, PaperProvider } from 'react-native-paper'
import { ThemedView } from '@/components/ThemedView'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import { useColorScheme } from '@/hooks/useColorScheme'
import { accent, appDark, black, light } from '@/utils/colors'
import { ThemedText } from '@/components/ThemedText'
import { Input } from '@/components/auth/Input'
import { KeyboardAvoidingView } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/utils/fb'
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { setAcceptTerms, setEmail, setName, setPassword } from '@/store/slices/signup'
import axios from 'axios'

export default function Signup () {
  const theme = useColorScheme()
  const dispatch = useDispatch()
  const { name, email, password, acceptTerms } = useSelector((state: RootState) => state.signup)

  const [peek, setPeek] = useState(false)
  const [loading, setLoading] = useState(false)

  // const signUpUser = async () => {
  //   if (!name || !email || !password) {
  //     alert('Please fill all fields')
  //     return
  //   }

  //   try {
  //     setLoading(true)
  //     const { user } = await createUserWithEmailAndPassword(auth, email, password)

  //     const q = query(collection(db, "users"), where("uid", "==", user.uid));
  //     const userSnapshot = await getDocs(q);

  //     if (userSnapshot.empty) saveUser(user.uid, name, email)
  //     setLoading(false)
  //   } catch (error: any) {
  //     switch (error.code) {
  //       case 'auth/email-already-in-use':
  //         alert('Email already in use')
  //         break
  //       case 'auth/invalid-email':
  //         alert('Invalid email')
  //         break
  //       case 'auth/weak-password':
  //         alert('Weak password')
  //         break
  //       default:
  //         alert('Error signing up')
  //         break
  //     }

  //     setLoading(false)
  //   }
  // }

  // const saveUser = async (uid: string, name: string, email: string) => {
  //   await setDoc(doc(db, "users", uid), {
  //     uid: uid,
  //     email,
  //     name,
  //     profilePicture: null,
  //     createdAt: serverTimestamp(),
  //   });
  // }

  const done = async () => {
    setLoading(true)

    try {
      const response = await axios.post("https://mailservice-e4b2cc7b9ef8.herokuapp.com/healthTok/OTP", {
        email
      });
      setLoading(false)
      router.push({
        pathname: '/(auth)/(signup)/(OTP)/OTP',
        params: { _uid: JSON.stringify(response.data.user._id) }
      })
    } catch (error) {
      console.log('Error sending OTP', error)
    } finally {
      setLoading(false);
    }
  }

  const validateInputs = () => {
    if (!name || !email || !password || !acceptTerms) return false
    else return true
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

        <ThemedText type='subtitle' font='Poppins-Bold'>Sign up</ThemedText>

        <View style={{ width: 50 }} />
      </Appbar.Header>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <ThemedView style={{ flex: 1, paddingHorizontal: 20 }}>
            <View style={{ marginTop: 50 }}>
              <Input
                value={name}
                updateValue={(text) => dispatch(setName(text))}
                label={'Enter your name'}
                left={require('@/assets/images/icons/user_alt.png')}
              />

              <Input
                gap={20}
                value={email}
                updateValue={(text) => dispatch(setEmail(text))}
                label={'Enter your email'}
                left={require('@/assets/images/icons/mail.png')}
              />

              <Input
                gap={20}
                peek={peek}
                setPeek={setPeek}
                updateValue={(text) => dispatch(setPassword(text))}
                right={true}
                value={password}
                secureTextEntry={!peek}
                style={{ paddingRight: 50 }}
                label={'Enter your password'}
                left={require('@/assets/images/icons/lock.png')}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <Checkbox
                status={acceptTerms ? 'checked' : 'unchecked'}
                onPress={() => {
                  dispatch(setAcceptTerms(!acceptTerms))
                }}
                color={theme == 'dark' ? light : accent}
                uncheckedColor={theme == 'dark' ? light : black}
              />

              <ThemedText type='body'>
                I agree to the healthtok
                <ThemedText
                  lightColor={accent}
                  type='body'
                  style={{
                    textDecorationLine: theme == 'dark' ? "underline" : "none"
                  }}
                >
                  Terms of Service and Privacy Policy
                </ThemedText>
              </ThemedText>
            </View>

            <TouchableOpacity
              onPress={done}
              disabled={!validateInputs()}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                backgroundColor: accent,
                width: '100%',
                height: 50,
                paddingHorizontal: 20,
                borderRadius: 50,
                marginTop: 20,
                opacity: validateInputs() ? 1 : 0.5,
              }}
            >
              {
                loading ? <ActivityIndicator color={light} /> :
                  <ThemedText lightColor={light} type='body' font='Poppins-Bold'>Next</ThemedText>
              }
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.navigate('/(auth)/login')}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                gap: 10,
              }}
            >
              <ThemedText type='body'>Already have an account? </ThemedText>
              <ThemedText type='body' lightColor={accent}>Sign In</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </PaperProvider>
  )
}