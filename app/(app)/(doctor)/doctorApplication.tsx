import React, { useState } from 'react'
import { ActivityIndicator, Appbar, Modal, PaperProvider, Portal } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { Image } from 'expo-image'
import { accent, appDark, green, light, transparent } from '@/utils/colors'
import { ThemedText } from '@/components/ThemedText'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import HapticWrapper from '@/components/Harptic'
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '@/utils/fb'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { router } from 'expo-router'

const labguageLevel = [
  "Poor",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Proficient"
]

export default function doctorApplication () {
  const theme = useColorScheme()

  const [activeLanguage, setActiveLanguage] = useState('')

  const [MedicalDegree, setMedicalDegree] = useState('')
  const [Specialty, setSpecialty] = useState('')
  const [BoardCertification, setBoardCertification] = useState('')
  const [CV, setCV] = useState('')
  const [GovernmentIssuedID, setGovernmentIssuedID] = useState('')

  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false);


  const pickMedicalDegreeImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setMedicalDegree(result.assets[0].uri)
    }
  }

  const pickSpecialtyImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setSpecialty(result.assets[0].uri)
    }
  }

  const pickBoardCertificationImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setBoardCertification(result.assets[0].uri)
    }
  }

  const pickCV = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setCV(result.assets[0].uri)
    }
  }

  const pickGovernmentIssuedID = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setGovernmentIssuedID(result.assets[0].uri)
    }
  }

  const uploadImages = async (images: { [key: string]: any }) => {
    const id = auth.currentUser?.uid
    const storage = getStorage()

    try {
      const uploadedImages: { [key: string]: any } = {};
      setLoading(true);

      // Upload each image or array of images
      const uploadPromises = Object.entries(images).map(async ([key, image]) => {
        if (!image) return; // Skip if no image provided

        if (Array.isArray(image)) {
          console.log('images are an array')
          // Handle arrays of images
          const uploadedArray = await Promise.all(
            image.map(async (img) => {
              const blob: any = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => resolve(xhr.response);
                xhr.responseType = "blob";
                xhr.open("GET", img, true);
                xhr.send(null);
              });

              const photoRef = ref(storage, `credentials/${id}/${new Date().getTime()}_${Math.random()}_doctor_credentials.jpg`);
              const snapshot = await uploadBytes(photoRef, blob);
              const downloadURL = await getDownloadURL(snapshot.ref);

              return { downloadURL, path: photoRef.fullPath }; // Return for this image
            })
          );

          uploadedImages[key] = uploadedArray; // Store array of uploaded images
        } else {
          // Handle single image
          const blob: any = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => resolve(xhr.response);
            xhr.responseType = "blob";
            xhr.open("GET", image, true);
            xhr.send(null);
          });

          const photoRef = ref(storage, `credentials/${id}/${new Date().getTime()}_${Math.random()}_doctor_credentials.jpg`);
          const snapshot = await uploadBytes(photoRef, blob);
          const downloadURL = await getDownloadURL(snapshot.ref);

          uploadedImages[key] = { downloadURL, path: photoRef.fullPath }; // Store single image
        }
      });

      await Promise.all(uploadPromises); // Wait for all uploads to complete

      const carRef = await addDoc(collection(db, 'doctors', String(id), 'credentials'), {
        carOwner: id,
        images: uploadedImages,
        isApplicationSubmited: true,
        isApplicationSuccessful: false,
        activeLanguage,
        timestamp: serverTimestamp(),
      });

      await updateDoc(doc(db, 'doctors', String(id)), {
        isApplicationSubmited: true,
        activeLanguage
      })

      setVisible(true)
      setLoading(false)
    } catch (error) {
      console.error('Error during image upload:', error);
      setLoading(false);
    }
  }

  const done = () => {
    const uploadObject = {
      MedicalDegree,
      Specialty,
      BoardCertification,
      CV,
      GovernmentIssuedID
    }

    uploadImages(uploadObject)
  }


  return (
    <PaperProvider>
      <Appbar.Header style={{ paddingHorizontal: 20, backgroundColor: theme == 'dark' ? appDark : light, justifyContent: 'center' }}>
        <ThemedText type='subtitle' font='Poppins-Bold'>Application</ThemedText>
      </Appbar.Header>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={{
            backgroundColor: theme == 'dark' ? appDark : light,
            borderRadius: 20,
            padding: 40,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 40
          }}
        >
          <View
            style={{
              width: 120,
              height: 120,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme == 'dark' ? `${light}33` : `${accent}33`,
              borderRadius: 100,
              marginBottom: 20
            }}
          >
            <Image
              source={require('@/assets/images/icons/check.png')}
              style={{
                width: 80,
                height: 80,
                tintColor: theme == 'dark' ? light : accent
              }}
            />
          </View>

          <ThemedText type='title' font='Poppins-Bold'>Success</ThemedText>

          <ThemedText type='default' font='Poppins-Regular' opacity={0.5} style={{ textAlign: 'center' }}>
            Your application has been submitted for review. You will be notified when your profle gets verified
          </ThemedText>

          <HapticWrapper
            onPress={() => router.dismissTo('/(app)/(doctor)/(tabs)/home')}
            style={{
              height: 50,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginTop: 20,
              backgroundColor: theme == 'dark' ? light : accent
            }}
          >
            <ThemedText type='body' font='Poppins-Bold' lightColor={light} darkColor={appDark}>Explore</ThemedText>
          </HapticWrapper>
        </Modal>
      </Portal>

      <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
        <ThemedText type='subtitle'>Medical Credentials</ThemedText>

        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            onPress={() => pickMedicalDegreeImage()}
            style={{
              height: 50,
              borderRadius: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: `${theme == 'dark' ? light : appDark}20`,
              paddingHorizontal: 20
            }}
          >
            <ThemedText type='body'>Medical Degree</ThemedText>

            <Image
              source={MedicalDegree ? require('@/assets/images/icons/check.png') : require('@/assets/images/icons/export.png')}
              contentFit='contain'
              style={{
                width: 20,
                height: 20,
                tintColor: MedicalDegree ? green : (theme == 'dark' ? light : appDark)
              }}
            />
          </TouchableOpacity>
          <ThemedText type='body' opacity={0.6}>Upload proof of medial school graduation</ThemedText>
        </View>

        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            onPress={pickSpecialtyImage}
            style={{
              height: 50,
              borderRadius: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: `${theme == 'dark' ? light : appDark}20`,
              paddingHorizontal: 20
            }}
          >
            <ThemedText type='body'>Specialty</ThemedText>

            <Image
              source={Specialty ? require('@/assets/images/icons/check.png') : require('@/assets/images/icons/export.png')}
              contentFit='contain'
              style={{
                width: 20,
                height: 20,
                tintColor: Specialty ? green : (theme == 'dark' ? light : appDark)
              }}
            />
          </TouchableOpacity>
          <ThemedText type='body' opacity={0.6}>Upload proof of specialization if applicable. (Disregard if you are a general practitioner)</ThemedText>
        </View>

        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            onPress={pickBoardCertificationImage}
            style={{
              height: 50,
              borderRadius: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: `${theme == 'dark' ? light : appDark}20`,
              paddingHorizontal: 20
            }}
          >
            <ThemedText type='body'>Board Certification</ThemedText>

            <Image
              source={BoardCertification ? require('@/assets/images/icons/check.png') : require('@/assets/images/icons/export.png')}
              contentFit='contain'
              style={{
                width: 20,
                height: 20,
                tintColor: BoardCertification ? green : (theme == 'dark' ? light : appDark)
              }}
            />
          </TouchableOpacity>
          <ThemedText type='body' opacity={0.6}>Upload proof of certification from your relevant medical board or professional bodies in your area of specialty</ThemedText>
        </View>

        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            onPress={pickCV}
            style={{
              height: 50,
              borderRadius: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: `${theme == 'dark' ? light : appDark}20`,
              paddingHorizontal: 20
            }}
          >
            <ThemedText type='body'>CV</ThemedText>

            <Image
              source={CV ? require('@/assets/images/icons/check.png') : require('@/assets/images/icons/export.png')}
              contentFit='contain'
              style={{
                width: 20,
                height: 20,
                tintColor: CV ? green : (theme == 'dark' ? light : appDark)
              }}
            />
          </TouchableOpacity>
          <ThemedText type='body' opacity={0.6}>Provide your detailed CV outlining your education, training, and work experience</ThemedText>
        </View>

        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            onPress={pickGovernmentIssuedID}
            style={{
              height: 50,
              borderRadius: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: `${theme == 'dark' ? light : appDark}20`,
              paddingHorizontal: 20
            }}
          >
            <ThemedText type='body'>Government-issued ID</ThemedText>

            <Image
              source={GovernmentIssuedID ? require('@/assets/images/icons/check.png') : require('@/assets/images/icons/export.png')}
              contentFit='contain'
              style={{
                width: 20,
                height: 20,
                tintColor: GovernmentIssuedID ? green : (theme == 'dark' ? light : appDark)
              }}
            />
          </TouchableOpacity>
          <ThemedText type='body' opacity={0.6}>Upload a valid government-issued ID. (Such as a National ID, Passport, or Driver’s License)</ThemedText>
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
      </ScrollView>

      <HapticWrapper
        onPress={done}
        style={{
          backgroundColor: accent,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          height: 50,
          borderRadius: 50,
          margin: 20
        }}
      >
        {loading && <ActivityIndicator color={light} size={16} />}
        <ThemedText type='body' font='Poppins-Bold'>Submit</ThemedText>
      </HapticWrapper>
    </PaperProvider>
  )
}