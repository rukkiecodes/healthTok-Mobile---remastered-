import { View, ScrollView, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { accent, amber, dark, light, offWhite, transparent } from '@/utils/colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { router } from 'expo-router'
import { useColorScheme } from '@/hooks/useColorScheme';
import { Appbar, PaperProvider, RadioButton } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { setSignupObject } from '@/features/userSlice'
import { RootState } from '@/utils/store'
import { Image } from 'expo-image'

const JoinScreen = () => {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch()
  const { signupObject } = useSelector((state: RootState) => state.user);

  const buttonBackground = useThemeColor({ light: accent, dark: amber }, 'background');
  const buttonBackgroundText = useThemeColor({ light, dark }, 'text');

  const setJoiningAs = (prop: string) => {
    dispatch(
      setSignupObject({
        ...signupObject,
        joiningAs: prop
      })
    );
  };

  const next = () => {
    router.navigate('/(auth)/signup')
  }

  return (
    <PaperProvider>
      <ThemedView style={{ flex: 1, padding: 20 }}>
        <Appbar.Header mode='small' style={{ backgroundColor: transparent }}>
          <Appbar.BackAction onPress={router.back} />
        </Appbar.Header>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', gap: 20 }}>
          <View style={{ backgroundColor: buttonBackground, height: 3, borderRadius: 12, flex: 1 }} />
          <View style={{ backgroundColor: offWhite, height: 3, borderRadius: 12, flex: 1 }} />
          <View style={{ backgroundColor: offWhite, height: 3, borderRadius: 12, flex: 1 }} />
          <View style={{ backgroundColor: offWhite, height: 3, borderRadius: 12, flex: 1 }} />
          <View style={{ backgroundColor: offWhite, height: 3, borderRadius: 12, flex: 1 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 20 }}>
          <ThemedText type='title' font='Poppins-Bold'> Join As </ThemedText>
          <ThemedText style={{ marginTop: 10 }}> Select your  Account Type </ThemedText>

          <View
            style={{
              marginTop: 20,
              paddingVertical: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 20
              }}
            >
              <Image
                tintColor={colorScheme == 'dark' ? light : dark}
                source={require('@/assets/images/imgs/brush-square.png')}
                style={{
                  width: 20,
                  height: 20
                }}
              />

              <View>
                <ThemedText>Artisan</ThemedText>
                <ThemedText type='body'>Would like to get hired</ThemedText>
              </View>
            </View>

            <View
              style={
                Platform.OS == 'ios' &&
                {
                  borderWidth: 2,
                  borderRadius: 50,
                  borderColor: colorScheme === 'dark'
                    ? light
                    : (signupObject.joiningAs === 'artisan' ? accent : `${dark}33`),
                  borderStyle: 'solid'
                }
              }
            >
              <RadioButton
                value="artisan"
                status={signupObject.joiningAs === 'artisan' ? 'checked' : 'unchecked'}
                onPress={() => setJoiningAs('artisan')}
                color={colorScheme === 'dark' ? light : accent}
              />
            </View>
          </View>



          <View
            style={{
              marginTop: 20,
              paddingVertical: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 20
              }}
            >
              <Image
                tintColor={colorScheme == 'dark' ? light : dark}
                source={require('@/assets/images/imgs/profile.png')}
                style={{
                  width: 20,
                  height: 20
                }}
              />


              <View>
                <ThemedText>Client</ThemedText>
                <ThemedText type='body'>Looking to Hire an Artisan</ThemedText>
              </View>
            </View>


            <View
              style={Platform.OS == 'ios' && {
                borderWidth: 2,
                borderRadius: 50,
                borderColor: colorScheme === 'dark'
                  ? light
                  : (signupObject.joiningAs === 'client' ? accent : `${dark}33`),
                borderStyle: 'solid'
              }}
            >
              <RadioButton
                value="client"
                status={signupObject.joiningAs === 'client' ? 'checked' : 'unchecked'}
                onPress={() => setJoiningAs('client')}
                color={colorScheme === 'dark' ? light : accent}
              />
            </View>
          </View>


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
            <ThemedText style={{ color: buttonBackgroundText }}>Next</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    </PaperProvider>
  )
}

export default JoinScreen