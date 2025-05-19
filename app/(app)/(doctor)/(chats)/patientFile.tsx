import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Appbar, PaperProvider } from 'react-native-paper'
import { Image } from 'expo-image'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, appDark, light } from '@/utils/colors'
import { router, useLocalSearchParams } from 'expo-router'
import { ThemedView } from '@/components/ThemedView'
import { Profile } from '@/store/types/patient/profile'
import { auth, db } from '@/utils/fb'
import { getOtherParticipant } from '@/libraries/extractUID'
import { doc, getDoc } from 'firebase/firestore'
import { ThemedText } from '@/components/ThemedText'
import { Buffer } from 'buffer';
import { MedicalRecord } from '@/store/types/records'
import { calculateAge } from '@/libraries/calculateAge'
import { getAddressFromCoords } from '@/libraries/getAddress'
import NoteList from '@/components/doctorChat/NoteList'
import PrescriptionList from '@/components/doctorChat/PrescriptionList'

export default function patientFile () {
  const theme = useColorScheme()
  const { chatId, conversationData } = useLocalSearchParams<{ chatId: string; conversationData: string }>()

  const parsParams = () => JSON.parse(conversationData)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [records, setRecords] = useState<MedicalRecord | null>(null)

  const fetchProfile = async () => {
    try {
      const uid = getOtherParticipant(parsParams()?.participants, String(auth.currentUser?.uid))
      const data: any = await getDoc(doc(db, 'patient', String(uid)))

      const address = await getAddressFromCoords(data.data().coords?.latitude, data.data().coords?.longitude)

      setProfile({ uid: data?.id, ...data.data(), address })

      fetchMedicalRecord(data?.id, uid)
    } catch (error) {
      console.log('Error fetching patient profile', error)
      return router.back()
    }
  }

  const fetchMedicalRecord = async (id: string, uid: string) => {
    try {
      const data: any = await getDoc(doc(db, 'patient', uid, 'records', String(auth.currentUser?.uid)))
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
              width: 20,
              height: 20,
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
            alignItems: 'center',
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
              transition={500}
              style={{
                width: 120,
                height: 120,
                borderRadius: 100
              }}
            />
          </TouchableOpacity>

          <View style={{ gap: 3 }}>
            <ThemedText type='subtitle' font='Poppins-Bold'>{profile?.name}</ThemedText>
            <ThemedText type='body' font='Poppins-Medium' opacity={0.8} style={{ textTransform: 'capitalize' }}>{profile?.gender || 'Female'}</ThemedText>
            <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>Date of Birth: {new Date(profile?.birth?.seconds * 1000).toDateString()}</ThemedText>
            <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>Age: {calculateAge(profile?.birth)} years</ThemedText>
          </View>
        </View>

        <View style={{ gap: 20 }}>
          <View style={{ gap: 5 }}>
            <ThemedText type='subtitle' font='Poppins-Bold' lightColor={accent} darkColor={light}>Address</ThemedText>
            <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>{profile?.address || '142 Oak Avenue, Dallas, TX, 10014'}</ThemedText>
          </View>

          {
            parsParams()?.appointmentsData?.appointment?.appointment?.reason &&
            <View style={{ gap: 5 }}>
              <ThemedText type='subtitle' font='Poppins-Bold' lightColor={accent} darkColor={light}>Appointment Agenda</ThemedText>
              <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>{parsParams()?.appointmentsData?.appointment?.appointment?.reason}</ThemedText>
            </View>
          }
          {
            profile?.allergies?.length > 0 &&
            <View style={{ gap: 5 }}>
              <ThemedText type='subtitle' font='Poppins-Bold' lightColor={accent} darkColor={light}>Allergies</ThemedText>
              {
                profile?.allergies.map((item: any, index: number) => (
                  <ThemedText
                    key={index}
                    type='body'
                    font='Poppins-Medium'
                    opacity={0.8}
                  >
                    {item}
                  </ThemedText>
                ))
              }
            </View>
          }
        </View>

        <View style={{ gap: 20 }}>
          <NoteList conversationData={parsParams()} chatId={chatId} />

          {/* TODO: render appointment reasons from other appointments from the patient to this doctor or other doctors */}
          {/* <View style={{ gap: 5 }}>
            <ThemedText type='subtitle' font='Poppins-Bold' lightColor={accent} darkColor={light}>Past Medical History</ThemedText>
            <ThemedText type='body' font='Poppins-Medium' opacity={0.8}>{parsParams()?.appointment?.complaint || 'Diagnosed a year ago, with a history of moderate asthma attacks'}</ThemedText>
          </View> */}

          <PrescriptionList conversationData={parsParams()} chatId={chatId} />
        </View>
      </ScrollView>
    </PaperProvider>
  )
}