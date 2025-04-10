import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { accent, amber, dark, light } from '@/utils/colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { setUser } from '@/features/userSlice'
import { useAuth } from '@/context/auth'

const WohooScreen = () => {
  const buttonBackground = useThemeColor({ light: accent, dark: amber }, 'background');
  const buttonBackgroundText = useThemeColor({ light, dark }, 'text');

  const dispatch = useDispatch()
  const { signIn }: any = useAuth()

  const done = async () => {
    try {
      const healthTok_user: any = await AsyncStorage.getItem('healthTok_user')

      dispatch(setUser(JSON.parse(healthTok_user)))

      signIn()
    } catch (error) { }
  }

  return (
    <ThemedView
      style={{
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <View
        style={{
          width: 100,
          height: 100,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: buttonBackground,
          borderRadius: 50,
          borderCurve: 'continuous',
          marginBottom: 20
        }}
      >
        <Feather name="check" size={40} color={buttonBackgroundText} />
      </View>

      <ThemedText type='subtitle' font='Poppins-Bold'>Wohoo, you’re all set up</ThemedText>
      <ThemedText style={{ marginTop: 10 }}>
        Thank you for joining healthTok, do enjoy the experience
      </ThemedText>


      <TouchableOpacity
        onPress={done}
        style={{
          marginTop: 20,
          width: '100%',
          height: 50,
          borderRadius: 50,
          borderCurve: 'continuous',
          backgroundColor: buttonBackground,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ThemedText style={{ color: buttonBackgroundText }}>Done</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  )
}

export default WohooScreen