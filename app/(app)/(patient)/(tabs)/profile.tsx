import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useColorScheme } from '@/hooks/useColorScheme'
import { RootState } from '@/store/types/types'
import { accent, appDark, dark, light, red } from '@/utils/colors'
import { Image } from 'expo-image'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { ActivityIndicator, Appbar, Divider, Modal, PaperProvider, Portal } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { signOut } from 'firebase/auth';
import { auth, db } from '@/utils/fb'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'
import * as ImagePicker from 'expo-image-picker'
import HapticWrapper from '@/components/Harptic'
import CustomImage from '@/components/CustomImage'

export default function profile () {
  const theme = useColorScheme()
  const { profile } = useSelector((state: RootState) => state.patientProfile)

  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [imageLoading, setImageLoading] = useState<boolean>(false)

  const handleLogout = async () => {
    try {
      await signOut(auth);

      await AsyncStorage.removeItem('healthTok_collection')
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
      const photoRef = ref(storage, `patient_avatars/${id}/${new Date()}_avatar.jpg`)

      // Delete the file
      const uploadImage = () => {
        uploadBytes(photoRef, blob)
          .then(snapshot => {
            getDownloadURL(snapshot?.ref)
              .then(async downloadURL => {
                await updateDoc(doc(db, 'patient', String(id)), {
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

            <HapticWrapper
              onPress={handleLogout}
              height={40}
              style={{
                backgroundColor: theme == 'dark' ? red : accent,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50
              }}
            >
              <ThemedText type='default' font='Poppins-Bold' lightColor={light}>Log Out</ThemedText>
            </HapticWrapper>

            <HapticWrapper
              onPress={hideModal}
              height={40}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50
              }}
            >
              <ThemedText type='default' font='Poppins-Bold' lightColor={accent}>Cancel</ThemedText>
            </HapticWrapper>
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
              <CustomImage
                source={profile?.displayImage ? profile?.displayImage?.image : profile?.profilePicture}
                placeholder={require('@/assets/images/images/avatar.png')}
                placeholderContentFit='cover'
                contentFit='cover'
                size={0.4}
                style={{ borderRadius: 100 }}
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
          <TouchableOpacity
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
                <CustomImage
                  source={require('@/assets/images/icons/heart.png')}
                  style={{ tintColor: theme == 'dark' ? light : appDark }}
                  size={0.06}
                />
              </View>

              <ThemedText type='default' font='Poppins-Medium'>My Saved</ThemedText>
            </View>

            <CustomImage
              source={require('@/assets/images/icons/chevron_right.png')}
              style={{ tintColor: theme == 'dark' ? light : appDark }}
              size={0.04}
            />
          </TouchableOpacity>

          <Divider style={{ marginVertical: 20 }} />

          <TouchableOpacity
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
                <CustomImage
                  source={require('@/assets/images/icons/document.png')}
                  style={{ tintColor: theme == 'dark' ? light : appDark }}
                  size={0.06}
                />
              </View>

              <ThemedText type='default' font='Poppins-Medium'>Appointmnet</ThemedText>
            </View>

            <CustomImage
              source={require('@/assets/images/icons/chevron_right.png')}
              style={{ tintColor: theme == 'dark' ? light : appDark }}
              size={0.04}
            />
          </TouchableOpacity>

          <Divider style={{ marginVertical: 20 }} />

          <TouchableOpacity
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
                <CustomImage
                  source={require('@/assets/images/icons/wallet.png')}
                  style={{ tintColor: theme == 'dark' ? light : appDark }}
                  size={0.06}
                />
              </View>

              <ThemedText type='default' font='Poppins-Medium'>Payment Method</ThemedText>
            </View>

            <CustomImage
              source={require('@/assets/images/icons/chevron_right.png')}
              style={{ tintColor: theme == 'dark' ? light : appDark }}
              size={0.04}
            />
          </TouchableOpacity>

          <Divider style={{ marginVertical: 20 }} />

          <TouchableOpacity
            onPress={() => router.navigate('/(app)/(patient)/(faq)/faq')}
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
                <CustomImage
                  source={require('@/assets/images/icons/chat.png')}
                  style={{ tintColor: theme == 'dark' ? light : appDark }}
                  size={0.06}
                />
              </View>

              <ThemedText type='default' font='Poppins-Medium'>FAQs</ThemedText>
            </View>

            <CustomImage
              source={require('@/assets/images/icons/chevron_right.png')}
              style={{ tintColor: theme == 'dark' ? light : appDark }}
              size={0.04}
            />
          </TouchableOpacity>

          <Divider style={{ marginVertical: 20 }} />

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
                <CustomImage
                  source={require('@/assets/images/icons/danger_circle.png')}
                  style={{ tintColor: red }}
                  size={0.06}
                />
              </View>

              <ThemedText type='default' font='Poppins-Medium' darkColor={red} lightColor={red}>Logout</ThemedText>
            </View>

            <CustomImage
              source={require('@/assets/images/icons/chevron_right.png')}
              style={{ tintColor: theme == 'dark' ? light : appDark }}
              size={0.04}
            />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </PaperProvider>
  )
}