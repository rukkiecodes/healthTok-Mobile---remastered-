import { View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
import { useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSetupTab } from '@/store/slices/profileSlice'
import { PaperProvider, TextInput, Checkbox, ActivityIndicator } from 'react-native-paper'
import { accent, appDark, black, ice, light, transparent } from '@/utils/colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { ThemedText } from '@/components/ThemedText'
import { Image } from 'expo-image'
import { ThemedView } from '@/components/ThemedView'
import { auth, db } from '@/utils/fb'
import { doc, updateDoc } from 'firebase/firestore'
import { RootState } from '@/store/store'
// import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

export default function patient () {
  const dispatch = useDispatch()
  const theme = useColorScheme()

  const { profile } = useSelector((state: RootState) => state.profile)
  const [visible, setVisible] = useState(false);

  const [name, setName] = useState<string>(profile?.name || '')
  const [username, setUsername] = useState<string>(profile?.username || '')
  const [gender, setGender] = useState<string>(profile?.gender || 'male')
  const [referralCode, setReferralCode] = useState<string>(profile?.referralCode || '')
  const [checked, setChecked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [date, setDate] = useState(new Date(1598051730000));
  const [open, setOpen] = useState(false)

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  // const showMode = (currentMode) => {
  //   DateTimePickerAndroid.open({
  //     value: date,
  //     onChange,
  //     mode: currentMode,
  //     is24Hour: true,
  //   });
  // };

  // const showDatepicker = () => {
  //   showMode('date');
  // };

  const setupProfile = async () => {
    const { uid }: any = auth.currentUser

    if (!name || !username || !gender || !checked) return

    setLoading(true)

    await updateDoc(doc(db, 'users', uid), {
      name: name,
      username: username,
      gender: gender,
      referralCode: referralCode,
      checked: checked,
      accountType: 'patient',
      setup: true
    })

    setLoading(true)
  }

  useLayoutEffect(() => {
    dispatch(
      setSetupTab('patient')
    )
  }, [])

  return (
    <PaperProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, padding: 20 }}>
            <View style={{ gap: 20 }}>
              <TextInput
                value={name}
                onChangeText={(text: string) => setName(text)}
                label={'Full Name'}
                mode='outlined'
                outlineStyle={{ borderRadius: 20 }}
                activeOutlineColor={theme == 'dark' ? light : accent}
                contentStyle={{
                  fontFamily: 'Poppins-Regular',
                  color: theme == 'dark' ? light : appDark
                }}
                style={{
                  backgroundColor: transparent,
                  minheight: 40,
                  maxHeight: 200,
                }}
              />

              <TextInput
                value={username}
                onChangeText={(text: string) => setUsername(text)}
                label={'Username'}
                mode='outlined'
                outlineStyle={{ borderRadius: 20 }}
                activeOutlineColor={theme == 'dark' ? light : accent}
                contentStyle={{
                  fontFamily: 'Poppins-Regular',
                  color: theme == 'dark' ? light : appDark
                }}
                style={{
                  backgroundColor: transparent,
                  minheight: 40,
                  maxHeight: 200,
                }}
              />

              <TouchableOpacity
                onPress={() => setVisible(!visible)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: 40,
                  borderRadius: 20,
                  borderWidth: 1.5,
                  borderColor: theme == 'dark' ? `${light}60` : `${appDark}60`,
                  paddingHorizontal: 15
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
                visible &&
                <ThemedView
                  darkColor={black}
                  lightColor={ice}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 20,
                    padding: 3,
                    borderRadius: 50
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setGender('male')}
                    style={{
                      height: 40,
                      width: '50%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 50,
                      backgroundColor: gender == 'male' ? (theme == 'dark' ? appDark : light) : transparent
                    }}
                  >
                    <ThemedText font='Poppins-Bold'>Male</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setGender('female')}
                    style={{
                      height: 40,
                      width: '50%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 50,
                      backgroundColor: gender == 'female' ? (theme == 'dark' ? appDark : light) : transparent
                    }}
                  >
                    <ThemedText font='Poppins-Bold'>Male</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              }

              <TouchableOpacity
                // onPress={showDatepicker}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: 40,
                  borderRadius: 20,
                  borderWidth: 1.5,
                  borderColor: theme == 'dark' ? `${light}60` : `${appDark}60`,
                  paddingHorizontal: 15
                }}
              >
                <ThemedText>Date of Birth</ThemedText>

                <Image
                  source={require('@/assets/images/icons/date_range.png')}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: theme == 'dark' ? light : appDark
                  }}
                />
              </TouchableOpacity>

              <ThemedText lightColor={accent} darkColor={light}>Optiional</ThemedText>

              <TextInput
                value={referralCode}
                onChangeText={(text: string) => setReferralCode(text)}
                label={'Referral Code'}
                mode='outlined'
                outlineStyle={{ borderRadius: 20 }}
                activeOutlineColor={theme == 'dark' ? light : accent}
                contentStyle={{
                  fontFamily: 'Poppins-Regular',
                  color: theme == 'dark' ? light : appDark
                }}
                style={{
                  backgroundColor: transparent,
                  minheight: 40,
                  maxHeight: 200,
                  marginTop: -20
                }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignContent: 'center',
                  gap: 5
                }}
              >
                <Checkbox
                  status={checked ? 'checked' : 'unchecked'}
                  color={theme == 'dark' ? light : accent}
                  onPress={() => {
                    setChecked(!checked);
                  }}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignContent: 'center',
                    marginTop: 6
                  }}
                >
                  <ThemedText>I agree to the healthtok</ThemedText>
                  <TouchableOpacity>
                    <ThemedText>Terms of Service and Privacy Policy</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <ThemedView style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={setupProfile}
          style={{
            width: '100%',
            height: 40,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            borderRadius: 50,
            backgroundColor: theme == 'dark' ? light : accent
          }}
        >
          {loading && <ActivityIndicator size={18} color={theme == 'dark' ? appDark : light} />}
          <ThemedText darkColor={appDark} lightColor={light} font='Poppins-Bold'>Setup Patient Profile</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </PaperProvider>
  )
}