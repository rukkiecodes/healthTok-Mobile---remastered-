import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Appbar, Checkbox, Modal, PaperProvider, Portal, TextInput } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { accent, appDark, light, transparent } from '@/utils/colors'
import { TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import { ThemedText } from '@/components/ThemedText'
import { useLocalSearchParams } from 'expo-router'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { KeyboardAvoidingView } from 'react-native'
import { Platform } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native'
import { Keyboard } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import HapticWrapper from '@/components/Harptic'
import { getOtherParticipant } from '@/libraries/extractUID'
import { auth, db } from '@/utils/fb'
import { addDoc, collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore'

export default function addPresriptions () {
  const theme = useColorScheme()
  const { chatId, conversationData } = useLocalSearchParams<{ chatId: string; conversationData: string }>()

  const { profile } = useSelector((state: RootState) => state.profile)
  const [loading, setLoading] = useState<boolean>(false)
  const [injectableChecked, setInjectableChecked] = useState(false);
  const [oralChecked, setOralChecked] = useState(false);
  const [prescriptionType, setPrescriptionType] = useState('')
  const [name, setName] = useState('')
  const [dosage, setDosage] = useState('')
  const [duration, setDuration] = useState('')
  const [modalVisible, setModalVisible] = useState(false);

  const parsParams = () => JSON.parse(conversationData)

  const savePresriptions = async () => {
    // setModalVisible(true)
    try {
      if (!prescriptionType || !name || !dosage || !duration) return

      setLoading(true)
      const uid = getOtherParticipant(parsParams()?.participants, String(auth.currentUser?.uid))

      const save = async () => {
        await addDoc(collection(db, 'patient', uid, 'presriptions', String(auth.currentUser?.uid), 'presriptions'), {
          prescriptionType,
          name,
          dosage,
          duration,
          author: profile,
          createdAt: new Date(),
          timestamp: serverTimestamp()
        })
        setLoading(false)
        setModalVisible(true)
      }

      const q = await getDocs(collection(db, 'patient', uid, 'presriptions'))

      if (q.empty) {
        await setDoc(doc(db, 'patient', uid, 'presriptions', String(auth.currentUser?.uid)), {
          timestamp: serverTimestamp()
        })
        save()
      } else save()
    } catch (error) {
      console.log('Error adding prescription', error)
    }
  }

  const validateSave = () => {
    if (!prescriptionType || !name || !dosage || !duration) return false
    else return true
  }

  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
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
            You have successfully sent a prescription.
          </ThemedText>

          <HapticWrapper
            onPress={() => {
              router.dismissTo({
                pathname: '/(app)/(doctor)/(chats)/(prescription)/sent',
                params: { chatId: chatId, conversationData: conversationData }
              })
              setModalVisible(false)
            }}
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
            <ThemedText type='body' font='Poppins-Bold' lightColor={light} darkColor={appDark}>Done</ThemedText>
          </HapticWrapper>
        </Modal>
      </Portal>

      <Appbar.Header
        style={{
          backgroundColor: theme == 'dark' ? appDark : light,
          paddingHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between'
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
          <ThemedText type='subtitle' font='Poppins-Bold'>Add Presriptions</ThemedText>
        </View>

        <TouchableOpacity
          onPress={savePresriptions}
          disabled={!validateSave() || loading}
          style={{
            paddingHorizontal: 20,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {
            loading ?
              <ActivityIndicator size={12} color={theme == 'dark' ? light : accent} /> :
              <ThemedText lightColor={accent} type='default' font='Poppins-Medium'>Add</ThemedText>
          }
        </TouchableOpacity>
      </Appbar.Header>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ThemedView style={{ flex: 1, padding: 20, gap: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <ThemedText type='default' font='Poppins-Bold'>Injectables</ThemedText>

              <Checkbox
                status={injectableChecked ? 'checked' : 'unchecked'}
                color={theme == 'dark' ? light : accent}
                onPress={() => {
                  setInjectableChecked(!injectableChecked);
                  setOralChecked(false)
                  setPrescriptionType('injectables')
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <ThemedText type='default' font='Poppins-Bold'>Orals</ThemedText>

              <Checkbox
                status={oralChecked ? 'checked' : 'unchecked'}
                color={theme == 'dark' ? light : accent}
                onPress={() => {
                  setOralChecked(!oralChecked);
                  setInjectableChecked(false)
                  setPrescriptionType('Tablet')
                }}
              />
            </View>

            <TextInput
              value={name}
              mode='outlined'
              label={'Medication Name'}
              outlineStyle={{ borderRadius: 12 }}
              onChangeText={text => setName(text)}
              style={{ backgroundColor: transparent }}
              outlineColor={theme == 'dark' ? light : accent}
            />

            <TextInput
              value={dosage}
              mode='outlined'
              label={'Medication dosage'}
              outlineStyle={{ borderRadius: 12 }}
              onChangeText={text => setDosage(text)}
              style={{ backgroundColor: transparent }}
              outlineColor={theme == 'dark' ? light : accent}
            />

            <TextInput
              value={duration}
              mode='outlined'
              label={'Medication duration'}
              outlineStyle={{ borderRadius: 12 }}
              onChangeText={text => setDuration(text)}
              style={{ backgroundColor: transparent }}
              outlineColor={theme == 'dark' ? light : accent}
            />
          </ThemedView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </PaperProvider>
  )
}