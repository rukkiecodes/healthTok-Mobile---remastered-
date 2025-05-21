import { View, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Appbar, PaperProvider, RadioButton } from 'react-native-paper'
import { Image } from 'expo-image'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, appDark, dark, green, light, transparent } from '@/utils/colors'
import { router } from 'expo-router'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import * as ImagePicker from 'expo-image-picker'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/utils/fb'
import { ThemedText } from '@/components/ThemedText'
import { DatePickerModal } from 'react-native-paper-dates'
import HapticWrapper from '@/components/Harptic'
import medicalExperienceLevels from '@/libraries/experienceLevels'

const labguageLevel = [
  "Poor",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Proficient"
]

interface MedicalExperienceLevel {
  id: number;
  name: string;
  description: string;
  years: string;
}

export default function personalData () {
  const theme = useColorScheme()
  const { profile } = useSelector((state: RootState) => state.doctorProfile)

  const [imageLoading, setImageLoading] = useState<boolean>(false)
  const [showGender, setShowGender] = useState(false)
  const [openDate, setOpenDate] = useState(false);
  const [loading, setLoading] = useState(false)

  const [activeLanguage, setActiveLanguage] = useState('')
  const [experienceLevel, setExperienceLevel] = useState<MedicalExperienceLevel | null>(null)
  const [name, setName] = useState<string>(profile?.name || '')
  const [phone, setPhone] = useState<string>(profile?.phone || '')
  const [email, setEmail] = useState<string>(profile?.email || '')
  const [birth, setBirth] = useState<any>(null)
  const [gender, setGender] = useState<string>(profile?.gender || '')

  const onDismissSingle = React.useCallback(() => {
    setOpenDate(false);
  }, [setOpenDate]);

  const onConfirmSingle = React.useCallback(
    (params: any) => {
      setOpenDate(false);
      saveBirth(params.date)
    },
    [setOpenDate, setBirth]
  );

  const pickImage = async () => {
    const id = auth.currentUser?.uid;

    const storage = getStorage()

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result?.canceled) {
      setImageLoading(true)

      const blob: any = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)

        xhr.responseType = 'blob'
        xhr.open('GET', result.assets[0].uri, true)
        xhr.send(null)
      })

      const oldRef = ref(storage, profile?.displayImage?.path)
      const photoRef = ref(storage, `doctors_avatars/${id}/${new Date()}_avatar.jpg`)

      // Delete the file
      const uploadImage = () => {
        uploadBytes(photoRef, blob)
          .then(snapshot => {
            getDownloadURL(snapshot?.ref)
              .then(async downloadURL => {
                await updateDoc(doc(db, 'doctors', String(id)), {
                  displayImage: {
                    image: downloadURL,
                    path: photoRef.fullPath
                  }
                })
              })
          })
          .finally(() => {
            setImageLoading(false)
          })
      }

      // Delete the file
      if (profile?.displayImage)
        deleteObject(oldRef)
          .then(() => {
            uploadImage()
          }).catch((error) => {
            alert('Error uploading display picture')
            setImageLoading(false)
          });

      else uploadImage()
    }
  }

  const saveBirth = async (date: any) => {
    try {
      setLoading(true)
      await updateDoc(doc(db, 'doctors', String(auth.currentUser?.uid)), {
        birth: date
      })
      setLoading(false)
    } catch (error) {
      console.log('Error update profile: ', error)
      setLoading(false)
    }
  }

  const save = async () => {
    try {
      setLoading(true)
      await updateDoc(doc(db, 'doctors', String(auth.currentUser?.uid)), {
        name,
        phone,
        email,
        gender,
        activeLanguage,
        experienceLevel
      })
      setLoading(false)
    } catch (error) {
      console.log('Error update profile: ', error)
      setLoading(false)
    }
  }

  return (
    <PaperProvider>
      <Appbar.Header
        style={{
          paddingHorizontal: 20,
          backgroundColor: theme == 'dark' ? appDark : light,
          justifyContent: 'space-between'
        }}
      >
        <TouchableOpacity
          onPress={router.back}
          style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            source={require('@/assets/images/icons/arrow_left.png')}
            contentFit='contain'
            style={{
              width: 20,
              height: 20,
              tintColor: theme == 'dark' ? light : appDark
            }}
          />
        </TouchableOpacity>

        <ThemedText type='subtitle'>Personal Data</ThemedText>

        <View style={{ width: 40 }} />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
              <View style={{ alignItems: 'center', paddingVertical: 50 }}>
                <View
                  style={{
                    width: 100,
                    height: 100,
                    backgroundColor: theme == 'dark' ? appDark : light,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    position: 'relative'
                  }}
                >
                  <View
                    style={{
                      width: 100,
                      height: 100,
                      backgroundColor: theme == 'dark' ? appDark : light,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 100,
                      overflow: 'hidden'
                    }}
                  >
                    <Image
                      source={profile?.displayImage ? profile?.displayImage?.image : (profile?.profilePicture ? profile?.profilePicture : require('@/assets/images/icons/profileFilled.png'))}
                      placeholder={require('@/assets/images/icons/profileFilled.png')}
                      contentFit='cover'
                      placeholderContentFit='cover'
                      transition={500}
                      style={{
                        width: profile?.displayImage ? 100 : (profile?.profilePicture ? 100 : 80),
                        height: profile?.displayImage ? 100 : (profile?.profilePicture ? 100 : 80),
                        tintColor: profile?.displayImage ? '' : (profile?.profilePicture ? '' : (theme == 'dark' ? light : dark))
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={pickImage}
                    style={{
                      backgroundColor: light,
                      width: 25,
                      height: 25,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 100,
                      position: 'absolute',
                      bottom: 5,
                      right: 5
                    }}
                  >
                    {
                      imageLoading ? <ActivityIndicator color={accent} size={16} /> :
                        <Image
                          source={require('@/assets/images/icons/camera.png')}
                          style={{
                            width: 16,
                            height: 16,
                            tintColor: accent
                          }}
                        />
                    }
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ gap: 5, marginTop: 20 }}>
                <ThemedText type='body' font='Poppins-Bold'>Full Name</ThemedText>
                <TextInput
                  value={name}
                  placeholder='Full Name'
                  placeholderTextColor={`${theme == 'dark' ? light : appDark}33`}
                  onChangeText={text => setName(text)}
                  style={{
                    height: 40,
                    paddingHorizontal: 20,
                    borderWidth: 1,
                    borderRadius: 12,
                    fontFamily: 'Poppins-Medium',
                    color: theme == 'dark' ? light : appDark,
                    borderColor: `${theme == 'dark' ? light : appDark}33`
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={() => setOpenDate(true)}
                style={{
                  height: 40,
                  paddingHorizontal: 20,
                  borderWidth: 1,
                  borderRadius: 12,
                  borderColor: `${theme == 'dark' ? light : appDark}33`,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 20
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

              <TouchableOpacity
                onPress={() => setShowGender(!showGender)}
                style={{
                  height: 40,
                  paddingHorizontal: 20,
                  borderWidth: 1,
                  borderRadius: 12,
                  borderColor: `${theme == 'dark' ? light : appDark}33`,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 20
                }}
              >
                <ThemedText>Gender: {gender}</ThemedText>

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
                      onPress={() => setGender('male')}
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
                      onPress={() => setGender('female')}
                      status={gender === 'female' ? 'checked' : 'unchecked'}
                    />
                  </View>
                </View>
              }

              <View style={{ gap: 5, marginTop: 20 }}>
                <ThemedText type='body' font='Poppins-Bold'>Phone</ThemedText>
                <TextInput
                  value={phone}
                  placeholder='Phone'
                  placeholderTextColor={`${theme == 'dark' ? light : appDark}33`}
                  onChangeText={text => setPhone(text)}
                  inputMode='tel'
                  style={{
                    height: 40,
                    paddingHorizontal: 20,
                    borderWidth: 1,
                    borderRadius: 12,
                    fontFamily: 'Poppins-Medium',
                    color: theme == 'dark' ? light : appDark,
                    borderColor: `${theme == 'dark' ? light : appDark}33`
                  }}
                />
              </View>

              <View style={{ gap: 5, marginTop: 20 }}>
                <ThemedText type='body' font='Poppins-Bold'>Email</ThemedText>
                <TextInput
                  value={email}
                  placeholder='Email'
                  placeholderTextColor={`${theme == 'dark' ? light : appDark}33`}
                  onChangeText={text => setEmail(text)}
                  inputMode='email'
                  style={{
                    height: 40,
                    paddingHorizontal: 20,
                    borderWidth: 1,
                    borderRadius: 12,
                    fontFamily: 'Poppins-Medium',
                    color: theme == 'dark' ? light : appDark,
                    borderColor: `${theme == 'dark' ? light : appDark}33`
                  }}
                />
              </View>

              <ThemedText style={{ marginTop: 40 }} type='subtitle'>Communication Skills</ThemedText>
              <View
                style={{
                  padding: 20,
                  borderRadius: 12,
                  marginTop: 20,
                  borderWidth: 1,
                  borderColor: `${theme == 'dark' ? light : appDark}20`,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 20
                }}
              >
                <ThemedText type='default'>English Proficiency:</ThemedText>

                <View style={{ flex: 1, gap: 10 }}>
                  {
                    labguageLevel.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setActiveLanguage(item)}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <ThemedText opacity={0.6}>{item}</ThemedText>
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            backgroundColor: activeLanguage == item ? green : transparent,
                            borderRadius: 50
                          }}
                        />
                      </TouchableOpacity>
                    ))
                  }
                </View>
              </View>

              <ThemedText style={{ marginTop: 40 }} type='subtitle'>Experience Level</ThemedText>
              <View
                style={{
                  padding: 20,
                  borderRadius: 12,
                  marginTop: 20,
                  borderWidth: 1,
                  borderColor: `${theme == 'dark' ? light : appDark}20`,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 20,
                  marginBottom: 20
                }}
              >
                <View style={{ flex: 1, gap: 20 }}>
                  {
                    medicalExperienceLevels.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setExperienceLevel(item)}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <View>
                          <ThemedText type='default' font='Poppins-Bold'>{item.name}</ThemedText>
                          <ThemedText type='body' opacity={0.6}>{item.years}</ThemedText>
                          <ThemedText type='body' opacity={0.6}>{item.description}</ThemedText>
                        </View>
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            backgroundColor: experienceLevel?.name == item.name ? green : transparent,
                            borderRadius: 50
                          }}
                        />
                      </TouchableOpacity>
                    ))
                  }
                </View>
              </View>
            </ScrollView>

            <HapticWrapper
              onPress={save}
              height={40}
              style={{
                backgroundColor: accent,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
                height: 40,
                borderRadius: 50,
                margin: 20
              }}
            >
              {loading && <ActivityIndicator color={light} size={16} />}
              <ThemedText lightColor={light} type='body' font='Poppins-Bold'>Save</ThemedText>
            </HapticWrapper>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </PaperProvider>
  )
}