import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Appbar, PaperProvider } from 'react-native-paper'
import { Image } from 'expo-image'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, appDark, light } from '@/utils/colors'
import { router, useLocalSearchParams } from 'expo-router'
import { ThemedView } from '@/components/ThemedView'
import { Profile } from '@/store/types/profile'
import { auth, db } from '@/utils/fb'
import { getOtherParticipant } from '@/libraries/extractUID'
import { doc, getDoc } from 'firebase/firestore'
import { ThemedText } from '@/components/ThemedText'
import { Buffer } from 'buffer';
import { MedicalRecord } from '@/store/types/records'

export default function patientFile () {
  const theme = useColorScheme()
  const { chatId, conversationData } = useLocalSearchParams<{ chatId: string; conversationData: string }>()

  const parsParams = () => {
    return {
      conversationData: JSON.parse(conversationData)
    }
  }

  const [profile, setProfile] = useState<Profile | null>(null)
  const [records, setRecords] = useState<MedicalRecord | null>(null)

  const fetchProfile = async () => {
    try {
      const uid = getOtherParticipant(parsParams().conversationData?.participants, String(auth.currentUser?.uid))
      const data: any = await getDoc(doc(db, 'users', String(uid)))

      setProfile({ uid: data?.id, ...data.data() })

      fetchMedicalRecord(data?.id, uid)
    } catch (error) {
      console.log('Error fetching patient profile', error)
      return router.back()
    }
  }

  const fetchMedicalRecord = async (id: string, uid: string) => {
    try {
      const data: any = await getDoc(doc(db, 'users', uid, 'records', String(auth.currentUser?.uid)))
      setRecords({ id: data?.id, ...data.data() })
    } catch (error) {
      console.log('Error fetching patient records', error)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [chatId, db])

  if (!profile) {
    return (
      <PaperProvider>
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={theme == 'dark' ? light : accent} />
        </ThemedView>
      </PaperProvider>
    )
  }

  return (
    <PaperProvider>
      <Appbar.Header style={{ backgroundColor: theme == 'dark' ? appDark : light, paddingHorizontal: 20 }}>
        <TouchableOpacity
          onPress={router.back}
          style={{
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            source={require('@/assets/images/icons/arrow_left.png')}
            style={{
              width: 25,
              height: 25,
              tintColor: theme == 'dark' ? light : appDark
            }}
          />
        </TouchableOpacity>
      </Appbar.Header>

      <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{ gap: 40 }} showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: 20
          }}
        >
          <TouchableOpacity
            onPress={() => {
              const encodedLink = Buffer.from(String(profile?.displayImage ? profile?.displayImage?.image : profile?.profilePicture)).toString('base64');

              router.push({
                pathname: '/(app)/viewImage',
                params: { link: encodedLink }
              })
            }}
          >
            <Image
              source={profile?.displayImage ? profile?.displayImage?.image : profile?.profilePicture}
              placeholder={require('@/assets/images/images/avatar.png')}
              contentFit='cover'
              placeholderContentFit='cover'
              transition={300}
              style={{
                width: 120,
                height: 120,
                borderRadius: 100
              }}
            />
          </TouchableOpacity>

          <View style={{ gap: 3 }}>
            <ThemedText type='subtitle' font='Poppins-Bold'>{profile?.name}</ThemedText>
            <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>{profile?.gender || 'Female'}</ThemedText>
            <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>Date of Birth: 14/02/1996</ThemedText>
            <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>Age: 27 years</ThemedText>
          </View>
        </View>

        <View style={{ gap: 20 }}>
          <View style={{ gap: 5 }}>
            <ThemedText type='subtitle' font='Poppins-Bold' lightColor={accent} darkColor={light}>Address</ThemedText>
            <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>{profile?.address || '142 Oak Avenue, Dallas, TX, 10014'}</ThemedText>
          </View>

          <View style={{ gap: 5 }}>
            <ThemedText type='subtitle' font='Poppins-Bold' lightColor={accent} darkColor={light}>Appointment Agenda</ThemedText>
            <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>{parsParams().conversationData?.agender?.reason || 'Asthma'}</ThemedText>
          </View>

          <View style={{ gap: 5 }}>
            <ThemedText type='subtitle' font='Poppins-Bold' lightColor={accent} darkColor={light}>Allergies</ThemedText>
            <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>{parsParams().conversationData?.agender?.allergies || 'Dust mites, pet dander, pollen, mold'}</ThemedText>
          </View>
        </View>

        <View style={{ gap: 20 }}>
          <View style={{ gap: 5 }}>
            <ThemedText type='subtitle' font='Poppins-Bold' lightColor={accent} darkColor={light}>Note</ThemedText>
            <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>{parsParams().conversationData?.agender?.notes || `The patient reports experiencing increased frequency and severity of asthma symptoms over the past [duration]. Symptoms include persistent cough, wheezing, and shortness of breath, particularly at night and early in the morning. The patient notes a recent increase in exposure to known asthma triggers such as [allergen/irritant, e.g., dust, pollen, or smoke].`}</ThemedText>
          </View>

          <View style={{ gap: 5 }}>
            <ThemedText type='subtitle' font='Poppins-Bold' lightColor={accent} darkColor={light}>Past Medical History</ThemedText>
            <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>{parsParams().conversationData?.agender?.complaint || 'Diagnosed a year ago, with a history of moderate asthma attacks'}</ThemedText>
          </View>

          <View style={{ gap: 5 }}>
            <ThemedText type='subtitle' font='Poppins-Bold' lightColor={accent} darkColor={light}>Prescribed Drugs</ThemedText>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 20
              }}
            >
              <Image
                source={require('@/assets/images/icons/dot.png')}
                style={{
                  width: 8,
                  height: 8,
                  tintColor: theme == 'dark' ? light : appDark,
                  opacity: 0.6
                }}
              />

              <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>Benralizumab (Fasenra)</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </PaperProvider>
  )
}