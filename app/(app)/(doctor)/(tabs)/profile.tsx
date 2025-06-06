import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/utils/fb'
import { ActivityIndicator, Divider, Modal, PaperProvider, Portal } from 'react-native-paper'
import { StatusBar } from 'expo-status-bar'
import { accent, appDark, dark, light, red } from '@/utils/colors'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'

export default function profile () {
  const theme = useColorScheme()
  const { profile } = useSelector((state: RootState) => state.doctorProfile)

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [imageLoading, setImageLoading] = useState<boolean>(false)

  const handleLogout = async () => {
    try {
      await signOut(auth);

      router.replace('/(auth)/home')
    } catch (error) {
      console.log('❌ Error signing out:', error);
    }
  };

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

  const buttons = [
    {
      action: () => router.navigate('/(app)/(doctor)/personalData'),
      image: require('@/assets/images/icons/profile.png'),
      title: 'Personal Data',
      divide: true
    },
    {
      action: () => router.navigate('/(app)/(doctor)/appointment'),
      image: require('@/assets/images/icons/document.png'),
      title: 'Appointment',
      divide: true
    },
    {
      action: () => router.navigate('/(app)/(doctor)/pricing'),
      image: require('@/assets/images/icons/wallet.png'),
      title: 'Pricing',
      divide: true
    },
    // {
    //   action: () => router.navigate('/(app)/(doctor)/resources'),
    //   image: require('@/assets/images/icons/file_dock_search.png'),
    //   title: 'Resources',
    //   divide: true
    // },
    {
      action: () => router.navigate('/(app)/(doctor)/(faq)/faq'),
      image: require('@/assets/images/icons/chat.png'),
      title: 'FAQs',
      divide: true
    },
  ]

  return (
    <PaperProvider>
      <StatusBar style='light' />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: theme == 'dark' ? appDark : light,
            padding: 30,
            paddingVertical: 50,
            borderRadius: 30,
            margin: 30,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 30
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('@/assets/images/icons/logout.png')}
              contentFit='contain'
              style={{
                width: 40,
                height: 40,
                tintColor: theme == 'dark' ? light : accent
              }}
            />
          </View>

          <View style={{ gap: 20 }}>
            <ThemedText type='subtitle' font='Poppins-Bold' style={{ textAlign: 'center' }} opacity={0.7}>Are you sure to log out of your account?</ThemedText>

            <TouchableOpacity
              onPress={handleLogout}
              style={{
                backgroundColor: theme == 'dark' ? red : accent,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50
              }}
            >
              <ThemedText type='default' font='Poppins-Bold' lightColor={light}>Log Out</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50
              }}
            >
              <ThemedText type='default' font='Poppins-Bold' lightColor={accent}>Cancel</ThemedText>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>

      <ThemedView style={{ flex: 1, backgroundColor: accent, position: 'relative' }}>
        <View
          style={{
            height: 400,
            gap: 20,
            justifyContent: 'center',
            alignItems: 'center'
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

          <ThemedText type='subtitle' font='Poppins-Bold' lightColor={light}>{profile?.name}</ThemedText>
        </View>

        <ThemedView
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            padding: 20,
            width: '100%',
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50
          }}
        >
          {
            buttons.map((item, index) => (
              <View key={index}>
                <TouchableOpacity
                  onPress={item.action}
                  style={{
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
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 100,
                        backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`
                      }}
                    >
                      <Image
                        source={item.image}
                        style={{
                          width: 25,
                          height: 25,
                          tintColor: theme == 'dark' ? light : appDark
                        }}
                      />
                    </View>

                    <ThemedText type='default' font='Poppins-Medium'>{item.title}</ThemedText>
                  </View>

                  <Image
                    source={require('@/assets/images/icons/chevron_right.png')}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: theme == 'dark' ? light : appDark
                    }}
                  />
                </TouchableOpacity>

                {item.divide && <Divider style={{ marginVertical: 20 }} />}
              </View>
            ))
          }

          <TouchableOpacity
            onPress={showModal}
            style={{
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
              <View
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 100,
                  backgroundColor: `${red}33`
                }}
              >
                <Image
                  source={require('@/assets/images/icons/danger_circle.png')}
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: red
                  }}
                />
              </View>

              <ThemedText type='default' font='Poppins-Medium' darkColor={red} lightColor={red}>Logout</ThemedText>
            </View>

            <Image
              source={require('@/assets/images/icons/chevron_right.png')}
              style={{
                width: 20,
                height: 20,
                tintColor: theme == 'dark' ? light : appDark
              }}
            />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </PaperProvider>
  )
}