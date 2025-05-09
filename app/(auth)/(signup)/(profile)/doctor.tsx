import { View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { setBirth, setGender, setName, setOrigin, setUsername } from '@/store/slices/signup'
import { ThemedText } from '@/components/ThemedText'
import { Image } from 'expo-image'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, appDark, light, transparent } from '@/utils/colors'
import { ActivityIndicator, RadioButton, TextInput } from 'react-native-paper'
import { DatePickerModal } from 'react-native-paper-dates';
import HapticWrapper from '@/components/Harptic'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '@/utils/fb'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function doctor () {
    const theme = useColorScheme()
    const dispatch = useDispatch()
    const { name, email, password, username, gender, birth, origin } = useSelector((state: RootState) => state.signup)
    const [showGender, setShowGender] = useState(false)
    const [openDate, setOpenDate] = useState(false);
    const [loading, setLoading] = useState(false)
  
    const onDismissSingle = React.useCallback(() => {
      setOpenDate(false);
    }, [setOpenDate]);
  
    const onConfirmSingle = React.useCallback(
      (params: any) => {
        setOpenDate(false);
        dispatch(setBirth(params.date))
      },
      [setOpenDate, setBirth]
    );
  
    const validateSignup = () => {
      if (!name || !username || !gender || !birth || !origin) return false
      else return true
    }
  
    const signupUser = async () => {
      try {
        setLoading(true)
        const user = await createUserWithEmailAndPassword(auth, email, password)
        router.navigate('/(app)/(doctor)/(tabs)/home')
        await AsyncStorage.setItem('healthTok_collection', 'doctors')
        setLoading(false)
        saveUser(user.user.uid)
      } catch (error: any) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            alert('Email already in use')
            break
          case 'auth/invalid-email':
            alert('Invalid email')
            break
          case 'auth/weak-password':
            alert('Weak password')
            break
          default:
            alert('Error signing up')
            break
        }
  
        setLoading(false)
      }
    }
  
  
    const saveUser = async (uid: string) => {
      try {
        await setDoc(doc(db, "doctors", uid), {
          uid: uid,
          email,
          name,
          username,
          gender,
          birth,
          isApplicationSubmited: false,
          isApplicationSuccessful: false,
          specialization: "General Practitioner",
          origin,
          profilePicture: null,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.log(error)
      }
    }
  
  
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        <View style={{ gap: 20 }}>
          <TextInput
            value={name}
            label={'Full Name'}
            mode='outlined'
            outlineStyle={{ borderRadius: 20 }}
            activeOutlineColor={theme == 'dark' ? light : accent}
            onChangeText={(text) => dispatch(setName(text))}
            style={{ backgroundColor: transparent }}
          />

          <TextInput
            value={username}
            label={'Username'}
            mode='outlined'
            outlineStyle={{ borderRadius: 20 }}
            activeOutlineColor={theme == 'dark' ? light : accent}
            onChangeText={(text) => dispatch(setUsername(text))}
            style={{ backgroundColor: transparent }}
          />

          <TouchableOpacity
            onPress={() => setShowGender(!showGender)}
            style={{
              backgroundColor: transparent,
              height: 50,
              width: '100%',
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: theme == 'dark' ? `${light}33` : `${appDark}33`,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20
            }}
          >
            <ThemedText>Gender ({gender})</ThemedText>

            <Image
              source={require('@/assets/images/icons/chevron_down.png')}
              style={{
                width: 20,
                height: 20,
                tintColor: theme == 'dark' ? light : appDark
              }}
            />
          </TouchableOpacity>
          {
            showGender &&
            <View style={{ gap: 20 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <ThemedText type='body' font='Poppins-Medium'>Male</ThemedText>
                <RadioButton
                  value={gender}
                  color={theme == 'dark' ? light : appDark}
                  onPress={() => dispatch(setGender('male'))}
                  status={gender === 'male' ? 'checked' : 'unchecked'}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <ThemedText type='body' font='Poppins-Medium'>Female</ThemedText>
                <RadioButton
                  value={gender}
                  color={theme == 'dark' ? light : appDark}
                  onPress={() => dispatch(setGender('female'))}
                  status={gender === 'female' ? 'checked' : 'unchecked'}
                />
              </View>
            </View>
          }

          <TouchableOpacity
            onPress={() => setOpenDate(true)}
            style={{
              backgroundColor: transparent,
              height: 50,
              width: '100%',
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: theme == 'dark' ? `${light}33` : `${appDark}33`,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20
            }}
          >
            <ThemedText>Date of Birth</ThemedText>

            <Image
              source={require('@/assets/images/icons/calendar.png')}
              style={{
                width: 20,
                height: 20,
                tintColor: theme == 'dark' ? light : appDark
              }}
            />
          </TouchableOpacity>
          <DatePickerModal
            locale="en"
            mode="single"
            visible={openDate}
            onDismiss={onDismissSingle}
            date={birth}
            onConfirm={onConfirmSingle}
          />

          <TextInput
            value={origin}
            label={'State/Origin'}
            mode='outlined'
            outlineStyle={{ borderRadius: 20 }}
            activeOutlineColor={theme == 'dark' ? light : accent}
            onChangeText={(text) => dispatch(setOrigin(text))}
            style={{ backgroundColor: transparent }}
          />
        </View>

      </ScrollView>

      <HapticWrapper
        onPress={signupUser}
        style={{
          height: 50,
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 20,
          backgroundColor: accent,
          opacity: validateSignup() ? 1 : 0.6
        }}
      >
        {
          loading ? <ActivityIndicator color={light} /> :
            <ThemedText lightColor={light} type='body' font='Poppins-Bold'>Next</ThemedText>
        }
      </HapticWrapper>
    </View>
  )
}